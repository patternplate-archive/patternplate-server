import {
	resolve
} from 'path';

import getPatternTree from '../../library/utilities/get-pattern-tree';
import getReadme from '../../library/utilities/get-readme';

function getResolvedRoutes(routes, options) {
	const {
		hostname,
		port,
		protocol,
		resolver
	} = options;

	const host = `${protocol}://${hostname}:${port}`;

	return Object.entries(routes)
		.filter(entry => {
			const [, configuration] = entry;
			return configuration.enabled;
		})
		.map(entry => {
			const [name, configuration] = entry;
			const {path} = configuration;
			return {
				name,
				path,
				uri: `${host}${resolver(name)}`
			};
		});
}

export default function indexRouteFactory(application) {
	return async function indexRoute() {
		const {
			server: {
				host: hostname,
				port
			},
			environment,
			routes: {
				enabled: routesConfiguration
			},
			pkg: {
				name: pkgName,
				version
			}
		} = application.configuration;

		const {
			patterncwd,
			cwd
		} = application.runtime;

		const {
			cache,
			router: {
				url: resolver
			}
		} = application;

		const basePath = resolve(patterncwd || cwd, 'patterns');

		// get resolved routes
		const routes = getResolvedRoutes(routesConfiguration, {
			hostname,
			port,
			protocol: 'http',
			resolver: resolver.bind(application.router)
		});

		// get patterns/readme.md
		const renderingReadme = getReadme('.', basePath, {
			cache
		});

		// obtain the pattern tree
		const gettingPatternTree = getPatternTree('.', basePath, {
			cache
		});

		this.type = 'json';
		this.body = Object.assign({}, {
			name: pkgName,
			version,
			environment,
			host: hostname,
			port,
			routes,
			meta: await gettingPatternTree,
			readme: await renderingReadme
		});
	};
}
