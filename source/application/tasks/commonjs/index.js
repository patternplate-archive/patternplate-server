import denodeify from 'denodeify';

import {
	resolve,
	join,
	dirname,
	extname,
	relative,
	sep
} from 'path';

import {
	readFile as readFileNodeback,
	writeFile as writeFileNodeback,
	stat as statNodeback,
	createReadStream,
	createWriteStream
} from 'fs';

import mkdirpNodeback from 'mkdirp';
import merge from 'lodash.merge';
import {omit} from 'lodash';
import fs from 'q-io/fs';
import {find, difference} from 'lodash';
import throat from 'throat';
import chalk from 'chalk';
import rimraf from 'rimraf';
import exists from 'path-exists';

import resolvePathFormatString from '../../../library/resolve-utilities/resolve-path-format-string';
import getPatterns from '../../../library/utilities/get-patterns';
import getPatternMtimes from '../../../library/utilities/get-pattern-mtimes';

const pkg = require(resolve(process.cwd(), 'package.json'));
const mkdirp = denodeify(mkdirpNodeback);
const readFile = denodeify(readFileNodeback);
const writeFile = denodeify(writeFileNodeback);
const stat = denodeify(statNodeback);

function formatDuration(duration) {
	const units = ['m', 's', 'ms'];
	const methods = ['getMinutes', 'getSeconds', 'getMilliseconds'];

	return methods
		.map(method => {
			return duration[method]();
		})
		.map((time, index) => {
			if (time > 0) {
				return `${time}${units[index]}`;
			}
		})
		.filter(Boolean)
		.join(' ');
}

function getDurationStamp(start) {
	const duration = new Date(new Date() - start);
	return chalk.grey(`[${formatDuration(duration)}]`);
}

function getMessage(strings, values) {
	return strings.reduce((result, string, index) => {
		const value = typeof values[index] !== 'undefined' ? values[index] : '';
		const formatted = value instanceof Date && index === values.length - 1 ? getDurationStamp(value) : value;
		return `${result}${string}${formatted}`;
	}, '');
}

function wait(strings, ...values) {
	const sign = `${chalk.grey('⧗')}`;
	return `${sign}    ${getMessage(strings, values)}`;
}

function ok(strings, ...values) {
	const sign = `${chalk.grey('✔')}`;
	return `${sign}    ${getMessage(strings, values)}`;
}

function ready(strings, ...values) {
	const sign = `${chalk.green('✔')}`;
	return `${sign}    ${getMessage(strings, values)}`;
}

function getPackageString(dependencies, data, ...overrides) {
	const definition = merge(...[data, ...overrides]);
	definition.dependencies = dependencies;
	return JSON.stringify(definition, null, '  ');
}

async function getArtifactMtimes(search, patterns) {
	const types = Object.keys(patterns.formats)
		.map(extension => patterns.formats[extension].name);

	const typedFiles = await* [...new Set(types)].map(async type => {
		const files = await fs.listTree(resolve(search, 'distribution', type));
		return files.filter(path => extname(path));
	});

	const artifactPaths = typedFiles
		.reduce((flattened, files) => [...flattened, ...files], []);

	const artifactMtimes = await Promise.all(artifactPaths
		.map(async path => {
			const artifactId = dirname(relative(resolve(search, 'distribution'), path).split(sep).join('/'));
			const patternId = artifactId.split(sep).slice(1).join('/');
			const stats = await stat(path);

			return {
				id: artifactId,
				path: path,
				patternId,
				mtime: stats.mtime
			};
		}));

	const artifactRegistry = artifactMtimes.reduce((registry, artifact) => {
		const item = registry[artifact.patternId] || {
			id: artifact.patternId,
			artifacts: [],
			files: [],
			mtimes: [],
			types: []
		};

		item.artifacts.push(artifact.id);
		item.files.push(artifact.path);
		item.mtimes.push(artifact.mtime);
		item.types.push(artifact.id.split('/')[0]);
		registry[artifact.patternId] = item;
		return registry;
	}, {});

	return Object.values(artifactRegistry).map(item => {
		const times = item.mtimes.map(time => {
			return {
				stamp: time.getTime(),
				date: time
			};
		}).sort((a, b) => a.stamp - b.stamp);

		item.mtime = times[0].date;
		return item;
	});
}

function getPatternsToBuild(artifacts, patterns) {
	return pattern => {
		// Find matching pattern artifact
		const artifact = find(artifacts, {id: pattern.id});

		// If no pattern artifact is found, build it
		if (!artifact) {
			return true;
		}

		// Build if pattern mtime > artifact mtime
		if (pattern.mtime.getTime() > artifact.mtime.getTime()) {
			return true;
		}

		// Get the types in this pattern
		const types = [...new Set(pattern.files
			.map(path => extname(path).slice(1))
			.filter(Boolean)
			.map(extension => patterns.formats[extension])
			.filter(Boolean)
			.map(format => format.name))];

		// Build if types do not match
		if (
			difference(types, artifact.types).length ||
			difference(artifact.types, types).length
		) {
			return true;
		}
	};
}

