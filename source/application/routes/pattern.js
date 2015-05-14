import {resolve, join} from 'path';

import fs from 'q-io/fs';

export default function patternRouteFactory (application, configuration) {
	const config = application.configuration[configuration.options.key];

	return async function patternRoute () {
		this.type = 'json';

		var id = this.params.id;
		let pattern;
		let response;
		let mtime;

		let cwd = application.runtime.patterncwd || application.runtime.cwd;
		let basePath = resolve(cwd, config.path);
		let path = resolve(basePath, id);

		let uri = `http://${this.request.host}${this.request.url}`;

		if (await fs.contains(basePath, path) === false) {
			this.throw(404, `Could not find pattern ${id}`, {'error': true, 'message': `Could not find ${id}`});
		}

		if (application.cache) {
			response = application.cache.get(uri);
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
					err.fileName = err.fileName || id;
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
						err.fileName = err.fileName || patternID;
						this.throw(500, err);
					}
				}

				mtime = response.map((item) => item.getLastModified()).sort((a, b) => b - a)[0];
			}
		}

		response = Array.isArray(response) ? response : [response];

		response = response.map((resp) => {
			return typeof resp.toJSON === 'function' ? resp.toJSON() : resp
		});

		response = response.length === 1 ? response[0] : response;

		if (application.cache) {
			application.cache.set(uri, response);
		}

		if (mtime) {
			this.set('Last-Modified', mtime.toUTCString());
		}
		this.set('Cache-Control', `maxage=${configuration.options.maxage|0}`);
		this.body = JSON.stringify(response);
	};
}
