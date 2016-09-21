import {
	readFile as readFileNodeBack,
	stat as statNodeBack
} from 'fs';

import {
	debuglog
} from 'util';

import denodeify from 'denodeify';

const readFile = denodeify(readFileNodeBack);
const stat = denodeify(statNodeBack);
const debug = debuglog('cache-read');

const defaults = {
	cache: null
};

function cacheIo(fn, cache) {
	return async function(file) {
		const stats = await stat(file);
		const cached = cache.get(file, stats.mtime);
		if (cached) {
			debug('Using cached version of %s', file);
			return cached;
		}
		debug('Cache miss for %s', file);
		const content = await fn(file);
		debug('Setting cache for %s with mtime %s', file, stats.mtime);
		cache.set(file, stats.mtime, content);
		return content;
	};
}

export default options => {
	const settings = {...defaults, ...options};
	const cache = settings.cache;

	const cacheFn = cache ?
		fn => cacheIo(fn, cache) :
		fn => fn;

	return cacheFn(readFile);
};
