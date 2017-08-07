import path from 'path';
import globby from 'globby';
import json from 'load-json-file';
import exists from 'path-exists';

const DEFAULT_MANIFEST = {
	version: '1.0.0',
	build: true,
	display: true,
	options: {}
};

export async function getPatterns(base) {
	const resolve = path.resolve.bind(null, base);
	const cwd = resolve('.');
	const read = f => json(resolve(f));

	if (!await exists(cwd)) {
		return [];
	}

	const files = await globby(`**/pattern.json`, {cwd});

	const patterns = await Promise.all(files
		.filter(file => ['@environments', '@docs'].every(i => !file.startsWith(i)))
		.map(async file => {
			const data = await read(file);
			data.displayName = data.displayName || data.name || null;
			const id = file.split(path.sep).join('/');
			const manifest = {...DEFAULT_MANIFEST, ...data};
			return {id, path: file, manifest};
		}));


	return patterns.map(pattern => {
		const id = path.dirname(pattern.id);
		const deps = Object.values(pattern.manifest.patterns || {});

		pattern.dependencies = patterns.reduce((d, p) => {
			const pId = path.dirname(p.id);
			if (deps.includes(pId) && pId !== id) {
				d[pId] = {
					id: pId,
					manifest: p.manifest,
					type: 'pattern'
				};
			}
			return d;
		}, {});

		pattern.dependents = patterns.reduce((d, p) => {
			const pId = path.dirname(p.id);
			const pDeps = Object.values(p.manifest.patterns || {});
			if (pDeps.includes(id) && pId !== id) {
				d[pId] = {
					id: pId,
					manifest: p.manifest,
					type: 'pattern'
				};
			}
			return d;
		}, {});

		return pattern;
	});
}

export async function getPatternTree(base) {
	return treeFromPaths(await getPatterns(base));
}

function treeFromPaths(files) {
	const tree = {
		id: 'root',
		children: []
	};

	files.forEach(file => {
		const parts = file.path.split('/');
		let level = tree;

		parts.forEach((id, i) => {
			const existing = level.children.find(c => c.name === id);
			const n = parts[i + 1];

			if (!n) {
				return;
			}

			const type = getType(n || id);
			const name = getName(id, file.manifest);

			if (existing) {
				level = existing;
				return;
			}

			const item = {
				name,
				manifest: type === 'folder' ?
					{displayName: id, name: id, options: {}} :
					file.manifest,
				id: parts.slice(0, i + 1).join('/'),
				path: parts.slice(0, i + 1),
				type
			};

			level.children.push(item);

			if (item.type === 'folder') {
				item.children = [];
				level = item;
			} else {
				item.dependents = file.dependents;
				item.dependencies = file.dependencies;
			}
		});
	});

	return tree;
}

function getName(basename, manifest) {
	if (basename === 'pattern.json') {
		return manifest.name;
	}
	return basename;
}

function getType(basename) {
	if (basename === 'pattern.json') {
		return 'pattern';
	}
	return 'folder';
}
