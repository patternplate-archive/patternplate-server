import path from 'path';

import {merge} from 'lodash';
import getPatterns from './utilities/get-patterns';
import getMountTransformChain from './utilities/get-mount-transform-chain';
import getStaticCacheItem from './utilities/get-static-cache-item';

export default getComponent;

const overrides = {
	transforms: {
		'react': {
			inFormat: 'jsx',
			outFormat: 'jsx',
			resolveDependencies: false,
			convertDependencies: true
		},
		'react-mount': {
			inFormat: 'js',
			outFormat: 'js'
		},
		'browserify': {
			inFormat: 'js',
			outFormat: 'js'
		}
	}
};

async function getComponent(app, id, env = 'index') {
	const cwd = app.runtime.patterncwd || app.runtime.cwd;
	const base = path.resolve(cwd, app.configuration.patterns.path);
	const jsxFormat = app.configuration.patterns.formats.jsx;
	const mountableCacheRoot = path.resolve(cwd, '.cache', 'react-mount');
	const transforms = getMountTransformChain(jsxFormat, app.configuration.transforms);
	const name = 'Component';
	const componentFormat = {name, transforms};

	// special cache for react-mount
	const cached = await getStaticCacheItem({
		id,
		base: mountableCacheRoot,
		cache: app.cache,
		extension: 'js',
		stream: true,
		filters: {
			environments: [env].filter(Boolean)
		}
	});

	if (cached) {
		return {buffer: cached};
	}

	const passed = {
		transforms: app.configuration.transforms,
		patterns: app.configuration.patterns
	};

	const formats = {jsx: componentFormat, html: componentFormat};
	const patterns = {formats};

	const config = merge({}, passed, overrides, {patterns});

	const [pattern] = await getPatterns({
		id,
		base,
		config,
		factory: app.pattern.factory,
		filters: {
			environments: [env].filter(Boolean),
			outFormats: ['js']
		},
		transforms: app.transforms,
		log: app.log
	}, app.cache);

	return pattern.results[name] ? pattern.results[name] : null;
}
