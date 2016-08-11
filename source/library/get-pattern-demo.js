// import url from 'url';
// import querystring from 'querystring';
import getPatternRetriever from './utilities/get-pattern-retriever';
import urlQuery from './utilities/url-query';
import layout from '../application/layouts';

function getRouteURI(router, route, params) {
	return decodeURIComponent(
		router.url(route, params)
	).replace(/\+/g, '');
}

function getRenderer(context) {
	const toRoute = (route, id) => getRouteURI(context.router, route, {id});
	const toPattern = id => toRoute('pattern', id);

	return result => {
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

				const formatted = urlQuery.format({
					pathname: `${result.id}`,
					query: {environment: context.environment}
				});

				const uri = toPattern(`${formatted}/index.${outFormat.extension}`);

				referenceSection[outFormat.type].push({uri});
				return referenceSection;
			}, sectionSeed);

		// Reset the script references if the transforms pass
		// explicit script dependencies
		if ((result.meta.scriptDependencies || []).length > 0) {
			templateReferenceData.script = result.meta.scriptDependencies
				.map(dependency => {
					return {uri: toRoute(dependency.path, dependency.id)};
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
	const [,, environment = 'index'] = rest;

	const render = getRenderer({
		router: application.router,
		formats: application.configuration.patterns.formats,
		environment
	});

	return render(result);
}
