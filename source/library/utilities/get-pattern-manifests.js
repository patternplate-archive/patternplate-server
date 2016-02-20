import {
	basename,
	dirname,
	resolve,
	sep
} from 'path';

import fs from 'q-io/fs';

import getReadFile from '../filesystem/read-file.js';

const defaultManifest = {
	'version': '0.1.0',
	'build': true,
	'display': true
};

async function loadManifest (id, base, cache = null) {
	const readFile = getReadFile({cache});
	const idPath = id.split('/').join(sep);
	const content = await readFile(resolve(base, idPath, 'pattern.json'));
	const data = JSON.parse(content);
	return Object.assign({}, defaultManifest, data, { id });
}

async function loadPatterns (id, base, options = {}) {
	const path = id.split('/').join(sep);
	const paths = await fs.listTree(
		resolve(base, path)
	);

	const patternIDs = paths
		.filter((item) => basename(item) === 'pattern.json')
		.filter((item) => !item.includes('@environments'))
		.map((item) => dirname(item))
		.map((item) => fs.relativeFromDirectory(base, item))
		.map((item) => item.split(sep).join('/'));

	const manifests = Promise.all(
		patternIDs
			.map(patternID => loadManifest(patternID, base, options.cache))
	);
	return await manifests;
}

export default loadPatterns;
