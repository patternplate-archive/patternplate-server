import path from 'path';
import {getDocsTree} from './get-docs';
import getPackageJSON from 'find-and-read-package-json';
import {getPatternTree} from './utilities/get-pattern-tree';

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

	const base = path.resolve(patterncwd || cwd, 'patterns');
	const pkg = await getPackageJSON(patterncwd || cwd);

	return Object.assign({}, {
		name: pkg.name,
		version: pkg.version,
		appName,
		clientName,
		serverName,
		appVersion,
		clientVersion,
		serverVersion,
		environment,
		host,
		port,
		meta: await getPatternTree(base),
		docs: await getDocsTree(base)
	});
}
