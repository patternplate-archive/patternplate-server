import {resolve} from 'path';
import getPatternTree from '../library/utilities/get-pattern-tree';

export default async function getNavigation(application) {
	const config = application.configuration.patterns;
	const {patterncwd, cwd} = application.runtime;
	const path = resolve(patterncwd || cwd, config.path);
	return await getPatternTree('.', path, {
		cache: application.cache
	});
}
