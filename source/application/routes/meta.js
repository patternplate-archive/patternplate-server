import {resolve, relative, basename} from 'path';
import fs from 'q-io/fs';
import getPatterns from '../../library/utilities/get-patterns';

export default function metaRouteFactory (application, configuration) {
	return async function metaRoute () {
		let config = application.configuration[configuration.options.key];
		let path = resolve(application.runtime.patterncwd || application.runtime.cwd, config.path);

		let patterns = await getPatterns({
			'id': '.',
			'config': {
				'patterns': application.configuration.patterns,
				'transforms': application.configuration.transforms
			},
			'base': path,
			'factory': application.pattern.factory,
			'transforms': application.transforms,
			'log': function(...args) {
				application.log.debug('[cache:pattern:getpattern]', ...args);
			}
		}, application.cache, false);

		// we only care about: id, version, name, displayName
		patterns = patterns.map(pattern => {
			return {
				'type': 'pattern',
				'id': pattern.id,
				'manifest': pattern.manifest
			};
		});

		// let's ignore @environment folders
		patterns = patterns.filter(pattern => {
			return pattern.id.split('/').indexOf('@environments') === -1;
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
