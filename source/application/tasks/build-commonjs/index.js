import {debuglog} from 'util';
import denodeify from 'denodeify';

import {resolve, join, dirname, extname, relative} from 'path';

import {readFile as readFileNodeback} from 'fs';

import boxen from 'boxen';
import {find, flatten, omit, merge, uniq} from 'lodash';
import throat from 'throat';
import chalk from 'chalk';
import exists from 'path-exists';
import coreModuleNames from 'node-core-module-names';
import {resolvePathFormatString} from 'patternplate-transforms-core';
import ora from 'ora';

import {deprecation, ok, wait, ready} from '../../../library/log/decorations';
import copyDirectory from '../../../library/filesystem/copy-directory';
import removeFile from '../../../library/filesystem/remove-file';
import writeSafe from '../../../library/filesystem/write-safe';
import getArtifactMtimes from '../../../library/utilities/get-artifact-mtimes';
import getArtifactsToPrune from '../../../library/utilities/get-artifacts-to-prune';
import getPatterns from '../../../library/utilities/get-patterns';
import getPatternMtimes from '../../../library/utilities/get-pattern-mtimes';
import getPatternsToBuild from '../../../library/utilities/get-patterns-to-build';
import getPackageString from './get-package-string';

const pkg = require(resolve(process.cwd(), 'package.json'));
const readFile = denodeify(readFileNodeback);

