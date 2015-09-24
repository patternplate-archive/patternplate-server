function getPatternIdRegistry(dependencies) {
	return Object.keys(dependencies).reduce((registry, dependencyName) => {
		const id = dependencies[dependencyName].pattern.id;
		const path = dependencies[dependencyName].pattern.path;
		return { ...registry, [dependencyName]: { id, path }};
	}, {});
}

export default getPatternIdRegistry;
