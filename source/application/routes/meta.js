import {resolve, relative, basename} from 'path';
import fs from 'q-io/fs';

export default function metaRouteFactory (application, configuration) {
	return async function metaRoute () {
		let config = application.configuration[configuration.options.key];
		let path = resolve(application.runtime.patterncwd || application.runtime.cwd, config.path);

		let list = await fs.listTree(path);

		list = list.map(function normalizePath (item) {
			let depth = fs.split(relative(item, path)).length;
			return fs.join(fs.split(item).slice(depth * -1));
		});

		let patterns = list
			.filter((item) => basename(item) === 'pattern.json')
			.filter((item) => !item.includes('@environments'))
			.map((item) => fs.directory(item));

		this.type = 'json';
		this.body = patterns.reduce(function reducePatterns (tree, patternPath) {
			let fragments = fs.split(patternPath);
			let sub = tree;

			fragments.forEach(function iterateFragments (fragment, index) {
				if (!(fragment in sub)) {
					sub[fragment] = index + 1 === fragments.length ? true : {};
				}
				sub = sub[fragment];
			});

			return tree;
		}, {});
	};
}
