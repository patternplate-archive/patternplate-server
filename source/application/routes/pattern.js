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

		if (type === 'text' && !extension) {
			type = 'html';
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
				filters.formats.push(type);
				break;
		}

		let patternResults;

		try {
			let patternConfig = {
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
		let result = patternResults.length === 1 ? patternResults[0] : patternResults;

		this.type = type;

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
				const template = {
					title: id
				};

				const sectionSeed = Object.values(application.configuration.patterns.formats)
					.reduce((seed, format) => {
						return {...seed, [format.name.toLowerCase()]: []};
					}, {});

				const templateContentData = Object.entries(result.results)
					.reduce((results, environmentEntry) => {
						const [environmentName, environmentContent] = environmentEntry;
						const environmentConfig = environmentContent.manifest || {};
						const wrapper = getWrapper(environmentConfig['conditional-comment']);
						const blueprint = {
							environment: environmentName,
							content: '',
							wrapper
						};

						const section = Object.entries(environmentContent)
							.reduce((templateSection, templateSectionResult) => {
								const [sectionName, sectionResult] = templateSectionResult;
								const name = sectionName.toLowerCase();

								templateSection[name].push({
									...blueprint,
									content: sectionResult.demoBuffer || sectionResult.buffer
								});

								return templateSection;
							}, sectionSeed);

						return {...results, ...section};
					}, sectionSeed);

				const templateReferenceData = Object.entries(result.results)
					.reduce((results, environmentEntry) => {
						const [environmentName, environmentContent] = environmentEntry;
						const environmentConfig = environmentContent.manifest || {};
						const wrapper = getWrapper(environmentConfig['conditional-comment']);
						const blueprint = {
							environment: environmentName,
							content: '',
							wrapper
						};

						const section = result.outFormats
							.reduce((referenceSection, outFormat) => {
								referenceSection[outFormat.type].push({
									...blueprint,
									uri: application.router.url('pattern', {
										id: `${this.params.id}/${environmentName}.${outFormat.extension}`
									}).replace('%2B', '') // workaround for stuff router appends
								});
								return referenceSection;
							}, sectionSeed);

						// Append content script for iframe resizing
						section.script.push({
							...blueprint,
							uri: application.router.url('script', {
								path: 'content.js'
							}).replace('%2B', '') // workaround for stuff router appends
						});

						return {...results, ...section};
					}, sectionSeed);

				this.body = layout({
					...template,
					content: templateContentData,
					reference: templateReferenceData
				});
				break;
		}
	};
}
