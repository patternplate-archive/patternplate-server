import {resolve, dirname, extname} from 'path';
import {merge} from 'lodash';

import getPatterns from '../../library/utilities/get-patterns';
import layout from '../layouts';

export default function patternRouteFactory (application, configuration) {
	let patterns = application.configuration[configuration.options.key] || {};
	let transforms = application.configuration.transforms || {};
	const config = { patterns, transforms };

	return async function patternRoute () {
		let cwd = application.runtime.patterncwd || application.runtime.cwd;
		let basePath = resolve(cwd, config.patterns.path);
		let id = this.params.id;

		let resultName;
		let type = this.accepts('text', 'json', 'html');
		let extension = extname(this.path);

		if (extension) {
			type = extension.slice(1);
		}

		if (extension) {
			let format = config.patterns.formats[type] || {};
			resultName = format.name || '';

			if (!resultName) {
				this.throw(404);
			}

			id = dirname(id);
		}

		if (type === 'text' && !extension) {
			type = 'html';
		}

		let filters = {
			'outFormats': []
		};

		switch(type) {
			case 'json':
				break;
			case 'css':
				filters.outFormats.push(type);
				break;
			case 'js':
				filters.outFormats.push(type);
				break;
			default: // html/text
				filters.outFormats.push(type);
				break;
		}

		let patternResults;

		try {
			const patternConfig = {
				id,
				config,
				filters,
				base: basePath,
				factory: application.pattern.factory,
				transforms: application.transforms,
				log: application.log
			};

			patternResults = await getPatterns(patternConfig, application.cache);
		} catch (err) {
			this.throw(500, err);
		}

		patternResults = patternResults || [];
		const result = patternResults.length === 1 ? patternResults[0] : patternResults;

		this.type = type;

		switch(type) {
			case 'json':
				// backwards compatibility for client
				// this can be removed when the client requests
				// pattern meta data seperately
				let copyResult;

				if (!Array.isArray(result)) {
					copyResult = merge({}, result, {results: {index: result.results}});
				} else {
					copyResult = patternResults.map(pattern => {
						return merge({}, pattern, {results: {index: pattern.results}});
					});
				}

				this.body = copyResult;
				break;
			case 'css':
			case 'js':
				const file = result.results[resultName];

				if (!file) {
					this.throw(404);
				}

				this.body = file.demoBuffer || file.buffer;
				break;
			default: // html/text
				const template = {
					title: id
				};

				const sectionSeed = Object.values(application.configuration.patterns.formats)
					.reduce((seed, format) => {
						return {...seed, [format.name.toLowerCase()]: []};
					}, {});

				const templateContentData = Object.entries(result.results || {})
					.reduce((templateSection, templateSectionResult) => {
							const [sectionName, sectionResult] = templateSectionResult;
							const name = sectionName.toLowerCase();

							templateSection[name].push({
								content: sectionResult.demoBuffer || sectionResult.buffer
							});

							return templateSection;
						}, sectionSeed);

				const templateReferenceData = result.outFormats
					.reduce((referenceSection, outFormat) => {
						if (!outFormat.type) {
							return referenceSection;
						}
						referenceSection[outFormat.type].push({
							uri: application.router.url('pattern', {
								id: `${this.params.id}/index.${outFormat.extension}`
							}).replace('%2B', '') // workaround for stuff router appends
						});
						return referenceSection;
					}, sectionSeed);

				// Append content script for iframe resizing
				// TODO: remove this when the new client arrives
				templateReferenceData.script.push({
					uri: application.router.url('script', {
						path: 'content.js'
					}).replace('%2B', '') // workaround for stuff router appends
				});

				this.body = layout({
					...template,
					content: templateContentData,
					reference: templateReferenceData
				});
				break;
		}
	};
}
