import {relative, join, basename} from 'path';

export default function createWriteIncludesTransform (application, transformConfiguration) {
	return async function rewriteIncludesTransform (file, demo, configuration) {
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

		const rewritten = source.replace(/@import(.+?)["|'](.*)["|'];/g, function(match, option, name){
			const resolvedName = resolveName(name);
			const fromNPM = name.includes('npm://') || name.includes('node_modules/');

			if (!resolvedName && !fromNPM) {
				throw new Error(`Could not resolve dependency ${name}. It is missing from manifest and does not appear to be a npm dependency`);
			} else if (!resolvedName && fromNPM) {
				console.warn(`Ignored style dependency ${name} not found in dependency tree, should be included in package.json.`);
				return match;
			} else {
				return `@import${option}'${resolvedName}';`;
			}
		});

		file.buffer = rewritten;
		return file;
	};
}
