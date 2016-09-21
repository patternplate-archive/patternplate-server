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
	const options = data.options || {};

	data.id = id;
	data.version = data.version || defaultManifest.version;
	data.build = defined(data.build, defaultManifest.build);
	data.display = defined(!options.hidden, data.display, defaultManifest.display);
	return data;
}

function defined(...args) {
	return args.find(arg => typeof arg !== 'undefined');
}
