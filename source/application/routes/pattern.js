import {
	extname,
	dirname,
	resolve
} from 'path';

import {
	find,
	merge,
	omit
} from 'lodash';

import flatPick from '../../library/utilities/flat-pick';
import getPatterns from '../../library/utilities/get-patterns';
import layout from '../layouts';

function getRequestedFormats(extension, type) {
	// API request, do not filter based on type
	if (type === 'json') {
		return [];
	// Demo request, filter based on extension
	}
	return [extension];
}

export default function patternRouteFactory(application, configuration) {
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
					uri: application.router.url('pattern', {
						id: `${result.id}/index.${outFormat.extension}`
					}).replace('%2B', '') // workaround for stuff router appends
				});
				return referenceSection;
			}, sectionSeed);

		// Reset the script references if the transforms pass
		// explicit script dependencies
		if ((result.meta.scriptDependencies || []).length > 0) {
			templateReferenceData.script = result.meta.scriptDependencies
				.map(dependency => {
					return {
						uri: application.router.url(dependency.path, {
							id: dependency.id
						}).replace('%2B', '') // workaround for stuff router appends
					};
				});
		}

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
	const config = {patterns, transforms};

	return async function patternRoute() {
		// collect some base data
		const cwd = application.runtime.patterncwd || application.runtime.cwd;
		const basePath = resolve(cwd, config.patterns.path);
		const type = this.accepts('text', 'html', 'json');

		// infer json extension from accept-type
		const extension = type === 'json' ?
			'json' :
			extname(this.path).slice(1) || 'html'; // default to html

		// determine requested outFormats
		const outFormats = getRequestedFormats(extension, type);

		// get the requested id, cut filename
		const id = extname(this.path) ?
			dirname(this.params.id) :
			this.params.id;

		// assemble config for getPatterns
		const patternConfig = {
			id,
			config,
			filters: {
				outFormats
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

		const [patternResult] = patternResults;
		const results = typeof patternResult.toJSON === 'function' ?
			patternResult.toJSON() :
			patternResult;

		// The three cases should propably be split into
		// pattern/meta/
		// pattern/demo/
		// pattern/file/
		if (type === 'json') {
			// dealing with an API request
			// flatten if only one results

			// backwards compatibility for client
			// this can be removed when the client requests
			// pattern meta data seperately
			// this should become needless when
			// - pattern.read is fast for big patterns
			// - the client uses the new format
			const copyResult = omit(merge({}, results), ['results', 'dependencies']);
			copyResult.results = {index: results.results};
			copyResult.dependencies = flatPick(results, 'dependencies', ['id', 'manifest']);

			this.type = type;
			this.body = copyResult;
		} else if (type === 'html') {
			// Dealing with an demo request
			this.type = type;
			this.body = renderLayout(results);
		} else {
			// thind a file with matching out format
			const file = find(Object.values(results.results), {
				out: extension
			});

			// set mime type
			this.type = extension;
			this.body = file.demoBuffer || file.buffer;
		}
	};
}
