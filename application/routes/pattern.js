import {resolve, join} from 'path';

import {exists, contains, list, isDirectory} from 'q-io/fs';

export default function patternRouteFactory (application, configuration) {
	const config = application.configuration[configuration.options.key];

	return async function patternRoute () {
		var id = this.params[0].value;
		let pattern;

		let path = resolve(config.path, id);

		if (await contains(config.path, path) === false) {
			return;
		}

		let search = resolve(path, 'pattern.json');
		let response;

		if (await exists(search)) {
			// Single pattern
			try {
				pattern = await application.pattern.factory(id, config.path, config, application.transforms);
				await pattern.read();
				await pattern.transform();
			} catch (err) {
				application.log.error(err);
				return;
			}

			response = pattern;
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

				let pattern = await application.pattern.factory(patternID, config.path, config, application.transforms);

				await pattern.read();
				await pattern.transform();
				response.push(pattern);
			}
		}

		this.type = 'json';
		this.body = response;
	};
}
