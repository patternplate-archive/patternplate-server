import {find} from 'lodash';
export default constructDependencies;

function constructDependencies(patterns = {}, pool = []) {
	return Object
		.entries(patterns)
		.reduce((result, entry) => {
			const [name, id] = entry;
			const dependency = find(pool, {id});
			if (!dependency) {
				console.log('construct-dependencies', id, pool.map(p => p.id));
				return result;
			}
			dependency.dependencies = constructDependencies(dependency.manifest.patterns, pool);
			result[name] = dependency;
			return result;
		}, {});
}
