import {createReadStream} from 'fs';
import {resolve, basename, extname, dirname} from 'path';

import exists from 'path-exists';

function scriptRouteFactory(application) {
	const browserifyConfig = application.configuration.assets.browserify || {};

	return async function scriptRoute() {
		const suffix = application.runtime.env === 'development' ? '' : 'bundle';
		const ext = extname(this.params.path).slice(1);

		const filename = [basename(this.params.path, `.${ext}`), suffix, ext]
			.filter(Boolean)
			.join('.');

		const relative = dirname(this.params.path);
		const path = resolve(application.runtime.cwd, 'assets', 'script', relative, filename);

		if (!await exists(path)) {
			return;
		}

		this.type = 'js';

		try {
			if (application.runtime.env === 'development') {
				const browserify = require('browserify');
				const bundler = browserify(path, browserifyConfig);
				this.body = bundler.bundle();
			} else {
				this.body = createReadStream(path);
			}
		} catch (err) {
			application.log.error(err);
			this.throw(err, 500);
		}
	};
}

export default scriptRouteFactory;
