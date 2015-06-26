import {createReadStream} from 'fs';
import {resolve, basename, extname, dirname} from 'path';

import browserify from 'browserify';
import qio from 'q-io/fs';

function scriptRouteFactory (application) {
	const browserifyConfig = application.configuration.assets.browserify || {};

	return async function scriptRoute () {
		let suffix = application.runtime.env === 'development' ? '' : 'bundle';
		let ext = extname(this.params.path).slice(1);

		let filename = [basename(this.params.path, `.${ext}`), suffix, ext]
			.filter((fragment) => fragment)
			.join('.');

		let relative = dirname(this.params.path);
		let path = resolve(application.runtime.cwd, 'assets', 'script', relative, filename);

		if (!await qio.exists(path)) {
			return;
		}

		this.type = 'js';

		try {
			if (application.runtime.env === 'development') {
				let bundler = browserify(path, browserifyConfig);
				this.body = bundler.bundle();
			} else {
				this.body = createReadStream(path);
			}
		} catch(err) {
			application.log.error(err);
			this.throw(err, 500);
		}
	};
}

export default scriptRouteFactory;
