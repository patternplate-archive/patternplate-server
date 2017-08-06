import path from 'path';
import {getDocsTree} from './get-docs';
import getPackageJSON from 'find-and-read-package-json';
import {getPatternTree} from './utilities/get-pattern-tree';
import getReadme from './utilities/get-readme';

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
			}
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

	// get patterns/readme.md
	const renderingReadme = getReadme('.', basePath, {cache});

	// obtain the pattern tree
	const gettingPatternTree = getPatternTree(basePath);

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
		meta: await gettingPatternTree,
		docs: await getDocsTree(basePath),
		readme: await renderingReadme
	});
}
