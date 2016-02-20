import {createReadStream} from 'fs';
import {resolve, basename, extname, dirname} from 'path';

import exists from 'path-exists';

function scriptRouteFactory(application) {
	const browserifyConfig = application.configuration.assets.browserify || {};

	return async function scriptRoute() {
		const ext = extname(this.params.path).slice(1);

		const devFileName = [basename(this.params.path, `.${ext}`), '', ext]
			.filter(Boolean)
			.join('.');

		const prodFilename = [basename(this.params.path, `.${ext}`), 'bundle', ext]
			.filter(Boolean)
			.join('.');

		const relative = dirname(this.params.path);
		const devPath = resolve(
			application.runtime.cwd, 'assets', 'script', relative, devFileName
		);
		const prodPath = resolve(
			application.runtime.cwd, 'assets', 'script', relative, prodFilename
		);

		if (application.runtime.env === 'development' && !await exists(devPath)) {
			this.throw(404);
		} else if (application.runtime.env === 'production' && !await exists(prodPath)) {
			this.throw(404);
		}

		this.type = 'js';

		try {
			if (application.runtime.env === 'development' && !await exists(prodPath)) {
				const browserify = require('browserify');
				const bundler = browserify(devPath, browserifyConfig);
				this.body = bundler.bundle();
			} else {
				this.body = createReadStream(prodPath);
			}
		} catch (err) {
			application.log.error(err);
			this.throw(err, 500);
		}
	};
}

export default scriptRouteFactory;
