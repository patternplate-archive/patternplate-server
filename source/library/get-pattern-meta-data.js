import path from 'path';
import {omit} from 'lodash';
import getPatternData from './get-pattern-data';

module.change_code = 1; // eslint-disable-line
export default getPatternMetaData;

async function getPatternMetaData(application, id) {
	const data = await getPatternData(application, id, 'index');
	const {transforms} = application.configuration;
	const {formats} = application.configuration.patterns;
	const {manifest} = data;

	return {
		id: data.id,
		base: data.base,
		dependencies: omit(data.dependencies, ['Pattern']),
		dependents: manifest.dependentPatterns,
		display: manifest.display,
		environments: manifest.demoEnvironments,
		files: selectPatternFiles(data, {transforms, formats}),
		manifest: {
			displayName: manifest.displayName,
			flag: manifest.flag,
			name: manifest.name,
			version: manifest.version,
			tags: manifest.tags
		}
	};
}

function selectPatternFiles(data, config) {
	const {files} = data;
	return data.outFormats.reduce((registry, outFormat) => {
		const {name, type, extension} = outFormat;

		const candidates = Object.entries(config.formats)
			.filter(entry => entry[1].name === outFormat.name)
			.map(entry => entry[0]);

		const demo = candidates.some(ext => `demo.${ext}` in data.files);

		const file = candidates
			.map(ext => files[`demo.${ext}`] || files[`index.${ext}`])
			.filter(Boolean)[0];

		if (!file) {
			return registry;
		}

		const concerns = demo ? ['demo', 'index'] : ['index'];

		const items = concerns.map(concern => {
			const id = [data.id, `${concern}${file.ext}`].join('/');

			return {
				concern,
				displayName: name,
				id,
				in: selectInFormat(data, file),
				out: outFormat.extension,
				path: path.relative(data.base, file.path),
				type,
				transforms: selectTransforms(data, file)
			};
		});

		return [...registry, ...items];
	}, []);
}

function selectTransforms(data, file) {
	const name = file.format;
	const format = data.config.patterns.formats[name] || {transforms: []};
	return format.transforms;
}

function selectInFormat(data, file) {
	const entry = selectTransforms(data, file)[0];
	const transform = data.config.transforms[entry] || {inFormat: file.format};
	return transform.inFormat;
}

function selectTransform(outFormat, config) {
	const format = config.formats[outFormat.extensons];
}
