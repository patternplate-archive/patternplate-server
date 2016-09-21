import {find} from 'lodash';
export default getPatternManifestsData;

function getPatternManifestsData(base, patterns = {}, pool = []) {
	return Object.values(patterns).map(id => {
		const dependency = find(pool, {id});
		return [dependency, ...getPatternManifestsData(base, dependency.patterns, pool)];
	});
}
