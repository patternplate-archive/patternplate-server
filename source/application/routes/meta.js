import {resolve, relative, basename} from 'path';
import fs from 'q-io/fs';
import getPatternManifests from '../../library/utilities/get-pattern-manifests';

export default function metaRouteFactory (application, configuration) {
	return async function metaRoute () {
		let config = application.configuration[configuration.options.key];
		let path = resolve(application.runtime.patterncwd || application.runtime.cwd, config.path);

		let manifests = await getPatternManifests(path);

		let patterns = manifests.map(manifest => {
			let { id, ...rest } = manifest;

			return {
				'type': 'pattern',
				'id': id,
				'manifest': rest
			};
		});

		// build a tree
		function setPatternInTree(tree, path, value) {
			let node = tree;
			let currentId = '';
			while (path.length > 1) {
				let name = path[0];
				currentId = (currentId == '') ? name : (currentId + '/' + name);

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
		};

		let tree = patterns.reduce((tree, pattern) => {
			setPatternInTree(tree, pattern.id.split('/'), pattern);
			return tree;
		}, {});

		this.type = 'json';
		this.body = tree;
	};
}