function getArtifactsToPrune(patterns, artifacts, config) {
	return artifacts.reduce((results, artifact) => {
		const pattern = find(patterns, {id: artifact.id});

		// prune all artifact files without a corresponding pattern
		if (!pattern) {
			return [...results, ...artifact.files];
		}

		// get expected artifact files
		const expected = pattern.files.map(file => {
			const fileExtension = extname(file);
			const formatName = fileExtension.slice(1);

			const format = config.patterns.formats[formatName];

			if (!format) {
				return false;
			}

			const transformNames = format.transforms || [];
			const lastTransformName = transformNames[transformNames.length - 1];
			const lastTransform = config.transforms[lastTransformName] || {};

			const fileType = format.name;
			const targetExtension = lastTransform.outFormat || fileExtension.slice(1);

			const expectedRelativePath = resolvePathFormatString(
				config.resolve,
				pattern.id,
				fileType,
				targetExtension
			);

			return resolve('./distribution', expectedRelativePath);
		}).filter(Boolean);

		// prune artifact files with pattern but no file corresponding
		const files = artifact.files.filter(file => expected.indexOf(file) === -1);
		return [...results, ...files];
	}, []);
}

function copyFile(source, target) {
	return new Promise((resolver, reject) => {
		const reading = createReadStream(source);
		const writing = createWriteStream(target);
		reading.on('error', reject);
		writing.on('error', reject);
		writing.on('finish', resolver);
		reading.pipe(writing);
	});
}

function rm(target) {
	return new Promise((resolver, reject) => {
		rimraf(target, {}, error => {
			if (error) {
				reject(error);
			} else {
				resolve();
			}
		});
	});
}

async function copySafe(source, target) {
	await mkdirp(dirname(target));
	await copyFile(source, target);
}

async function writeSafe(path, buffer) {
	await mkdirp(dirname(path));
	return writeFile(path, buffer);
}

async function copyDirectory(source, target) {
	const files = await fs.listTree(source);

	return Promise.all(
		files
			.filter(extname)
			.map(async file => {
				const targetFile = resolve(target, relative(source, file));
				return copySafe(file, targetFile);
			})
	);
}

async function exportAsCommonjs(application) {
	const taskStart = new Date();
	const cwd = application.runtime.patterncwd || application.runtime.cwd;

	const patternHook = application.hooks.filter((hook) => hook.name === 'patterns')[0];
	const patternRoot = resolve(cwd, patternHook.configuration.path);
	const staticRoot = resolve(cwd, 'static');
	const commonjsRoot = resolve(cwd, 'distribution');

	const manifestPath = resolve(commonjsRoot, 'package.json');
	merge(application.configuration, application.configuration.commonjs);

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
			filters.formats = changedFiles.map(file => extname(file).slice(1));
			const formats = chalk.grey(`[${filters.formats.join(', ')}]`);
			application.log.info(
				ok`Building ${filters.formats.length} files for ${pattern.id} ${formats} ${filterStart}`);
		} else {
			application.log.info(ok`Building all files for ${pattern.id} ${filterStart}`);
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
			filters
		}, application.cache);


		application.log.info(ok`Transformed pattern ${pattern.id} ${transformStart}`);

		// Extract dependency information
		patternList.forEach(patternItem => {
			const meta = patternItem.meta || {};
			const itemDependencies = meta.dependencies;
			externalDependencies = [...externalDependencies, ...itemDependencies];
		});

		const writeStart = new Date();
		application.log.info(ok`Writing artifacts of ${pattern.id}`);

		// Write results to disk
		const writingArtifacts = Promise.all(patternList.map(async patternItem => {
			const resultEnvironment = patternItem.results.index;
			// Read pathFormatString from matching transform config for now,
			// will be fed from pattern result meta information when we approach the new transform system
			const pathFormatString = application.configuration.resolve;

			const writingPatternItems = Promise.all(Object.entries(resultEnvironment).map(async environmentEntry => {
				const [resultName, result] = environmentEntry;
				const resultPath = join(commonjsRoot,
					resolvePathFormatString(pathFormatString, patternItem.id, resultName, result.out));
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
		rm(dirname(path));
	}));


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
		{};

	const dependencies = externalDependencies.reduce((results, dependencyName) => {
		return {...results, [dependencyName]: pkg.dependencies[dependencyName] || '*'};
	}, {});

	const writingPkg = writeSafe(
		manifestPath,
		getPackageString(
			dependencies,
			previousPkg,
			omit(pkg, ['devDependencies', 'scripts', 'config', 'main']),
			application.configuration.commonjs.pkg
		)
	);

	await writingPkg;
	application.log.info(ready`Wrote package.json ${pkgStart}`);
	application.log.info(ready`Task completed ${taskStart}`);
}

export default exportAsCommonjs;
