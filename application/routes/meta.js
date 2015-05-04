import {resolve, relative, basename} from 'path';
import {listTree, split, join, directory} from 'q-io/fs';

export default function metaRouteFactory (application, configuration) {
	const config = application.configuration[configuration.options.key];
	const path = resolve(application.runtime.patterncwd || application.runtime.cwd, config.path);

	return async function metaRoute () {
		let list = await listTree(path);

		list = list.map(function normalizePath (item) {
			let depth = split(relative(item, path)).length;

			return join(split(item).slice(depth * -1));
		});

		let patterns = list.filter((item) => basename(item) === 'pattern.json')
			.map((item) => directory(item));

		this.type = 'json';
		this.body = patterns.reduce(function(tree, path){
			let fragments = split( path );
			let sub = tree;

			fragments.forEach(function(fragment, index){
				if (!(fragment in sub)) {
					sub[fragment] = index + 1 === fragments.length ? true : {};
				}
				sub = sub[fragment];
			});

			return tree;
		}, {});
	};
}
