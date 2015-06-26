import {resolve, join, dirname, basename} from 'path';
import fs from 'q-io/fs';

async function getPatterns(options, cache = null) {
	let {id, base, config, factory, transforms, filters, log} = options;
	let path = resolve(base, id);
	let search = resolve(path, 'pattern.json');
	let filterID = JSON.stringify(filters);

	log = log || function() {};

	// No patterns to find here
	if (!await fs.exists(path)) {
		return null;
	}

	// We are dealing with a directory listing
	if (!await fs.exists(search)) {
		search = path;
	}

	// Get all pattern ids
	let paths = await fs.listTree(search);
	let patternIDs = paths
		.filter((item) => basename(item) === 'pattern.json')
		.filter((item) => !item.includes('@environments'))
		.map((item) => dirname(item))
		.map((item) => fs.relativeFromDirectory(options.base, item));

	let results = [];

	for (let patternID of patternIDs) {
		let readCacheID = `pattern:read:${patternID}`;
		let transformCacheID = `pattern:transformed:${patternID}${filterID}`;
		log(`Initializing pattern "${patternID}"`);

		try {
			let pattern = await factory(patternID, base, config, transforms, filters);
			let cachedRead = cache && cache.config.read ? cache.get(readCacheID, false) : null;

			if (!cachedRead) {
				log(`Reading pattern "${patternID}"`);
				await pattern.read();
			} else {
				log(`Using cached pattern read "${readCacheID}"`);
				pattern = cachedRead;
			}

			if (cache && cache.config.read) {
				cache.set(readCacheID, pattern.mtime, pattern);
			}

			let cachedTransform = cache && cache.config.transform ? cache.get(transformCacheID, pattern.mtime) : null;

			if (!cachedTransform) {
				log(`Transforming pattern "${patternID}"`);
				await pattern.transform();
			} else {
				log(`Using cached pattern transform "${transformCacheID}"`);
				pattern = cachedTransform;
			}

			if (cache && cache.config.transform) {
				cache.set(transformCacheID, pattern.mtime, pattern);
			}

			results.push(pattern);
		} catch (err) {
			throw err;
		}
	}

	results = results.map((result) => {
		return typeof result.toJSON === 'function' ? result.toJSON() : result;
	});

	return results;
}

export default getPatterns;
