import {
	resolve
} from 'path';
import getPatternTree from '../../library/utilities/get-pattern-tree';

export default (application, configuration) => {
	return async function metaRoute() {
		const config = application.configuration[configuration.options.key];
		const {patterncwd, cwd} = application.runtime;
		const path = resolve(patterncwd || cwd, config.path);
		this.type = 'json';
		this.body = await getPatternTree('.', path, {
			cache: application.cache
		});
	};
};
