import {resolve, basename, dirname} from 'path';
import {createWriteStream} from 'fs';

import qfs from 'q-io/fs';
import archiver from 'archiver';
import merge from 'lodash.merge';

import getPatterns from '../../../library/utilities/get-patterns';
import getWrapper from '../../../library/utilities/get-wrapper';
import git from '../../../library/utilities/git';

import layout from '../../layouts';

const pkg = require(resolve(process.cwd(), 'package.json'));

async function build (application, config) {
	const patternHook = application.hooks.filter((hook) => hook.name === 'patterns')[0];
	const patternRoot = resolve(application.runtime.patterncwd || application.runtime.cwd, patternHook.configuration.path);
	const staticRoot = resolve(application.runtime.patterncwd || application.runtime.cwd, 'static');
	const assetRoot = resolve(application.runtime.cwd, 'assets');

	const buildConfig = application.configuration.build || {};

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

	const built = new Date();
	const environment = application.runtime.env;
	const mode = application.runtime.mode;
	const revision = await git.short();
	const branch = await git.branch();
	const tag = await git.tag();
	const version = pkg.version;

	const information = {built, environment, mode, revision, branch, tag, version};
	const buildRoot = resolve(application.runtime.patterncwd || application.runtime.cwd, 'build');
	const buildDirectory = resolve(buildRoot, `build-v${version}-${environment}-${revision}`);
	const patternBuildDirectory = resolve(buildDirectory, 'patterns');
	const staticCacheDirectory = resolve(application.runtime.patterncwd || application.runtime.cwd, '.cache');


	if (buildConfig.tasks.patterns) {
		// Copy assets
		if (await qfs.exists(assetRoot)) {
			application.log.info(`[console:run] Copy static files from "${staticRoot}" to ${buildDirectory} ...`);
			await qfs.makeTree(resolve(patternBuildDirectory, '_assets'));
			await qfs.copyTree(assetRoot, resolve(patternBuildDirectory, '_assets'));
		} else {
			application.log.info(`[console:run] No static files at "${staticRoot}"`);
		}

		if (application.cache) {
			application.cache.config.static = false;
		}

		let patternList = await getPatterns({
			'id': '.',
			'base': patternRoot,
			'config': patternConfig,
			'factory': application.pattern.factory,
			'transforms': application.transforms,
			'filters': {},
			'log': function(...args) {
				application.log.debug(...['[console:run]', ...args]);
			}
		}, application.cache, false, false);

		if (application.cache) {
			application.cache.config.static = true;
		}

		for (let patternItem of patternList) {
			let patternResultDirectory = resolve(patternBuildDirectory, patternItem.id);
			let patternSnippetsDirectory = resolve(patternResultDirectory, 'snippets');

			await qfs.makeTree(patternResultDirectory);
			await qfs.makeTree(patternSnippetsDirectory);

			// write pattern.json with additional meta data
			let metaData = Object.assign({}, patternItem.manifest, {
				'build': {
					'date': built,
					environment, mode, revision,
					tag, version
				},
				'results': {}
			});

			for (let resultEnvironmentName of Object.keys(patternItem.results)) {
				let resultEnvironment = patternItem.results[resultEnvironmentName];
				let environmentConfig = patternItem.environments[resultEnvironmentName].manifest;
				metaData.results[resultEnvironmentName] = {};

				for (let resultName of Object.keys(resultEnvironment)) {
					let result = resultEnvironment[resultName];
					metaData.results[resultEnvironmentName][resultName] = {};

					let variants = [
						{ 'name': 'demo', 'buffer': result.demoBuffer },
						{ 'name': '', 'buffer': result.buffer }
					];
					variants = variants.filter((item) => item.buffer.length > 0);

					// Write all variants into snippets
					for (let variant of variants) {
						let fragments = [
							resultName.toLowerCase(),
							!environmentConfig.formats || environmentConfig.formats.includes(result.in) ? resultEnvironmentName : '',
							variants.length > 1 ? variant.name : ''
						];

						fragments = fragments.filter((item) => item);

						let resultFileBaseName = `${fragments.join('-')}.${result.out}`;
						let resultFile = resolve(patternSnippetsDirectory, resultFileBaseName);
						await qfs.write(resultFile, variant.buffer);
						metaData.results[resultEnvironmentName][resultName][variant.name || 'library'] = qfs.relativeFromDirectory(patternResultDirectory, resultFile);
					}

					// Write main variant into pattern build folder, render html into layout
					let mainBuffer = result.demoBuffer || result.buffer;
					let mainName = resultName.toLowerCase();

					// TODO: resolve this
					if (mainName === 'markup') {
						continue;
					}

					// TODO: resolve this
					mainName = mainName === 'documentation' ? mainName : resultEnvironmentName;

					let mainFileBaseName = `${mainName}.${result.out}`;
					let mainFile = resolve(patternResultDirectory, mainFileBaseName);
					await qfs.write(mainFile, mainBuffer);
				}
			}

			// Render markup into layout, write to index.html
			let templateData = {
				'title': patternItem.id,
				'style': [],
				'script': [],
				'markup': [],
				'route': (name, params) => {
					// TODO: Generalize this
					let id = params.id || params.path;
					id = id === 'content.js' ? 'content.bundle.js' : id;
					name = name === 'script' ? '_assets/script' : name;

					let fragments = [name, id];
					fragments = fragments.filter((item) => item);

					return '/' + fragments.join('/');
				}
			};

			for (let environmentName of Object.keys(patternItem.results)) {
				let environment = patternItem.results[environmentName];
				let envConfig = patternItem.environments[environmentName].manifest || {};
				let wrapper = getWrapper(envConfig['conditional-comment']);
				let blueprint = {'environment': environmentName, 'content': '', wrapper};

				for (let resultType of Object.keys(environment)) {
					let result = environment[resultType];
					let templateKey = resultType.toLowerCase();
					let content = result.demoBuffer || result.buffer;
					let uri = `${patternItem.id}/${environmentName}.${result.out}`;
					let templateSectionData = Object.assign({}, blueprint, {content, uri});

					templateData[templateKey] = Array.isArray(templateData[templateKey]) ?
						templateData[templateKey].concat([templateSectionData]) :
						[templateSectionData];
				}
			}

			let rendered = layout(templateData);

			// Write index.html
			await qfs.write(resolve(patternResultDirectory, 'index.html'), rendered);

			// Write build.json to pattern tree
			await qfs.write(resolve(patternResultDirectory, 'build.json'), JSON.stringify(patternItem, null, '  '));

			// Write build.json to cache tree
			if (buildConfig.tasks.cache) {
				let staticPatternCacheDirectory = resolve(staticCacheDirectory, patternItem.id);

				application.log.info(`[console:run] Writing cache for "${patternItem.id}" to ${staticPatternCacheDirectory} ...`);
				await qfs.makeTree(staticPatternCacheDirectory);
				await qfs.write(resolve(staticPatternCacheDirectory, 'build.json'), JSON.stringify(patternItem, null, '  '));
			}

			// Write augmented pattern.json
			await qfs.write(resolve(patternResultDirectory, 'pattern.json'), JSON.stringify(metaData, null, '  '));
		}
	}

	// Build environment output
	if (buildConfig.tasks.bundles) {
		let environments = await qfs.listTree(resolve(patternRoot, '@environments'));

		environments = environments
			.filter((item) => basename(item) === 'pattern.json')
			.map((item) => dirname(item));

		if (environments.length === 0) {
			environments = ['index'];
		}

		let builds = [];

		for (let environment of environments) {
			let pattern = await getPatterns({
				'id': qfs.relativeFromDirectory(patternRoot, environment),
				'base': patternRoot,
				'config': patternConfig,
				'factory': application.pattern.factory,
				'transforms': application.transforms,
				'filters': {},
				'log': function(...args) {
					application.log.debug(...['[console:run]', ...args]);
				}
			}, application.cache, false, true);

			builds.push(pattern[0]);
		}

		await qfs.makeTree(patternBuildDirectory);
		let writes = [];

		for (let build of builds) {
			let target = build.manifest.name;

			let info = Object.assign({}, information, { version, target });
			let fragments = ['/**!'];

			let comment = Object.keys(info).reduce((results, fragmentName) => {
				let name = `${fragmentName[0].toUpperCase()}${fragmentName.slice(1)}`;
				let value = info[fragmentName];
				results.push(` * ${name}: ${value}`);
				return results;
			}, fragments).concat(['**/']).join('\n');

			let results = build.results[target];

			for (let resultName of Object.keys(results)) {
				let result = results[resultName];
				let contents = `${comment}\n${result.buffer.toString('utf-8')}`;
				let ext = result.out;
				let fileName = resolve(buildDirectory, [build.manifest.name, ext].join('.'));
				application.log.info(`[console:run] Writing "${resultName}" for configuration "${build.manifest.name}" to ${fileName} ...`);
				writes.push(qfs.write(fileName, contents));
			}
		}

		await Promise.all(writes);
	}

	if (buildConfig.tasks.static) {
		// Copy static files
		if (await qfs.exists(staticRoot)) {
			application.log.info(`[console:run] Copy asset files from "${assetRoot}" to ${patternBuildDirectory} ...`);
			await qfs.makeTree(resolve(patternBuildDirectory, 'static'));
			await qfs.copyTree(staticRoot, resolve(patternBuildDirectory, 'static'));
		} else {
			application.log.info(`[console:run] No asset files at "${assetRoot}"`);
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
