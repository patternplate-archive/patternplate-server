import {memoize} from 'lodash';
export default constructFileDependencies;

const getMatchingFile = memoize((files, search) => {
	const name = Object.keys(files).find(file => search.includes(file));
	return files[name] || {};
});

function constructFileDependencies(dependencies, search) {
	return Object
		.entries(dependencies)
		.reduce((results, entry) => {
			const [dependencyName, dependencyPattern] = entry;
			const dependencyFile = getMatchingFile(dependencyPattern.files, search);

			if (dependencyFile.path) {
				dependencyFile.dependencies = constructFileDependencies(
					dependencyPattern.dependencies, search
				);
				results[dependencyName] = dependencyFile;
			}
			return results;
		}, {});
}
