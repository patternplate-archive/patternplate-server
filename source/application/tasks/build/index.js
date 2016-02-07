import {merge} from 'lodash';

import buildCache from '../build-cache';
import buildBundles from '../build-bundles';

export default async function build (...args) {
	const [application, options] = args;
	const config = merge({}, application.configuration.build, options);

	if (config.tasks.cache) {
		await buildCache(...args);
	}

	if (config.tasks.bundles) {
		await buildBundles(...args);
	}
}
