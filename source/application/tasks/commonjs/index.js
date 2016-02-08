import {debuglog} from 'util';
import denodeify from 'denodeify';

import {
	resolve,
	join,
	dirname,
	extname,
	relative
} from 'path';

import {
	readFile as readFileNodeback
} from 'fs';

import merge from 'lodash.merge';
import {
	find,
	omit
} from 'lodash';
import throat from 'throat';
import chalk from 'chalk';
import exists from 'path-exists';

import copyDirectory from '../../../library/filesystem/copy-directory';
import removeFile from '../../../library/filesystem/remove-file';
import writeSafe from '../../../library/filesystem/write-safe';
import resolvePathFormatString from '../../../library/resolve-utilities/resolve-path-format-string';
import getArtifactMtimes from '../../../library/utilities/get-artifact-mtimes';
import getArtifactsToPrune from '../../../library/utilities/get-artifacts-to-prune';
import getPatterns from '../../../library/utilities/get-patterns';
import getPatternMtimes from '../../../library/utilities/get-pattern-mtimes';
import getPatternsToBuild from '../../../library/utilities/get-patterns-to-build';
import getPackageString from './get-package-string';

import {
	ok,
	wait,
	ready
} from '../../../library/log/decorations';

const pkg = require(resolve(process.cwd(), 'package.json'));
const readFile = denodeify(readFileNodeback);

