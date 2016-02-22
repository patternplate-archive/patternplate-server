import {resolve} from 'path';

import merge from 'lodash.merge';
import throat from 'throat';
import denodeify from 'denodeify';
import mkdirpNodeback from 'mkdirp';

import flatPick from '../../../library/utilities/flat-pick';
import getPatterns from '../../../library/utilities/get-patterns';
import getPatternMtimes from '../../../library/utilities/get-pattern-mtimes';
import git from '../../../library/utilities/git';
import writeSafe from '../../../library/filesystem/write-safe';

import {
	deprecation,
	ok,
	wait,
	warn
} from '../../../library/log/decorations.js';

const mkdirp = denodeify(mkdirpNodeback);
const pkg = require(resolve(process.cwd(), 'package.json'));

async function build(application, configuration) {
	const cwd = application.runtime.patterncwd || application.runtime.cwd;
	const patternHook = application.hooks.filter(hook => hook.name === 'patterns')[0];
	const patternRoot = resolve(cwd, patternHook.configuration.path);

	const buildConfig = merge(
		{
			patterns: {},
			tasks: {}
		},
		application.configuration.build.cache,
		configuration
	);

	const automountConfiguration = {
		transforms: { // eslint-disable-line quote-props
			react: {
				inFormat: 'jsx',
				outFormat: 'js',
				resolveDependencies: false,
				convertDependencies: true
			},
			'react-mount': {
				inFormat: 'js',
				outFormat: 'js'
			},
			browserify: {
				inFormat: 'js',
				outFormat: 'js'
			}
		},
		patterns: {
			path: patternRoot,
			formats: {
				jsx: {
					name: 'Component',
					transforms: ['react', 'react-mount', 'browserify']
				},
				html: {
					name: 'Component',
					transforms: ['react', 'react-mount', 'browserify']
				}
			}
		}
	};

	// FIXME: This simple merge statement is not sufficient to reconfigure your build process (may apply to other config
	// cases too). A better aproach would be to have a configuration model which could do the merge on a per-config-key
	// and as side-benefit it would help reduce breaking changes.
	const patterns = merge({}, application.configuration.patterns || {}, buildConfig.patterns || {});

	// Update formats to the current buildFormats (this is required to e.g. reduce transformers for build)
	for (const name of Object.keys(buildConfig.patterns.formats || {})) {
		patterns.formats[name] = buildConfig.patterns.formats[name];
	}

	const transforms = merge({}, application.configuration.transforms || {}, buildConfig.transforms || {});
	const patternConfig = {
		patterns, transforms
	};

	const environment = application.runtime.env;
	const revision = await git.short();
	const version = pkg.version;

	const buildRoot = resolve(cwd, 'build');
	const buildDirectory = resolve(buildRoot, `build-v${version}-${environment}-${revision}`);
	const patternBuildDirectory = resolve(buildDirectory, 'patterns');
	const staticCacheDirectory = resolve(cwd, '.cache');
	const automountCacheDirectory = resolve(cwd, '.cache', 'react-mount');

	await mkdirp(patternBuildDirectory);
	await mkdirp(staticCacheDirectory);

	if (buildConfig.tasks.patterns && buildConfig.tasks.patterns !== 'false') {
		application.log.warn(deprecation`The patterns sub-task of build was removed. Use the commonjs task instead. You can disable it by specifying patternplate-server.configuration.build.tasks.patterns=false`);
	}

	// build the static cache
	// TODO: save the artifacts instead of a kind-of-giant json file
	// - when client and server negotiate about single files
	// - read times are better
	// for now we just use the ids, later we could do incremental builds
	const patternMtimes = await getPatternMtimes('./patterns', {
		resolveDependencies: false
	});

	// build all the artifacts
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
								patternItem.dependencies = flatPick(patternItem, 'dependencies', ['id', 'manifest']);
								const resultPath = resolve(staticCacheDirectory, `${patternItem.id.split('/').join('-')}.json`);
								return writeSafe(resultPath, JSON.stringify(patternItem));
							})
					);

					// if automounting is enabled create cache entry for it
					const writingAutoMountCache = Promise.all(
						patternList
							// get patterns that have automounting enabled
							.filter(patternItem => {
								const config = merge(
									{},
									patternConfig.transforms['react-to-markup'].opts,
									(patternItem.manifest.options || {})['react-to-markup'] || {}
								);
								return config.automount;
							})
							// get automounting result and write it to cache
							.map(async patternItem => {
								application.log.info(ok`Creating automount cache for ${patternItem.id}`);

								const autoMountPatterns = await getPatterns({
									id: patternItem.id,
									base: patternRoot,
									config: automountConfiguration,
									factory: application.pattern.factory,
									transforms: application.transforms,
									log: application.log
								}, application.cache);

								const [pattern] = autoMountPatterns;
								const {Component} = pattern;

								if (typeof Component === 'undefined') {
									application.log.warn(warn`${patternItem.id} provides no automount Component`);
									return null;
								}

								const resultPath = resolve(
									automountCacheDirectory,
									`${pattern.id.split('/').join('-')}.js`
								);
								return writeSafe(resultPath, Component.buffer);
							})
					);

					application.log.info(ok`Wrote cache for ${pattern.id} ${writeStart}`);
					await writingCache;
					await writingAutoMountCache;
				})
		)
	);
}

export default build;
