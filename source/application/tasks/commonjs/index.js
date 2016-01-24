import {resolve, join, dirname} from 'path';
import {promisify} from 'bluebird';
import {writeFile as writeFileNodeback} from 'fs';
const writeFile = promisify(writeFileNodeback);
import ncpNodeback from 'ncp';
const copy = promisify(ncpNodeback);
import mkdirpNodeback from 'mkdirp';
const mkdirp = promisify(mkdirpNodeback);
import pathExists from 'path-exists';
import merge from 'lodash.merge';
import getPatterns from '../../../library/utilities/get-patterns';
import resolvePathFormatString from '../../../library/resolve-utilities/resolve-path-format-string';

const pkg = require(resolve(process.cwd(), 'package.json'));

async function exportAsCommonjs(application) {
	const serverPkg = application.configuration.pkg;

	const patternHook = application.hooks.filter((hook) => hook.name === 'patterns')[0];
	const patternRoot = resolve(application.runtime.patterncwd || application.runtime.cwd, patternHook.configuration.path);
	const staticRoot = resolve(application.runtime.patterncwd || application.runtime.cwd, 'static');
	const commonjsConfig = application.configuration.commonjs || {};

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
//	application.configuration.patterns = {...application.configuration.patterns, ...patterns};
//	application.configuration.transforms = {...application.configuration.transforms, ...transforms};

	const built = new Date();
	const environment = application.runtime.env;
	const mode = application.runtime.mode;
	const version = pkg.version;

	const commonjsRoot = resolve(application.runtime.patterncwd || application.runtime.cwd, 'distribution');
	const manifestPath = resolve(commonjsRoot, 'package.json');

	const patternList = await getPatterns({
		'id': '.',
		'base': patternRoot,
		'config': patternConfig,
		'factory': application.pattern.factory,
		'transforms': application.transforms,
		'filters': commonjsConfig.filters,
		'log': function(...args) {
			application.log.debug(...['[console:run]', ...args]);
		}
	}, application.cache);

	if (application.cache) {
		application.cache.config.static = true;
	}

	for (const patternItem of patternList) {
		const resultEnvironment = patternItem.results.index;

		// Read pathFormatString from matching trasnform config for now,
		// will be fed from pattern result meta information when we approach the new transform system
		const pathFormatString = commonjsConfig.resolve;

		for (const resultName of Object.keys(resultEnvironment)) {
			const result = resultEnvironment[resultName];
			const resultPath = join(commonjsRoot,
				resolvePathFormatString(pathFormatString, patternItem.id, resultName, result.out));
			await mkdirp(dirname(resultPath));
			await writeFile(resultPath, result.buffer);
		}

		const commonjsPkg = {
			name: pkg.name,
			author: pkg.author,
			contributors: pkg.contributors,
			repository: pkg.repository,
			license: pkg.license,
			version,
			dependencies: {
				react: pkg.dependencies.react || serverPkg.dependencies.react
			},
			_patternplate: {
				built,
				environment,
				mode,
				config: commonjsConfig
			},
			...commonjsConfig.pkg
		};

		await writeFile(manifestPath, JSON.stringify(commonjsPkg, null, '  '));
	}

	if (await pathExists(staticRoot)) {
		application.log.info(`[console:run] Copy asset files from "${staticRoot}" to ${commonjsRoot} ...`);
		await copy(staticRoot, resolve(commonjsRoot, 'static'), {});
	} else {
		application.log.info(`[console:run] No asset files at "${staticRoot}"`);
	}
}

export default exportAsCommonjs;
