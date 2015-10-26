import {sep} from 'path';
import getPatternIdRegistry from '../../../library/resolve-utilities/get-pattern-id-registry';
import resolvePatternFilePath from '../../../library/resolve-utilities/resolve-pattern-file-path';

export default function createWriteIncludesTransform (application, transformConfiguration) {
	return async function rewriteIncludesTransform (file, demo, configuration) {
		const patternConfig = application.configuration.patterns;
		const resultName = patternConfig.formats[configuration.outFormat].name;

		const source = file.buffer.toString('utf-8');
		const registry = getPatternIdRegistry(file.dependencies);
		const resolve = configuration.resolve;

		const rewritten = source.replace(/@import(.+?)["|'](.*)["|'];/g, function(match, option, name){
			let result = match;

			const resolvedPath = resolvePatternFilePath(
					registry, resolve,
					resultName, configuration.outFormat,
					name, file.pattern.path)
				.split(sep)
				.join('/');

			const fromNPM = name.includes('npm://') || name.includes('node_modules/');

			if (!resolvedPath && !fromNPM) {
				throw new Error(`Could not resolve dependency ${name}. It is missing from manifest and does not appear to be a npm dependency`);
			} else if (!resolvedPath && fromNPM) {
				console.warn(`Ignored style dependency ${name} not found in dependency tree, should be included in package.json.`);
			} else {
				result = `@import${option}'${resolvedPath}';`;
			}

			return result;
		});

		file.buffer = rewritten;
		return file;
	};
}
