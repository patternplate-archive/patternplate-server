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

import checksum from 'checksum';
import ncpNodeback from 'ncp';
import mkdirpNodeback from 'mkdirp';
import exists from 'path-exists';
import merge from 'lodash.merge';
import fs from 'q-io/fs';
import {find, difference} from 'lodash';

import resolvePathFormatString from '../../../library/resolve-utilities/resolve-path-format-string';
import getPatterns from '../../../library/utilities/get-patterns';
import getPatternMtimes from '../../../library/utilities/get-pattern-mtimes';

const pkg = require(resolve(process.cwd(), 'package.json'));
const mkdirp = denodeify(mkdirpNodeback);
const writeFile = denodeify(writeFileNodeback);
const readFile = denodeify(readFileNodeback);
const copy = denodeify(ncpNodeback);
const stat = denodeify(statNodeback);
const checksumFile = denodeify(checksum.file);

async function getArtifactMtimes(search, patterns) {
	const types = Object.keys(patterns.formats)
		.map(extension => patterns.formats[extension].name);

	const typedFiles = await* [...new Set(types)].map(async type => {
		const files = await fs.listTree(resolve(search, 'distribution', type));
		return files.filter(path => extname(path));
	});

	const artifactPaths = typedFiles
		.reduce((flattened, files) => [...flattened, ...files], []);

	const artifactMtimes = await* artifactPaths
		.map(async path => {
			const artifactId = dirname(relative(resolve(search, 'distribution'), path).split(sep).join('/'));
			const patternId = artifactId.split(sep).slice(1).join('/');
			const stats = await stat(path)

			return {
				id: artifactId,
				patternId,
				mtime: stats.mtime
			};
		});

	const artifactRegistry = artifactMtimes.reduce((registry, artifact) => {
		const item = registry[artifact.patternId] || {
			id: artifact.patternId,
			artifacts: [],
			mtimes: [],
			types: []
		};

		item.artifacts.push(artifact.id);
		item.mtimes.push(artifact.mtime);
		item.types.push(artifact.id.split('/')[0])
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
	}
}

async function fileChanged(path, buffer) {
	const existing = await exists(path);

	if (!existing) {
		return true;
	}

	const next = checksum(buffer);
	const previous = await checksumFile(path);

	return next !== previous;
}

function copyFile(source, target) {
	return new Promise((resolve, reject) => {
		const reading = createReadStream(source);
		const writing = createWriteStream(target);
		reading.on('error', reject);
		writing.on('error', reject);
		writing.on('finish', resolve);
		reading.pipe(writing);
	});
}

async function copyNewer(source, target) {
	const existing = await exists(target);

	if (existing) {
		const sourceStat = await stat(source);
		const targetStat = await stat(target);
		if (sourceStat.mtime.getTime() <=  targetStat.mtime.getTime()) {
			return;
		}
	}

	await mkdirp(dirname(target));
	await copyFile(source, target);
}

async function writeChanged(path, buffer) {
	const changed = await fileChanged(path, buffer)

	if (!changed) {
		return;
	}

	await mkdirp(dirname(path));
	return writeFile(path, buffer);
}

async function exportAsCommonjs(application) {
	const serverPkg = application.configuration.pkg;

	const patternHook = application.hooks.filter((hook) => hook.name === 'patterns')[0];
	const patternRoot = resolve(application.runtime.patterncwd || application.runtime.cwd, patternHook.configuration.path);
	const staticRoot = resolve(application.runtime.patterncwd || application.runtime.cwd, 'static');
	const commonjsConfig = application.configuration.commonjs || {};
	const commonjsRoot = resolve(application.runtime.patterncwd || application.runtime.cwd, 'distribution');
	const manifestPath = resolve(commonjsRoot, 'package.json');

	// FIXME: This simple merge statement is not sufficient to reconfigure your build process (may apply to other config
	// cases too). A better aproach would be to have a configuration model which could do the merge on a per-config-key
	// and as side-benefit it would help reduce breaking changes.
	const patterns = merge({}, application.configuration.patterns || {}, commonjsConfig.patterns || {});

	// Update formats to the current buildFormats (this is required to e.g. reduce transformers for build)
	for (const name of Object.keys(commonjsConfig.patterns.formats)) {
		patterns.formats[name] = commonjsConfig.patterns.formats[name];
	}

	const transforms = merge({}, application.configuration.transforms || {}, commonjsConfig.transforms || {});
	const patternConfig = { patterns, transforms };

	// start reading pattern mtimes
	const readingPatternMtimes = getPatternMtimes('./patterns');

	// start reading artifact mtimes
	const readingArtifactMtimes = getArtifactMtimes('./', patterns);

	const patternMtimes = await readingPatternMtimes;
	const artifactMtimes = await readingArtifactMtimes;

	// obtain patterns we have to build
	const patternsToBuild = patternMtimes
		.filter(getPatternsToBuild(artifactMtimes, patterns))
		.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

	application.log.info(`[console:run] Building ${patternsToBuild.length} of ${patternMtimes.length} patterns...`)

	// build patterns in parallel
	const building = patternsToBuild.map(async pattern => {
		application.log.info(`[console:run] Transforming pattern ${pattern.id} ...`);

		const patternList = await getPatterns({
			id: pattern.id,
			base: patternRoot,
			config: patternConfig,
			factory: application.pattern.factory,
			transforms: application.transforms,
			filters: commonjsConfig.filters
		}, application.cache);

		application.log.info(`[console:run] Transformed pattern ${pattern.id}.`);

		application.log.info(`[console:run] Writing artifacts of ${pattern.id} ...`);
		const writingArtifacts = patternList.map(async patternItem => {
			const resultEnvironment = patternItem.results.index;

			// Read pathFormatString from matching trasnform config for now,
			// will be fed from pattern result meta information when we approach the new transform system
			const pathFormatString = commonjsConfig.resolve;

			const writingPatternItems = Object.entries(resultEnvironment).map(async environmentEntry => {
				const [resultName, result] = environmentEntry;
				const resultPath = join(commonjsRoot,
					resolvePathFormatString(pathFormatString, patternItem.id, resultName, result.out));
				return writeChanged(resultPath, result.buffer);
			});

			return await* writingPatternItems;
		});

		await* writingArtifacts;
		application.log.info(`[console:run] Wrote artifacts of ${pattern.id} ...`);
	});

	const commonjsPkg = {
		name: pkg.name,
		author: pkg.author,
		contributors: pkg.contributors,
		repository: pkg.repository,
		license: pkg.license,
		version: pkg.version,
		dependencies: {
			react: pkg.dependencies.react || serverPkg.dependencies.react
		},
		_patternplate: {
			environment: application.runtime.env,
			mode: application.runtime.mode,
			config: commonjsConfig
		},
		...commonjsConfig.pkg
	};

	const commonjsPkgString = JSON.stringify(commonjsPkg, null, '  ');

	application.log.info(`[console:run] Writing package.json ...`);
	const writingPkg = writeChanged(manifestPath, commonjsPkgString);

	application.log.info(`[console:run] Copying static files ...`);
	const staticFiles = await fs.listTree(staticRoot);

	const copying = staticFiles
		.filter(staticFile => extname(staticFile))
		.map(async staticFile => {
			const targetPath = resolve(join(commonjsRoot, 'static'), relative(staticRoot, staticFile));
			return copyNewer(staticFile, targetPath);
		});

	await writingPkg;
	application.log.info(`[console:run] Wrote package.json.`);
	await* copying;
	application.log.info(`[console:run] Copied static files.`);
	await* building;
	application.log.info(`[console:run] Built all artifacts.`);
}

export default exportAsCommonjs;
