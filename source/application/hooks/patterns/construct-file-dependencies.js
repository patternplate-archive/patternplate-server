export default constructFileDependencies;

function constructFileDependencies(dependencies, search) {
	return Object
		.entries(dependencies)
		.reduce((results, entry) => {
			const [dependencyName, dependencyPattern] = entry;
			const searchResults = Object.keys(dependencyPattern.files || {})
				.filter(file => {
					return search.indexOf(file) > -1;
				});
			const dependencyFileName = searchResults[0];
			const dependencyFile = dependencyPattern.files[dependencyFileName] || {};
			if (dependencyFile.path) {
				dependencyFile.dependencies = constructFileDependencies(
					dependencyPattern.dependencies, search
				);
				results[dependencyName] = dependencyFile;
			}
			return results;
		}, {});
}
