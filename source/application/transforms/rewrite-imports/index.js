import {relative, join, basename} from 'path';

export default function createRewriteImportsTransform (application) {
	return async function rewriteImportsTransform (file, demo, configuration) {
		const patternConfig = application.configuration.patterns;
		const resultName = patternConfig.formats[configuration.outFormat].name;

		const source = file.buffer.toString('utf-8');
		const resolvePath = configuration.resolve;

		const IDRegistry = Object.keys(file.dependencies).reduce((registry, dependencyName) => {
			const id = file.dependencies[dependencyName].pattern.id;
			const path = file.dependencies[dependencyName].pattern.path;
			return { ...registry, [dependencyName]: { id, path }};
		}, {});

		function resolveName(localName) {
			if (IDRegistry[localName]) {
				const {id, path} = IDRegistry[localName];
				const treePath = join(...resolvePath(id, resultName, configuration.outFormat));
				const relativePath = relative(file.pattern.path, path);
				return join(relativePath, basename(treePath));
			}
		}

		const rewritten = source.replace(/(?:import(?:.+?)from\s+|require\()['"]([^'"]+)['"]\)?;/g, function(match, name){
			const resolvedName = resolveName(name);
			if (resolvedName) {
				return match.replace(name, resolvedName);
			} else {
				require.resolve(name);
				console.warn(`Ignored script dependency "${name}" not found in dependencies of "${file.pattern.id}", probably should be included in package.json.`);
				return match;
			}
		});

		file.buffer = rewritten;
		return file;
	};
}
