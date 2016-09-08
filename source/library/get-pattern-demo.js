import {merge} from 'lodash';

import getPatternRetriever from './utilities/get-pattern-retriever';
import layout from '../application/layouts';

export default getPatternDemo;

async function getPatternDemo(application, id, filters, environment) {
	const [pattern] = await getPatternRetriever(application)(id, filters, environment);

	if (!pattern) {
		return null;
	}

	const {formats} = application.configuration.patterns;
	const automount = selectAutoMount(application, pattern);
	const render = getRenderer(formats, automount);

	return render(pattern);
}

function selectAutoMount(a, p) {
	const transform = a.configuration.transforms['react-to-markup'] || {};
	const pattern = selectReactToMarkup(selectManifestOptions(p));
	const settings = merge({}, transform.opts, pattern.opts);
	return settings.automount || false;
}

function selectReactToMarkup(o) {
	return o['react-to-markup'] || {};
}

function selectManifestOptions(p) {
	return p.manifest.options || {};
}

function getRenderer(formats, component = false) {
	return result => {
		const template = {
			title: result.id
		};

		const sectionSeed = Object.values(formats)
			.reduce((seed, format) => {
				return {...seed, [format.name.toLowerCase()]: []};
			}, {});

		const templateContentData = Object.entries(result.results || {})
			.reduce((templateSection, templateSectionResult) => {
				const [sectionName, sectionResult] = templateSectionResult;
				const name = sectionName.toLowerCase();

				templateSection[name].push({
					content: sectionResult.buffer
				});

				return templateSection;
			}, sectionSeed);

		const templateReferenceData = result.outFormats
			.reduce((referenceSection, outFormat) => {
				if (!outFormat.type) {
					return referenceSection;
				}

				const uri = `./index.${outFormat.extension}`;

				referenceSection[outFormat.type].push({uri});
				return referenceSection;
			}, sectionSeed);

		// Reset the script references if we request a component
		if (component) {
			templateReferenceData.script = [{uri: './component.js'}];
		}

		return layout({
			...template,
			content: templateContentData,
			reference: templateReferenceData
		});
	};
}
