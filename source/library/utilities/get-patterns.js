import {resolve, join} from 'path';
import fs from 'q-io/fs';

async function getPatterns(id, base, config, factory, transforms) {
	let patterns = [];
	let response;
	let path = resolve(base, id);
	let search = resolve(path, 'pattern.json');

	if (await fs.exists(search)) {
		try {
			let pattern = await factory(id, base, config, transforms);
			await pattern.read();
			await pattern.transform();
			patterns.push(pattern);
		} catch (err) {
			throw err;
		}
	} else {
		if (await fs.isDirectory(path) === false) {
			return null;
		}

		let files = await fs.list(path);
		let matches = [];

		for (let file of files) {
			let search = resolve(path, file, 'pattern.json');
			if (await fs.exists(search)) {
				matches.push(file);
			}
		}

		for (let directory of matches) {
			let patternID = join(id, directory);

			try {
				let pattern = await factory(patternID, base, config, transforms);
				patterns.push(pattern);
				await pattern.read();
				await pattern.transform();
			} catch (err) {
				throw err;
			}
		}
	}

	let mtime = patterns
		.map((item) => item.getLastModified())
		.sort((a, b) => b - a)[0] || new Date();

	patterns = patterns.map((resp) => {
		return typeof resp.toJSON === 'function' ? resp.toJSON() : resp;
	});

	return { mtime, 'results': patterns };
}

export default getPatterns;
