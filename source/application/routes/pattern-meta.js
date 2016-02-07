import {
	resolve
} from 'path';

import getPatterns from '../../library/utilities/get-patterns.js';

export default (application, configuration) => {
	return async function patternMetaRoute () {
		const {
			id,
			environment
		} = this.params;

		// Destruct(uring) party
		const {
			pattern: {
				factory
			},
			runtime: {
				patterncwd,
				cwd
			},
			configuration: {
				patterns,
				transforms
			},
			log,
			cache
		} = application;

		// resolve path to patterns folder
		const base = resolve(patterncwd || cwd, patterns.path);

		// Assemble config for getPatterns
		const config = {
			id,
			config: {
				patterns,
				transforms
			},
			tasks: ['read'],
			base,
			factory,
			log
		};

		const start = new Date();
		const patternResults = await getPatterns(config, cache);

		if (patternResults.length === 0) {
			this.throw(404);
		}

		// cut some slack
		const result = patternResults[0];
		result.dependencies = Object.keys(result.dependencies)
			.reduce((dependencies, dependencyName) => {
				const id = result.dependencies[dependencyName].id;
				const amend = dependencyName === 'Pattern' ?
					{} :
					{
						[dependencyName]: id
					}
				return {...dependencies, ...amend};
			}, {});
		delete result.isEnvironment;
		delete result.meta;
		delete result.results;

		// Tell the client where to look for formats
		result.outFormats = result.outFormats
			.reduce((formats, format) => {
				const amend = Object.keys(result.environments)
					.reduce((envFormats, envName) => {
						const envAmend = ['source', 'transformed']
							.map(status => {
								return {
									...format,
									environment: envName,
									status: status,
									uri: application.router.url('pattern-result', {
										environment,
										extension: format.extension,
										id: result.id,
										type: format.type,
										status,
										basename: format.baseName
									}).replace('%2B', '')
								};
							});
						return [...envFormats, ...envAmend];
					}, []);
				return [...formats, ...amend];
			}, []);

		this.body = result;
	};
};
