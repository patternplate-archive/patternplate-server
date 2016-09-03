import {resolve, sep} from 'path';
import getReadFile from '../filesystem/read-file.js';

const defaultManifest = {
	version: '0.1.0',
	build: true,
	display: true
};

export default getPatternManifest;

async function getPatternManifest(id, base, cache = null) {
	const readFile = getReadFile({cache});
	const idPath = id.split('/').join(sep);
	const content = await readFile(resolve(base, idPath, 'pattern.json'));
	const data = JSON.parse(content);

	data.id = id;
	data.version = data.version || defaultManifest.version;
	data.build = data.build || defaultManifest.build;
	data.display = data.display || defaultManifest.display;

	return data;
}
