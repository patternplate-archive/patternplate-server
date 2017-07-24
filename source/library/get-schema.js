import path from 'path';
import getPackageJSON from 'find-and-read-package-json';
import exists from 'path-exists';
import globby from 'globby';
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

const DEFAULT_SUB = {
	configuration: {
		pkg: {

		},
		server: {

		},
		routes: {
		},
		router: {
			url: null
		},
		runtime: {

		}
	}
};

export default async function getSchema(application, client = DEFAULT_SUB, server = DEFAULT_SUB) {
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

	const basePath = path.resolve(patterncwd || cwd, 'patterns');

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
		docs: await getDocs(basePath),
		readme: await renderingReadme
	});
}

async function getDocs(base) {
	const resolve = path.resolve.bind(null, base, '@docs');
	const cwd = resolve('.');

	if (!await exists(cwd)) {
		return [];
	}

	return treeFromPaths(await globby(`**/*.md`, {cwd}));
}

function treeFromPaths(files) {
	const tree = {
		id: 'root',
		children: []
	};

	files.forEach(file => {
		const parts = file.split('/');
		let level = tree;

		parts.forEach(part => {
			const existing = level.children.find(c => c.id === part);

			if (existing) {
				level = existing;
				return;
			}

			const item = {
				id: part,
				type: path.extname(part) ? 'doc' : 'directory'
			};

			if (item.type === 'directory') {
				item.children = [];
			}

			level.children.push(item);
			level = item;
		});
	});

	// const filesFragments = files.map(file => file.split('/'));
	return tree;
}
