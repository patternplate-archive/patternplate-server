import {resolve} from 'path';
import {debuglog} from 'util';

import {merge} from 'lodash';

import getEnvironments from '../../../library/utilities/get-environments';

export default async (application, settings) => {
	const debug = debuglog('bundles');
	debug('calling bundles with');
	debug(settings);

	const {cache, log} = application;
	const cwd = application.runtime.patterncwd || application.runtime.cwd;
	const patternHook = application.hooks.filter(hook => hook.name === 'patterns')[0];
	const patternRoot = resolve(cwd, patternHook.configuration.path);

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

	// Get environments
	const environments = await getEnvironments(patternRoot, {
		cache,
		log
	});

	// For each environment with include key, build a bundle for each format
};
