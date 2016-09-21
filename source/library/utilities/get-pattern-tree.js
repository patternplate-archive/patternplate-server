import getPatternManifests from './get-pattern-manifests';

export default async function getPatternTree(patternID, path, options = {}) {
	const manifests = await getPatternManifests(patternID, path, {
		cache: options.cache
	});

	const patterns = manifests.map(manifest => {
		const {id, ...rest} = manifest;
		return {type: 'pattern', id, manifest: rest};
	});

	// TODO: this needs a rewrite, badly
	// build a tree
	function setPatternInTree(tree, path, value) { // eslint-disable-line
		let node = tree;
		let currentId = '';
		while (path.length > 1) {
			let name = path[0];
			currentId = (currentId === '') ? name : (currentId + '/' + name);

			if (!node[name]) {
				node[name] = {
					'type': 'folder',
					'id': currentId,
					'children': {}
				};
			}
			node = node[name].children;
			path.shift();
		}
		node[path[0]] = value;
	}

	return patterns.reduce((tree, pattern) => {
		setPatternInTree(tree, pattern.id.split('/'), pattern);
		return tree;
	}, {});
}