async function exportAsCommonjs(application, settings) {
	const debug = debuglog('commonjs');
	debug('calling commonjs with');
	debug(settings);

	const taskStart = new Date();
	const cwd = application.runtime.patterncwd || application.runtime.cwd;

	const patternHook = application.hooks.filter((hook) => hook.name === 'patterns')[0];
	const patternRoot = resolve(cwd, patternHook.configuration.path);
	const staticRoot = resolve(cwd, 'static');
	const commonjsRoot = resolve(cwd, 'distribution');

	const manifestPath = resolve(commonjsRoot, 'package.json');
	application.configuration = merge({}, application.configuration, application.configuration.commonjs);

	// Reconfigure the cache
	application.cache.config = merge({},
		application.cache.config,
		application.configuration.patterns.cache
	);

	// Update formats to the current buildFormats (this is required to e.g. reduce transformers for build)
	for (const name of Object.keys(application.configuration.commonjs.patterns.formats)) {
		const present = application.configuration.patterns.formats[name] || {};
		const override = application.configuration.commonjs.patterns.formats[name] || {};
		present.transforms = override.transforms ? override.transforms : present.transforms;
	}

	// start reading pattern mtimes, ignore dependencies
	const mtimesStart = new Date();
	application.log.info(wait`Obtaining pattern modification times`);
	const readingPatternMtimes = getPatternMtimes('./patterns', {
		resolveDependencies: false
	});

	// start reading artifact mtimes
	const artifactMtimesStart = new Date();
	application.log.info(wait`Obtaining artifact modification times`);
	const readingArtifactMtimes = getArtifactMtimes('./', application.configuration.patterns);

	// wait for all mtimes to trickle in
	const patternMtimes = await readingPatternMtimes;
	application.log.info(ok`Read pattern modification times ${mtimesStart}`);

	// wait for all artifact mtimes
	const artifactMtimes = await readingArtifactMtimes;
	application.log.info(ok`Read artifact modification times ${artifactMtimesStart}`);

	// check if package.json is in distribution
	const hasManifest = await exists(resolve(commonjsRoot, 'package.json'));

	// obtain patterns we have to build
	const selectionStart = new Date();
	application.log.info(wait`Calculating pattern collection to build`);
	const patternsToBuild = hasManifest ?
		patternMtimes
			.filter(getPatternsToBuild(artifactMtimes, application.configuration.patterns))
			.sort((a, b) => b.mtime.getTime() - a.mtime.getTime()) :
		patternMtimes;

		application.log.info(ok`Calculated pattern collection to build ${selectionStart}`);
		application.log.info(wait`Building ${patternsToBuild.length} of ${patternMtimes.length} patterns`);

	if (!hasManifest) {
		application.log.info(ok`Target folder has no manifest file, building all patterns`);
	}

	// dependency registry
	let externalDependencies = [];
	let externalDevDependencies = [];

	// build patterns in parallel
	const buildStart = new Date();
	const building = Promise.all(patternsToBuild.map(throat(5, async pattern => {
		const filterStart = new Date();
		application.log.info(wait`Checking for files of ${pattern.id} to exclude from transform.`);

		const filters = {...application.configuration.filters};
		let changedFiles = [];

		// enhance filters config to build only files that are modified
		const artifact = find(artifactMtimes, {id: pattern.id});

		if (artifact) {
			// build up mtime registry for pattern files
			const filesMtimes = pattern.files.reduce((results, file, index) => {
				return {...results, [file]: pattern.mtimes[index]};
			}, {});

			// build up registry for artifact files
			const artifactFilesMtimes = artifact.files.reduce((results, file, index) => {
				const path = relative(commonjsRoot, file);
				return {...results, [path]: artifact.mtimes[index]};
			}, {});

			// find pattern files with newer mtime than
			// - their artifact
			// - their folder
			// - their pattern.json
			changedFiles = pattern.files.filter(file => {
				const formatKey = extname(file).slice(1);
				const format = application.configuration.patterns.formats[formatKey];
				if (!format) {
					return false;
				}
				const transformNames = format.transforms || [];
				const lastTransformName = transformNames[transformNames.length - 1];
				const lastTransform = application.configuration.transforms[lastTransformName] || {};
				const targetExtension = lastTransform.outFormat || formatKey;
				const targetFile = resolvePathFormatString(
					application.configuration.commonjs.resolve,
					pattern.id,
					format.name,
					targetExtension
				);

				const targetFileMtime = artifactFilesMtimes[targetFile] || 0;
				const fileMtime = filesMtimes[file];
				const dirMtime = filesMtimes[dirname(file)];
				const metaMtime = filesMtimes[join(dirname(file), 'pattern.json')];

				return fileMtime > targetFileMtime ||
					dirMtime > targetFileMtime ||
					metaMtime > targetFileMtime;
			})
			.filter(Boolean);
		}

		if (artifact) {
			filters.inFormats = changedFiles.map(file => extname(file).slice(1));
			const formats = chalk.grey(`[${filters.inFormats.join(', ')}]`);
			application.log.info(
				ok`Building ${filters.inFormats.length} files for ${pattern.id} ${formats} ${filterStart}`);
		} else {
			application.log.info(ok`Building all files for ${pattern.id} ${filterStart}`);
		}

		if (settings['dry-run']) {
			return Promise.resolve({});
		}

		const transformStart = new Date();
		application.log.info(wait`Transforming pattern ${pattern.id}`);


		// obtain transformed pattern by id
		const patternList = await getPatterns({
			id: pattern.id,
			base: patternRoot,
			config: application.configuration,
			factory: application.pattern.factory,
			transforms: application.transforms,
			log: application.log,
			filters
		}, application.cache);

		application.log.info(ok`Transformed pattern ${pattern.id} ${transformStart}`);

		// Extract dependency information
		patternList.forEach(patternItem => {
			const meta = patternItem.meta || {};
			const itemDependencies = meta.dependencies || [];
			const itemDevDependencies = meta.devDependencies || [];
			externalDependencies = [...externalDependencies, ...itemDependencies];
			externalDevDependencies = [...externalDevDependencies, ...itemDevDependencies];
		});

		const writeStart = new Date();
		application.log.info(ok`Writing artifacts of ${pattern.id}`);

		// Write results to disk
		const writingArtifacts = Promise.all(patternList.map(async patternItem => {
			// Read pathFormatString from matching transform config for now,
			// will be fed from pattern result meta information when we approach the new transform system
			const pathFormatString = application.configuration.resolve;

			const writingPatternItems = Promise.all(
					Object.entries(patternItem.results)
						.map(async resultsEntry => {
							const [resultName, result] = resultsEntry;
							const resultPath = join(
								commonjsRoot,
								resolvePathFormatString(
									pathFormatString, patternItem.id, resultName, result.out
								)
							);
							return writeSafe(resultPath, result.buffer);
					}));

			return await writingPatternItems;
		}));

		const written = await writingArtifacts;
		application.log.info(ok`Wrote ${written.length} artifacts for ${pattern.id} ${writeStart}`);
	})));

	const pruneDetectionStart = new Date();
	application.log.info(wait`Searching for artifacts to prune`);
	const artifactsToPrune = getArtifactsToPrune(
		patternMtimes,
		artifactMtimes,
		application.configuration);

	application.log.info(ok`Detected ${artifactsToPrune.length} artifacts to prune ${pruneDetectionStart}`);

	const pruneStart = new Date();
	application.log.info(wait`Pruning ${artifactsToPrune.length} artifacts`);
	const pruning = Promise.all(artifactsToPrune.map(path => {
		// for now we can assume the whole folder has to be nixed
		if (settings['dry-run']) {
			return Promise.resolve();
		}
		return removeFile(dirname(path));
	}));

	if (settings['dry-run']) {
		await building;
		application.log.info(ready`Dry-run executed successfully ${buildStart}`);
		return;
	}


	const copyStart = new Date();
	application.log.info(wait`Copying static files`);
	const copying = copyDirectory(staticRoot, resolve(commonjsRoot, 'static'));

	const copied = await copying;
	application.log.info(ready`Copied ${copied.length} static files. ${copyStart}`);

	const pruned = await pruning;
	application.log.info(ready`Pruned ${pruned.length} artifact files ${pruneStart}`);

	const built = await building;
	application.log.info(ready`Built ${built.length} from ${patternsToBuild.length} planned and ${patternMtimes.length} artifacts overall ${buildStart}`);

	const pkgStart = new Date();
	application.log.info(wait`Writing package.json`);

	const previousPkg = hasManifest ?
		JSON.parse(await readFile(manifestPath)) :
		{dependencies: {}, devDependencies: {}};

	const dependencies = externalDependencies.reduce((results, dependencyName) => {
		return {...results,
			[dependencyName]: pkg.dependencies[dependencyName] || pkg.devDependencies[dependencyName] || '*'};
	}, previousPkg.dependencies);

	const devDependencies = omit(externalDevDependencies.reduce((results, dependencyName) => {
		return {...results,
			[dependencyName]: pkg.dependencies[dependencyName] || pkg.devDependencies[dependencyName] || '*'};
	}, previousPkg.devDependencies), Object.keys(dependencies));

	const writingPkg = writeSafe(
		manifestPath,
		getPackageString(
			omit(
				dependencies,
				application.configuration.commonjs.ignoredDependencies || []
			),
			previousPkg,
			{
				devDependencies: omit(
					devDependencies,
					application.configuration.commonjs.ignoredDevDependencies || []
				)
			},
			omit(pkg, ['dependencies', 'devDependencies', 'scripts', 'config', 'main']),
			application.configuration.commonjs.pkg
		)
	);

	await writingPkg;
	application.log.info(ready`Wrote package.json ${pkgStart}`);
	application.log.info(ready`Task completed ${taskStart}`);
}

export default exportAsCommonjs;
