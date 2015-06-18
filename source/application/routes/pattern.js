import {resolve, join} from 'path';

import fs from 'q-io/fs';

export default function patternRouteFactory (application, configuration) {
	let patterns = application.configuration[configuration.options.key] || {};
	let transforms = application.configuration.transforms || {};

	const config = { patterns, transforms };

	return async function patternRoute () {
		this.type = 'json';

		var id = this.params.id;
		let pattern;
		let response;
		let mtime;

		let cwd = application.runtime.patterncwd || application.runtime.cwd;
		let basePath = resolve(cwd, config.patterns.path);
		let path = resolve(basePath, id);

		if (await fs.contains(basePath, path) === false) {
			this.throw(404, `Could not find pattern ${id}`, {'error': true, 'message': `Could not find ${id}`});
		}

		if (application.cache && application.runtime.env === 'production') {
			response = application.cache.get(id);
		}

		let search = resolve(path, 'pattern.json');

		if (!response) {
			if (await fs.exists(search)) {
				// Single pattern
				try {
					pattern = await application.pattern.factory(id, basePath, config, application.transforms);
					await pattern.read();
					await pattern.transform();
				} catch (err) {
					this.throw(500, err);
				}

				response = pattern;
				mtime = response.getLastModified();
			} else {
				// Check if fs.list view is applicable
				if (await fs.isDirectory(path) === false) {
					return;
				}

				let files = await fs.list(path);
				let patterns = [];

				response = [];

				for (let file of files) {
					let search = resolve(path, file, 'pattern.json');

					if (await fs.exists(search)) {
						patterns.push(file);
					}
				}

				for (let directory of patterns) {
					let patternID = join(id, directory);

					try {
						let pattern = await application.pattern.factory(patternID, basePath, config, application.transforms);
						response.push(pattern);
						await pattern.read();
						await pattern.transform();
					} catch (err) {
						this.throw(500, err);
					}
				}

				mtime = response.map((item) => item.getLastModified()).sort((a, b) => b - a)[0];
			}
		}

		response = Array.isArray(response) ? response : [response];

		response = response.map((resp) => {
			return typeof resp.toJSON === 'function' ? resp.toJSON() : resp;
		});

		if (application.cache && application.runtime.env === 'production') {
			application.cache.set(id, response);

			response.forEach(function cacheResponseItems (resp) {
				application.cache.set(resp.id, resp);
			});
		}

		response = response.length === 1 ? response[0] : response;

		if (mtime) {
			this.set('Last-Modified', mtime.toUTCString());
		}
		this.set('Cache-Control', `maxage=${configuration.options.maxage|0}`);
		this.body = JSON.stringify(response);
	};
}
