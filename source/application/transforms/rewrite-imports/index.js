import {sep} from 'path';
import getPatternIdRegistry from '../../../library/resolve-utilities/get-pattern-id-registry';
import resolvePatternFilePath from '../../../library/resolve-utilities/resolve-pattern-file-path';
const detect = /(?:import(?:.+?)from\s+|require\()['"]([^'"]+)['"]\)?;/g;

export default function createRewriteImportsTransform (application) {
	return async function rewriteImportsTransform (file, demo, configuration) {
		const patternConfig = application.configuration.patterns;
		const resultName = patternConfig.formats[configuration.outFormat].name;
		const source = file.buffer.toString('utf-8');
		const registry = getPatternIdRegistry(file.dependencies);
		const resolve = configuration.resolve;

		const rewritten = source.replace(detect, function(match, name){
			let result = match;

			const resolvedPath = resolvePatternFilePath(
				registry, resolve,
				resultName, configuration.outFormat,
				name, file.pattern.path);

			if (resolvedPath) {
				result = result
					.replace(name, resolvedPath)
					.split(sep)
					.join('/');
			} else {
				require.resolve(name);
				file.meta.dependencies.push(name.split('/')[0]);
			}

			return result;
		});

		file.buffer = rewritten;
		return file;
	};
}
