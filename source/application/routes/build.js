import {resolve, basename} from 'path';
import {parse as parseUrl} from 'url';

import send from 'koa-send';

export default function buildRouteFactory (application, configuration) {
	return function * buildRoute () {
		let root = resolve(application.runtime.patterncwd || application.runtime.cwd, 'build');
		let parsed = parseUrl(this.req.url, true);
		let path = this.params.path || parsed.query.path;
		this.assert(path, 404);
		yield send(this, path, {root});
		this.set('Content-Disposition', `attachment; filename=${basename(path)}`);
	};
}
