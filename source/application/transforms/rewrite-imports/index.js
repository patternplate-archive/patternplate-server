import {sep} from 'path';
import getPatternIdRegistry from '../../../library/resolve-utilities/get-pattern-id-registry';
import resolvePatternFilePath from '../../../library/resolve-utilities/resolve-pattern-file-path';

export default function createRewriteImportsTransform (application) {
	return async function rewriteImportsTransform (file, demo, configuration) {
		const patternConfig = application.configuration.patterns;
		const resultName = patternConfig.formats[configuration.outFormat].name;
		const source = file.buffer.toString('utf-8');
		const registry = getPatternIdRegistry(file.dependencies);
		const resolve = configuration.resolve;

		const rewritten = source.replace(/(?:import(?:.+?)from\s+|require\()['"]([^'"]+)['"]\)?;/g, function(match, name){
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
				console.warn(`Ignored script dependency "${name}" not found in dependencies of "${file.pattern.id}", probably should be included in package.json.`);
			}

			return result;
		});

		file.buffer = rewritten;
		return file;
	};
}
