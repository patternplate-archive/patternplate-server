import {find} from 'lodash';
export default constructDemoDependencies;

function constructDemoDependencies(patterns = {}, pool = []) {
	return Object
		.entries(patterns)
		.reduce((result, entry) => {
			const [name, id] = entry;
			const dependency = find(pool, {id});
			if (!dependency) {
				return result;
			}
			dependency.dependencies = constructDemoDependencies(dependency.manifest.demoPatterns, pool);
			result[name] = dependency;
			return result;
		}, {});
}
