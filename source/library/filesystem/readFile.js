import {
	readFile as readFileNodeBack,
	stat as statNodeBack
} from 'fs';

import denodeify from 'denodeify';

const readFile = denodeify(readFileNodeBack);
const stat = denodeify(statNodeBack);

const defaults = {
	cache: null
};

function cacheIo(fn, cache) {
	return async function(file) {
		const stats = await stat(file);
		const cached = cache.get(file, stats.mtime);
		if (cached) {
			return cached;
		}
		const content = await fn(file);
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

