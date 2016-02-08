import {
	writeFile as writeFileNodeback,
	createWriteStream
} from 'fs';

import {resolve, dirname} from 'path';
import {debuglog} from 'util';

import qfs from 'q-io/fs';
import archiver from 'archiver';
import merge from 'lodash.merge';
import throat from 'throat';
import chalk from 'chalk';
import denodeify from 'denodeify';
import mkdirpNodeback from 'mkdirp';

import getPatterns from '../../../library/utilities/get-patterns';
import getPatternMtimes from '../../../library/utilities/get-pattern-mtimes';
import git from '../../../library/utilities/git';

const mkdirp = denodeify(mkdirpNodeback);
const writeFile = denodeify(writeFileNodeback);

const pkg = require(resolve(process.cwd(), 'package.json'));

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

async function writeSafe(path, buffer) {
	const debug = debuglog('build-write');
	await mkdirp(dirname(path));
	debug('Writing %s', path);
	return writeFile(path, buffer);
}

async function build (application, configuration) {
	const cwd = application.runtime.patterncwd || application.runtime.cwd;
	const patternHook = application.hooks.filter((hook) => hook.name === 'patterns')[0];
	const patternRoot = resolve(cwd, patternHook.configuration.path);
	const staticRoot = resolve(cwd, 'static');
	const assetRoot = resolve(cwd, 'assets');

	const buildConfig = merge({}, application.configuration.build, configuration);

	// FIXME: This simple merge statement is not sufficient to reconfigure your build process (may apply to other config
	// cases too). A better aproach would be to have a configuration model which could do the merge on a per-config-key
	// and as side-benefit it would help reduce breaking changes.
	const patterns = merge({}, application.configuration.patterns || {}, buildConfig.patterns || {});

	// Update formats to the current buildFormats (this is required to e.g. reduce transformers for build)
	for (let name of Object.keys(buildConfig.patterns.formats || {})) {
		patterns.formats[name] = buildConfig.patterns.formats[name];
	}

	const transforms = merge({}, application.configuration.transforms || {}, buildConfig.transforms || {});
	const patternConfig = { patterns, transforms };

	const environment = application.runtime.env;
	const revision = await git.short();
	const version = pkg.version;

	const buildRoot = resolve(application.runtime.patterncwd || application.runtime.cwd, 'build');
	const buildDirectory = resolve(buildRoot, `build-v${version}-${environment}-${revision}`);
	const patternBuildDirectory = resolve(buildDirectory, 'patterns');
	const staticCacheDirectory = resolve(application.runtime.patterncwd || application.runtime.cwd, '.cache');

	await mkdirp(patternBuildDirectory);
	await mkdirp(staticCacheDirectory);

	if (buildConfig.tasks.patterns && buildConfig.tasks.patterns !== 'false') {
		application.log.warn(`${chalk.yellow('[⚠ Removal ⚠ ]')} The patterns sub-task of build was removed. Use the commonjs task instead. You can disable it by specifying patternplate-server.configuration.build.tasks.patterns=false`);
	}

	// build the static cache
	// TODO: save the artifacts instead of a giant json file
	// - when client and server negotiate about single files
	// - read times are better
	if (buildConfig.tasks.cache) {
		// for now we just use the ids
		const patternMtimes = await getPatternMtimes('./patterns', {
			resolveDependencies: false
		});

		await Promise.all(
			patternMtimes
				.map(
					throat(5, async pattern => {
						const transformStart = new Date();
						application.log.info(wait`Transforming pattern ${pattern.id}`);

						const patternList = await getPatterns({
							id: pattern.id,
							base: patternRoot,
							config: patternConfig,
							factory: application.pattern.factory,
							transforms: application.transforms,
							log: application.log
						}, application.cache);

						application.log.info(ok`Transformed pattern ${pattern.id} ${transformStart}`);

						// dump results in the cache
						const writeStart = new Date();
						application.log.info(ok`Writing cache for ${pattern.id}`);

						const writingCache = Promise.all(
							patternList
								.map(async patternItem => {
									// cut some slack
									patternItem.dependencies = Object.keys(patternItem.dependencies)
										.reduce((dependencies, dependencyName) => {
											const id = patternItem.dependencies[dependencyName].id;
											const amend = dependencyName === 'Pattern' ?
												{} :
												{
													[dependencyName]: id
												};
												return {
													...dependencies,
													...amend
												};
										}, {});

									const resultPath = resolve(staticCacheDirectory, patternItem.id.split('/').join('-') + '.json');
									return writeSafe(resultPath, JSON.stringify(patternItem));
								})
						);

						application.log.info(ok`Wrote cache for ${pattern.id} ${writeStart}`);
						return await writingCache;
					})
			)
		);
	}

	// Build environment output
	if (buildConfig.tasks.bundles && buildConfig.tasks.bundles !== 'false') {
		console.log('!');
		/* const builds = await* environments.map(throat(5, async environment => { // eslint-disable-line no-shadow
			return (await getPatterns({
				id: qfs.relativeFromDirectory(patternRoot, environment),
				base: patternRoot,
				config: patternConfig,
				factory: application.pattern.factory,
				transforms: application.transforms,
				isEnvironment: true,
				log: application.log
			}, application.cache))[0];
		}));

		await qfs.makeTree(patternBuildDirectory);

		await* builds.map(throat(5, async build => { // eslint-disable-line no-shadow
			const target = build.manifest.name;

			const info = Object.assign({}, information, { version, target });
			const fragments = ['/**!'];

			const results = build.results[target];

			return await* Object.entries(results).map(throat(5, async resultEntry => {
				const [resultName, result] = resultEntry;
				const contents = [comment, results.buffer.toString('utf-8')].join('\n');
				const ext = result.out;
				const fileName = resolve(buildDirectory, [build.manifest.name, ext].join('.'));
				application.log.info(`[console:run] Writing "${resultName}" for configuration "${build.manifest.name}" to ${fileName} ...`);
				return qfs.write(fileName, contents);
			}));
		})); */
	}

	if (buildConfig.tasks.static) {
		// Copy static files
		if (await qfs.exists(staticRoot)) {
			const staticTarget = resolve(patternBuildDirectory, 'static');
			application.log.info(`[console:run] Copy asset files from "${assetRoot}" to ${staticTarget} ...`);
			await mkdirp(staticTarget);
			await qfs.copyTree(staticRoot, staticTarget);
		} else {
			application.log.info(`[console:run] No asset files at "${staticRoot}"`);
		}
	}

	let archive = archiver('zip');
	let output = createWriteStream(`${buildDirectory}.zip`);

	archive.pipe(output);
	archive.directory(buildDirectory, false);
	archive.finalize();

	return new Promise((fulfill, reject) => {
		output.on('close', fulfill);
		archive.on('error', reject);
	});
}

export default build;
