import fetch from 'isomorphic-fetch';

import {resolve, normalize} from 'path';
import {exists, read} from 'q-io/fs';
import marked from 'marked';
import {promisify} from 'bluebird';

export default function indexRouteFactory (application, configuration) {
	const markdown = promisify(marked);

	return async function indexRoute () {
		let routeConfig = application.configuration.routes.enabled;
		let serverConfig = application.configuration.server;
		let base = `http://${serverConfig.host}:${serverConfig.port}`;

		let routes = Object.keys(routeConfig)
			.filter((routeName) => routeConfig[routeName].enabled === true)
			.map(function getRoutes (routeName) {
				return {'name': routeName, 'path': routeConfig[routeName].path, 'uri': `${base}${application.router.url(routeName)}`};
			});

		let response = await fetch(`${base}${application.router.url('meta')}`, {'headers': {'accepty-type': 'application/json'}});
		let meta = await response.json();

		let readmePath = resolve(application.runtime.patterncwd || application.runtime.cwd, 'patterns', 'README.md');
		var readme = '';

		if (await exists(readmePath)) {
			let readMeSource = await read(readmePath);
			readMeSource = readMeSource.toString('utf-8');
			readme = await markdown(readMeSource);
		}

		this.type = 'json';
		this.body = Object.assign({}, {
			'name': application.configuration.pkg.name,
			'version': application.configuration.pkg.version,
			'environment': application.configuration.environment,
			'host': serverConfig.host,
			'port': serverConfig.port,
			'routes': routes,
			'meta': meta,
			'readme': readme
		});
	};
}
