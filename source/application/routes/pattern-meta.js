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

		this.body = result;
	};
};
