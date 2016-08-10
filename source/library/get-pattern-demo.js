import url from 'url';
import querystring from 'querystring';
import getPatternRetriever from './utilities/get-pattern-retriever';
import layout from '../application/layouts';

function getRenderer(context) {
	return (result, query = {}) => {
		const template = {
			title: result.id
		};

		const sectionSeed = Object.values(context.formats)
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

				const built = context.router.url('pattern', {
					id: `${result.id}/index.${outFormat.extension}`
				}).replace('%2B', '');

				const parsed = url.parse(built);
				parsed.search = querystring.stringify(query);
				const uri = url.format(parsed);

				referenceSection[outFormat.type].push({uri});
				return referenceSection;
			}, sectionSeed);

		// Reset the script references if the transforms pass
		// explicit script dependencies
		if ((result.meta.scriptDependencies || []).length > 0) {
			templateReferenceData.script = result.meta.scriptDependencies
				.map(dependency => {
					const built = context.router.url(dependency.path, {
						id: dependency.id
					}).replace('%2B', '');

					const parsed = url.parse(built);
					parsed.search = querystring.stringify(query);
					const uri = url.format(parsed);
					return {uri};
				});
		}

		return layout({
			...template,
			content: templateContentData,
			reference: templateReferenceData
		});
	};
}

export default async function(application, ...rest) {
	const [pattern] = await getPatternRetriever(application)(...rest);
	const result = pattern.toJSON ? pattern.toJSON() : pattern;

	const render = getRenderer({
		router: application.router,
		formats: application.configuration.patterns.formats
	});

	return render(result);
}