async function exportAsCommonjs(application, settings) {
	const spinner = ora().start();
	const debug = debuglog('commonjs');
	debug('calling commonjs with');
	debug(settings);

	const cwd = application.runtime.patterncwd || application.runtime.cwd;

	const patternHook = application.hooks.filter(hook => hook.name === 'patterns')[0];
	const patternRoot = resolve(cwd, patternHook.configuration.path);
	const staticRoot = resolve(cwd, 'static');
	const commonjsRoot = resolve(cwd, 'distribution');
	const manifestPath = resolve(commonjsRoot, 'package.json');

	const warnings = [];
	const warn = application.log.warn;
	application.log.warn = (...args) => {
		if (args.some(arg => arg.includes('Deprecation'))) {
			warnings.push(args);
			return;
		}
		warn(...args);
	};

	if (application.configuration.commonjs) {
		application.log.warn(deprecation`The 'patternplate-server.configuration.commonjs' key moved to 'patternplate-server.configuration.build.commonjs' and is deprecated.`);
	}

	const config = merge(
		{},
		application.configuration.commonjs,
		application.configuration.build.commonjs
	);

	application.configuration = merge({},
		application.configuration,
		config
	);

	// Reconfigure the cache
	application.cache.config = merge({},
		application.cache.config,
		application.configuration.patterns.cache
	);

	// Update formats to the current buildFormats (this is required to e.g. reduce transformers for build)
	for (const name of Object.keys(config.patterns.formats)) {
		const present = application.configuration.patterns.formats[name] || {};
		const override = config.patterns.formats[name] || {};
		present.transforms = override.transforms ? override.transforms : present.transforms;
	}

	// start reading pattern mtimes, ignore dependencies
	const mtimesStart = new Date();
	application.log.debug(wait`Obtaining pattern modification times`);
	const readingPatternMtimes = getPatternMtimes('./patterns', {
		resolveDependencies: false
	});

	// start reading artifact mtimes
	const artifactMtimesStart = new Date();
	const readingArtifactMtimes = getArtifactMtimes('./', application.configuration.patterns);

	// wait for all mtimes to trickle in
	const patternMtimes = await readingPatternMtimes;
	application.log.debug(ok`Read pattern modification times ${mtimesStart}`);

	// wait for all artifact mtimes
	const artifactMtimes = await readingArtifactMtimes;
	application.log.debug(ok`Read artifact modification times ${artifactMtimesStart}`);

	// check if package.json is in distribution
	const hasManifest = await exists(resolve(commonjsRoot, 'package.json'));

	// obtain patterns we have to build
	const selectionStart = new Date();
	application.log.debug(wait`Calculating pattern collection to build`);

	const patternsToBuild = hasManifest ?
		patternMtimes
			.filter(getPatternsToBuild(artifactMtimes, application.configuration.patterns))
			.sort((a, b) => b.mtime.getTime() - a.mtime.getTime()) :
		patternMtimes;

	if (hasManifest) {
		application.log.debug(ok`Calculated pattern collection to build ${selectionStart}`);
		application.log.debug(wait`Building ${patternsToBuild.length} of ${patternMtimes.length} patterns`);
	} else {
		application.log.debug(ok`No manifest at ${commonjsRoot}, building all ${patternMtimes.length} patterns`);
	}

	let buildCount = 1;

	// build patterns in parallel
	const buildStart = new Date();
	const building = Promise.all(patternsToBuild.map(throat(5, async pattern => {
		spinner.text = `${pattern.id} ${buildCount}/${patternsToBuild.length}`;
		buildCount += 1;
		const filterStart = new Date();
		application.log.debug(wait`Checking for files of ${pattern.id} to exclude from transform.`);

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
					config.resolve,
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
			application.log.debug(
				ok`Building ${filters.inFormats.length} files for ${pattern.id} ${formats} ${filterStart}`);
		} else {
			application.log.debug(ok`Building all files for ${pattern.id} ${filterStart}`);
		}

		if (settings['dry-run']) {
			return Promise.resolve({});
		}

		const transformStart = new Date();
		application.log.debug(wait`Transforming pattern ${pattern.id}`);

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

		application.log.debug(ok`Transformed pattern ${pattern.id} ${transformStart}`);

		const writeStart = new Date();
		application.log.debug(ok`Writing artifacts of ${pattern.id}`);

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
		application.log.debug(ok`Wrote ${written.length} artifacts for ${pattern.id} ${writeStart}`);
		spinner.succeed();
		return patternList;
	})));

	const pruneDetectionStart = new Date();
	application.log.debug(wait`Searching for artifacts to prune`);
	const artifactsToPrune = getArtifactsToPrune(
		patternMtimes,
		artifactMtimes,
		application.configuration);

	application.log.debug(ok`Detected ${artifactsToPrune.length} artifacts to prune ${pruneDetectionStart}`);

	const pruneStart = new Date();
	application.log.debug(wait`Pruning ${artifactsToPrune.length} artifacts`);
	const pruning = Promise.all(artifactsToPrune.map(path => {
		// for now we can assume the whole folder has to be nixed
		if (settings['dry-run']) {
			return Promise.resolve();
		}
		return removeFile(dirname(path));
	}));

	if (settings['dry-run']) {
		await building;
		application.log.debug(ready`Dry-run executed successfully ${buildStart}`);
		return;
	}

	const copyStart = new Date();
	application.log.debug(wait`Copying static files`);
	const copying = copyDirectory(staticRoot, resolve(commonjsRoot, 'static'));

	const copied = await copying;
	application.log.debug(ready`Copied ${copied.length} static files. ${copyStart}`);
	spinner.text = `static files copied`;
	spinner.succeed();

	const pruned = await pruning;
	application.log.debug(ready`Pruned ${pruned.length} artifact files ${pruneStart}`);
	spinner.text = `${pruned.length} pruned`;
	spinner.succeed();

	const built = await building;
	application.log.debug(ready`Built ${built.length} from ${patternsToBuild.length} planned and ${patternMtimes.length} artifacts overall ${buildStart}`);
	spinner.text = `${built.length}/${patternsToBuild.length} built`;
	spinner.succeed();

	if (built.length > 0) {
		const pkgStart = new Date();
		application.log.debug(wait`Writing package.json`);

		const previousPkg = hasManifest ?
			JSON.parse(await readFile(manifestPath)) :
			{dependencies: {}, devDependencies: {}};

		// Extract dependency information
		const dependencyLists = flatten(built).reduce((registry, patternItem) => {
			const {meta: {dependencies, devDependencies}} = patternItem;
			return {
				dependencies: [...registry.dependencies, ...(dependencies || [])],
				devDependencies: [...registry.devDependencies, ...(devDependencies || [])]
			};
		}, {
			dependencies: [],
			devDependencies: []
		});

		const deps = pkg.dependencies || {};
		const devDeps = pkg.devDependencies || {};

		const dependencies = dependencyLists.dependencies
			.reduce((results, dependencyName) => {
				return {...results,
					[dependencyName]: deps[dependencyName] || devDeps[dependencyName] || '*'};
			}, previousPkg.dependencies);

		const devDependencies = dependencyLists.devDependencies
			.reduce((results, dependencyName) => {
				return {...results,
					[dependencyName]: deps[dependencyName] || devDeps[dependencyName] || '*'};
			}, previousPkg.devDependencies);

		const writingPkg = writeSafe(
			manifestPath,
			getPackageString(
				omit(
					dependencies,
					[...(config.ignoredDependencies || []), coreModuleNames]
				),
				previousPkg,
				{
					devDependencies: omit(
						devDependencies,
						[...(config.ignoredDevDependencies || []), coreModuleNames, ...Object.keys(dependencies)]
					)
				},
			omit(pkg, ['dependencies', 'devDependencies', 'scripts', 'config', 'main']),
			config.pkg
			)
		);

		await writingPkg;
		application.log.debug(ready`Wrote package.json ${pkgStart}`);
	}

	const messages = uniq(warnings)
		.map(warning => warning.join(' '));

	messages.forEach(message => {
		console.log(boxen(message, {borderColor: 'yellow', padding: 1}));
	});
}

export default exportAsCommonjs;
