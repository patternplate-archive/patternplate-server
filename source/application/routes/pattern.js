import {resolve, join} from 'path';

import {exists, contains, list, isDirectory} from 'q-io/fs';

export default function patternRouteFactory (application, configuration) {
	const config = application.configuration[configuration.options.key];

	return async function patternRoute () {
		var id = this.params[0].value;
		let pattern;
		let response;
		let mtime;

		let cwd = application.runtime.patterncwd || application.runtime.cwd;
		let basePath = resolve(cwd, config.path);
		let path = resolve(basePath, id);

		if (await contains(basePath, path) === false) {
			return;
		}

		let search = resolve(path, 'pattern.json');

		if (await exists(search)) {
			// Single pattern
			try {
				pattern = await application.pattern.factory(id, basePath, config, application.transforms);
				await pattern.read();
				await pattern.transform();
			} catch (err) {
				application.log.error(err);
				return;
			}

			response = pattern;
			mtime = response.getLastModified();
		} else {
			// Check if list view is applicable
			if (await isDirectory(path) === false) {
				return;
			}

			let files = await list(path);
			let patterns = [];

			response = [];

			for (let file of files) {
				let search = resolve(path, file, 'pattern.json');

				if (await exists(search)) {
					patterns.push(file);
				}
			}

			for (let directory of patterns) {
				let patternID = join(id, directory);

				let pattern = await application.pattern.factory(patternID, basePath, config, application.transforms);

				await pattern.read();
				await pattern.transform();
				response.push(pattern);
			}

			mtime = response.map((item) => item.getLastModified()).sort((a, b) => b - a)[0];
		}

		if (mtime) {
			this.set('Last-Modified', mtime.toUTCString());
		}
		this.set('Cache-Control', `maxage=${configuration.options.maxage|0}`);

		this.type = 'json';
		this.body = response;
	};
}
