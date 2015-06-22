import {resolve, basename} from 'path';
import {parse as parseUrl} from 'url';

import send from 'koa-send';

export default function staticRouteFactory (application, configuration) {
	return function * staticRoute () {
		let root = resolve(application.runtime.patterncwd || application.runtime.cwd, 'static');
		this.assert(this.params.path, 404);
		yield send(this, this.params.path, {root});
	};
}
