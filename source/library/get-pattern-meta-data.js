import getPatternData from './get-pattern-data';

module.change_code = 1;
export default getPatternMetaData;

async function getPatternMetaData(application, id) {
	const data = await getPatternData(application, id, 'index');
	const {manifest} = data;

	return {
		id: data.id,
		base: data.base,
		dependencies: data.dependencies,
		dependents: manifest.dependencyPatterns,
		display: manifest.display,
		environments: manifest.demoEnvironments,
		files: selectPatternFiles(data),
		manifest: {
			displayName: manifest.displayName,
			flag: manifest.flag,
			name: manifest.name,
			version: manifest.version,
			tags: manifest.tags
		}
	};
}

function selectPatternFiles(data) {
	const {files} = data;

	return data.outFormats.reduce((registry, outFormat) => {
		const {name, type, extension} = outFormat;
		const demo = `demo.${extension}` in files;
		const index = `index.${extension}` in files;

		if (!(index || demo)) {
			return registry;
		}

		const concerns = demo ? ['demo', 'index'] : ['index'];

		const items = concerns.map(concern => {
			const id = [data.id, `${concern}.${extension}`].join('/');

			return {
				concern,
				displayName: name,
				id,
				type
			};
		});

		return [...registry, ...items];
	}, []);
}
