import boilerplate from 'boilerplate-server';
import findRoot from 'find-root';

import cache from './cache';
import pattern from './pattern';
import transforms from './transforms';

export default async options => {
	const instance = await boilerplate({
		name: 'patternplate-server',
		cwd: findRoot(__dirname),
		...options
	});

	instance.transforms = await transforms(instance);
	instance.pattern = await pattern(instance);
	instance.cache = await cache(instance);
	return instance;
};
