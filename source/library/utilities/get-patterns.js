import {resolve, join, dirname, basename} from 'path';
import fs from 'q-io/fs';

async function getPatterns(options, cache = null, fail = true) {
	let {id, base, config, factory, transforms, filters, log} = options;
	let path = resolve(base, id);
	let search = resolve(path, 'pattern.json');
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
	let errors = [];

	for (let patternID of patternIDs) {
		let readCacheID = `pattern:read:${patternID}`;
		log(`Initializing pattern "${patternID}"`);

		let pattern = await factory(patternID, base, config, transforms, filters);
		let cachedRead = cache && cache.config.read ? cache.get(readCacheID, false) : null;

		if (!cachedRead) {
			log(`Reading pattern "${patternID}"`);
			try {
				await pattern.read();
			} catch (err) {
				if (fail) throw err;
				errors.push(err);
			}
		} else {
			log(`Using cached pattern read "${readCacheID}"`);
			pattern = cachedRead;
		}

		if (cache && cache.config.read) {
			cache.set(readCacheID, pattern.mtime, pattern);
		}

		try {
			results.push(await pattern.transform());
		} catch (err) {
			if (fail) throw err;
			errors.push(err);
		}
	}


	results = results.map((result) => {
		return typeof result.toJSON === 'function' ? result.toJSON() : result;
	});

	return results;
}

export default getPatterns;
