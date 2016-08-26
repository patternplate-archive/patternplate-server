import getPatternData from './get-pattern-data';

export default async function(application, id) {
	const data = await getPatternData(application, id, 'index');
	return {
		id: data.id,
		dependencies: data.dependencies,
		manifest: data.manifest,
		outFormats: data.outFormats
	};
}
