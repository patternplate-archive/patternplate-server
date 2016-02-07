import {
	extname,
	dirname,
	resolve
} from 'path';

import {
	find,
	merge,
} from 'lodash';

import getPatterns from '../../library/utilities/get-patterns';
import layout from '../layouts';

export default function patternRouteFactory (application, configuration) {
	function renderLayout(result) {
		const template = {
			title: result.id
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
					uri: application.router.url('pattern-result', {
						id: result.id,
						environment: 'index',
						extension: outFormat.extension,
						type: outFormat.type,
						basename: outFormat.baseName,
						status: 'transformed'
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

		return layout({
			...template,
			content: templateContentData,
			reference: templateReferenceData
		});
	}

	const patterns = application.configuration[configuration.options.key] || {};
	const transforms = application.configuration.transforms || {};
	const config = { patterns, transforms };

	return async function patternRoute () {
		// collect some base data
		const {
			id,
			environment,
			extension,
			basename,
			type,
			status
		} = this.params;

		const cwd = application.runtime.patterncwd || application.runtime.cwd;
		const basePath = resolve(cwd, config.patterns.path);
		const outFormats = [extension];

		// assemble config for getPatterns
		const patternConfig = {
			id,
			config,
			environment,
			filters: {
				outFormats: [extension],
				types: [type],
				baseNames: [basename]
			},
			base: basePath,
			factory: application.pattern.factory,
			transforms: application.transforms,
			log: application.log
		};

		// get patterns
		const patternResults = await getPatterns(patternConfig, application.cache);

		// returns empty array of no patterns were found
		if (patternResults.length === 0) {
			this.throw(404);
		}

		if (type === 'markup' && status === 'rendered') {
			// Dealing with an demo request
			this.type = extension;
			this.body = renderLayout(patternResults[0]);
		} else {
			// Dealing with a resources request
			const result = patternResults[0];

			// find a file with matching out format
			const file = find(Object.values(result.results), {
				out: extension,
				type
			});

			const fileToken = status === 'transformed' ?
				'buffer' :
				'source';

			// set mime type
			this.type = extension;
			this.body = file[fileToken];
		}
	};
}
