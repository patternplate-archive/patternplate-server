import cache from './library/cache';
import pattern from './library/pattern';
import transforms from './library/transforms';

import fileRoute from './routes/file';
import healthRoute from './routes/health';
import indexRoute from './routes/index';
import metaRoute from './routes/meta';
import patternRoute from './routes/pattern';

export default async options => {
	const instance = {
		router: {
			url() {
				return '';
			}
		},
		configuration: {},
		name: 'patternplate-server',
		start() {

		}
	};

	instance.configuration = {};
	instance.transforms = await transforms(instance);
	instance.pattern = await pattern(instance);
	instance.cache = await cache(instance);

	return instance;
};
