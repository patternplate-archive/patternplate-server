import {join} from 'path';
import pascalCase from 'pascal-case';
import template from './react-class.tmpl';

export default function createReactCodeFactory(application) {
	const config = application.configuration.transforms['react'] || {};

	return async function createReactCode(file, demo) {
		let result = convertCode(file);
		if (demo) {
			demo.dependencies = {
				pattern: file
			};
			let demoResult = convertCode(demo);
			file.demoSource = demo.source;
			file.demoBuffer = new Buffer(demoResult, 'utf-8');
		}

		file.buffer = result;
		file.in = config.inFormat;
		file.out = config.outFormat;
		return file;
	}
}

function convertCode(file) {
	let source = file.buffer.toString('utf-8');
	if (source.indexOf('export default class') === -1 || source.indexOf('React.createClass') !== -1)	 {
		source = createWrappedRenderFunction(file, source);
	}
	let dependencies = convertDependencies(file);
	return fixDependencyImports(source, dependencies);
}

function createWrappedRenderFunction(file, source) {
	let patternJson = loadPatternJson(file.path);
	let dependencies = writeDependencyImports(file).join('\n');
	return renderCodeTemplate(source, dependencies, template, pascalCase(patternJson.name));
}

function writeDependencyImports(file) {
	let dependencies = [];
	for (let dependencyName of Object.keys(file.dependencies)) {
		dependencies.push(`import ${pascalCase(dependencyName)} from '${dependencyName}';`);
	}
	return dependencies;
}

function renderCodeTemplate(source, dependencies, template, className) {
	return template
		.replace('$$dependencies$$', dependencies)
		.replace('$$class-name$$', className)
		.replace('$$render-code$$', matchFirstJsxExpressionAndWrapWithReturn(source));
}

function matchFirstJsxExpressionAndWrapWithReturn(source) {
	return source
		.replace(/(<[a-z0-9]+(?:\s+[a-z0-9]+=["{][^"}]*?["}])*\s*\/?>[^]*)/gi,
			'return (\n$1\n);')
}

function loadPatternJson(path) {
	return require(
		join(
			path.substring(0,
				path.lastIndexOf('/')), 'pattern.json'));
}

function convertDependencies(file) {
	let dependencies = {};
	for (let dependencyName of Object.keys(file.dependencies)) {
		let dependencyFile = file.dependencies[dependencyName];
		dependencies[dependencyName] = convertCode(dependencyFile);
	}
	return dependencies;
}

function fixDependencyImports(source, dependencies) {
	// Replace import statements (but react) with a dumb module loader
	return source.replace(/^\s*import\s+(?:\*\s+as\s+)?([^R][^e][^a][^c][^t].*?)\s+from\s+['"]([-_a-zA-Z0-9]+)['"].*$/gm, (match, name, module) => {
		return `let ${name} = (() => {
			${dependencies[module].replace("import * as React from 'react';", '').replace('export default ', 'return ')}
		})();
		`;
	})
}

