import path from 'path';
import getPackageJSON from 'find-and-read-package-json';
import frontmatter from 'front-matter';
import globby from 'globby';
import exists from 'path-exists';
import remark from 'remark';
import find from 'unist-util-find';
import * as sander from 'sander';
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

	const files = await globby(`**/*.md`, {cwd});

	const items = await Promise.all(files.map(async file => {
		const read = f => sander.readFile(resolve(f));
		const contents = String(await read(file));
		const ast = remark().parse(contents);
		const first = find(ast, {type: 'heading', depth: 1});
		const manifest = frontmatter(contents).attributes;
		manifest.name = first ? first.children[0].value : '';

		return {
			contents,
			path: file,
			manifest
		};
	}));

	return treeFromPaths(items);
}

function treeFromPaths(files) {
	const tree = {
		id: 'root',
		children: []
	};

	files.forEach(file => {
		const parts = file.path.split('/');
		let level = tree;

		parts.forEach((part, i) => {
			const existing = level.children.find(c => c.name === part);

			if (existing) {
				level = existing;
				return;
			}

			const item = {
				name: part,
				manifest: file.manifest,
				contents: file.contents,
				id: parts.slice(0, i + 1).join('/'),
				path: parts.slice(0, i + 1),
				type: path.extname(part) ? 'doc' : 'directory'
			};

			if (item.type === 'directory') {
				item.children = [];
			}

			if (part.toLowerCase() === 'readme.md') {
				level.contents = file.contents;
				level.manifest = file.manifest;
			} else {
				level.children.push(item);
				level = item;
			}
		});
	});

	return tree;
}
