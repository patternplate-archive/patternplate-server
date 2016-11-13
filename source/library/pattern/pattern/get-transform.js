import {isObject} from 'lodash';
import applyTransforms from './apply-transforms';

export default getTransform;

const passthroughFormats = ['html', 'css', 'js', 'md'];

function getTransform(transformFunctions, config) {
	return async file => {
		const {patterns, transformConfigs} = config;
		const format = patterns.formats[file.format];
		const formatConfigured = isObject(format);
		const isPassThroughFormat = passthroughFormats.includes(file.format);

		if (!formatConfigured && isPassThroughFormat) {
			return Promise.resolve([file]);
		}

		if (!formatConfigured) {
			return Promise.resolve([]);
		}

		file.meta.devDependencies = getDevDependencies(file, format);

		return applyTransforms(file, format.transforms, {
			transformConfigs,
			transformFunctions,
			format
		});
	};
}

function getDevDependencies(file, format) {
	const formatDependencies = format.dependencies || [];
	return [...file.meta.devDependencies, ...formatDependencies];
}
