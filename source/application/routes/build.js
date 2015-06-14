import {resolve} from 'path';
import send from 'koa-send';

export default function buildRouteFactory (application, configuration) {
	return function * buildRoute () {
		let result = resolve(application.runtime.cwd, 'build', 'build.zip');
		yield send(this, result);
	};
}
