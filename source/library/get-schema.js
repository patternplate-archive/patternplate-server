import {resolve} from 'path';
import getPackageJSON from 'find-and-read-package-json';
import getPatternTree from './utilities/get-pattern-tree';
import getReadme from './utilities/get-readme';

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

export default async function getSchema(application, client, server) {
	const {
		configuration: {
			pkg: {
				name: appName,
				version: appVersion
			}
		}
	} = application;

	const {
		cache,
		configuration: {
			environment,
			pkg: {
				name: serverName,
				version: serverVersion
			},
			server: {
				host,
				port
			},
			routes: {
				enabled: routesConfiguration
			}
		},
		router: {
			url: resolver
		},
		runtime: {
			patterncwd,
			cwd
		}
	} = server;

	const {
		configuration: {
			pkg: {
				name: clientName,
				version: clientVersion
			}
		}
	} = client;

	const basePath = resolve(patterncwd || cwd, 'patterns');

	const {
		name,
		version
	} = await getPackageJSON(patterncwd || cwd);

	// get resolved routes
	const routes = getResolvedRoutes(routesConfiguration, {
		hostname: host,
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

	return Object.assign({}, {
		name,
		version,
		appName,
		clientName,
		serverName,
		appVersion,
		clientVersion,
		serverVersion,
		environment,
		host,
		port,
		routes,
		meta: await gettingPatternTree,
		readme: await renderingReadme
	});
}
