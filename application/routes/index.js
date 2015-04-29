import {resolve, relative, basename} from 'path';
import {listTree, split, join, directory} from 'q-io/fs';
import {request} from 'q-io/http';

export default function indexRouteFactory (application, configuration) {

	return async function indexRoute () {
		let routeConfig = application.configuration.routes.enabled;
		let serverConfig = application.configuration.server;

		let baseURI = `http://${serverConfig.host}:${serverConfig.port}`;

		let routes = Object.keys(routeConfig)
			.filter((routeName) => routeConfig[routeName].enabled === true)
			.map(function(routeName){
				return { 'name': routeName, 'path': routeConfig[routeName].path, 'uri': `${baseURI}${routeConfig[routeName].path}`.replace('*', '') }
			});

		let metaRoute = routes.filter((item) => item.name === 'meta')[0];
		let response = await request(metaRoute.uri);
		let meta = await response.body.read();

		meta = JSON.parse(meta.toString('utf-8'));

		this.type = 'json';
		this.body = Object.assign({}, {
			'name': application.configuration.pkg.name,
			'version': application.configuration.pkg.version,
			'environment': application.configuration.environment,
			'host': serverConfig.host,
			'port': serverConfig.port,
			'routes': routes,
			'meta': meta
		});
	};
}
