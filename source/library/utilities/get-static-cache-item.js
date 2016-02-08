import {
	resolve
} from 'path';

import {
	debuglog
} from 'util';

import exists from 'path-exists';

import getReadFile from '../filesystem/read-file.js';

const debug = debuglog('cache-static');

export default async function getStaticCacheItem(id, path, cache) {
	const cacheFilePath = resolve(path, `${id.split('/').join('-')}.json`);
	const readFile = getReadFile({cache});

	if (!await exists(cacheFilePath)) {
		debug('static cache miss for %s', cacheFilePath);
		return null;
	}

	debug('using static cache for %s', cacheFilePath);
	const cacheFileContents = await readFile(cacheFilePath);
	return JSON.parse(cacheFileContents);
}
