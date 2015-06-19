import {resolve, basename} from 'path';
import {parse as parseUrl} from 'url';

import static from 'koa-send';

export default function staticRouteFactory (application, configuration) {
	return function * staticRoute () {
		let root = resolve(application.runtime.patterncwd || application.runtime.cwd, 'static');
		yield static(this, this.params.path, {root});
}
