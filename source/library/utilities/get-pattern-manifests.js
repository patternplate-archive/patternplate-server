import { join, dirname, basename, sep, resolve } from 'path';
import fs from 'q-io/fs';

const defaultManifest = {
	'version': '0.1.0',
	'build': true,
	'display': true
};

async function loadManifest (path, id) {
	let content = await fs.read(join(path, id, 'pattern.json'));
	let data = JSON.parse(content);
	return Object.assign({}, defaultManifest, data, { id });
}

async function loadPatterns (path) {
	let paths = await fs.listTree(resolve('patterns', path));

	let patternIDs = paths
		.filter((item) => basename(item) === 'pattern.json')
		.filter((item) => !item.includes('@environments'))
		.map((item) => dirname(item))
		.map((item) => fs.relativeFromDirectory(path, item))
		.map((item) => item.split(sep).join('/'));

	let manifests = Promise.all(patternIDs.map(id => loadManifest(path, id)));
	return await manifests;
}

export default loadPatterns;
