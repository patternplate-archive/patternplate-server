import {resolve, dirname, basename, extname} from 'path';

import getPatterns from '../../library/utilities/get-patterns';
import getWrapper from '../../library/utilities/get-wrapper';

import layout from '../layouts';

export default function patternRouteFactory (application, configuration) {
	let patterns = application.configuration[configuration.options.key] || {};
	let transforms = application.configuration.transforms || {};
	const config = { patterns, transforms };

	return async function patternRoute () {
		let cwd = application.runtime.patterncwd || application.runtime.cwd;
		let basePath = resolve(cwd, config.patterns.path);
		let id = this.params.id;


		let patternResults;

		let base;
		let resultName;
		let type = this.accepts('text', 'json', 'html');
		let extension = extname(this.path);

		if (extension) {
			type = extension.slice(1);
		}

		if (extension) {
			base = basename(this.path, extension);
			let format = config.patterns.formats[type] || {};
			resultName = format.name || '';

			if (!resultName) {
				this.throw(404);
			}

			id = dirname(id);
		}

		let filters = {
			'environments': [],
			'formats': []
		};

		switch(type) {
			case 'json':
				filters.environments.push('index');
				break;
			case 'css':
				filters.environments.push(base);
				filters.formats.push(type);
				break;
			case 'js':
				filters.environments.push(base);
				filters.formats.push(type);
				break;
			default: // html/text
				filters.formats.push('html');
		}

		if (!patternResults) {
			try {
				let patternConfig = {
					id, config, filters,
					'base': basePath,
					'factory': application.pattern.factory,
					'transforms': application.transforms,
					'log': function(...args) {
						application.log.silly(...['[routes:pattern:getpattern]', ...args]);
					}
				};
				patternResults = await getPatterns(patternConfig, application.cache);
			} catch (err) {
				this.throw(500, err);
			}
		}

		let result = patternResults.length <= 1 ? patternResults[0] : patternResults;

		switch (type) {
			case 'json':
				break;
			default:
				if (Array.isArray(result)) {
					this.throw(404);
				}
				this.type = type;
		}

		switch(type) {
			case 'json':
				this.body = result;
				break;
			case 'css':
			case 'js':
				let environment = result.results[base];

				if (!environment) {
					this.throw(404);
				}

				let file = environment[resultName];

				if (!file) {
					this.throw(404);
				}

				this.body = file.demoBuffer || file.buffer;
				break;
			default: // html/text
				let hostName = application.configuration.server.host;
				let port = application.configuration.server.port;
				let host = `${hostName}:${port}`;

				let templateData = {
					'title': id,
					'style': [],
					'script': [],
					'markup': [],
					'route': (name, params) => {
						name = name || 'pattern';

						if (this.host !== host) {
							host = `${this.host}/api`;
						}

						return encodeURI(
							decodeURI(`${this.protocol}://${host}${application.router.url(name, params)}`)
							.replace(/\*|\%2B|\?/g, '')
						);
					}
				};

				for (let environmentName of Object.keys(result.results)) {
					let environment = result.results[environmentName];
					let envConfig = result.environments[environmentName].manifest || {};
					let wrapper = getWrapper(envConfig['conditional-comment']);
					let blueprint = {'environment': environmentName, 'content': '', wrapper};

					for (let resultType of Object.keys(environment)) {
						let result = environment[resultType];
						let templateKey = resultType.toLowerCase();
						let content = result.demoBuffer || result.buffer;
						let uri = `${this.params.id}/${environmentName}.${result.out}`;
						let templateSectionData = Object.assign({}, blueprint, {content, uri});

						templateData[templateKey] = Array.isArray(templateData[templateKey]) ?
							templateData[templateKey].concat([templateSectionData]) :
							[templateSectionData];
					}
				}

				this.body = layout(templateData);
				break;
		}
	};
}
