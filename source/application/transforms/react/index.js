import {join} from 'path';
import pascalCase from 'pascal-case';
import merge from 'lodash.merge';
import {transform, buildExternalHelpers} from 'babel-core';
import template from './react-class.tmpl';
import dependencyTemplate from './require.tmpl';

export default function createReactCodeFactory(application) {
	const config = application.configuration.transforms['react'] || {};

	return async function createReactCode(file, demo) {
		let helpers = buildExternalHelpers(['interop-require-wildcard', 'interop-require-default'], 'var');
		let result = convertCode(file);
		let requireBlock = createRequireBlock(getDependencies(file));
		result = helpers + requireBlock + result;
console.log('result\n', result);
		if (demo) {
			demo.dependencies = {
				pattern: file
			};
			merge(demo.dependencies, file.dependencies);
			let demoResult = convertCode(demo);
			let requireBlock = createRequireBlock(getDependencies(demo));
			demoResult = helpers + requireBlock + demoResult;
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
	// TODO: This is a weak criteria to check if we have to create a wrapper
	if (source.indexOf('extends React.Component') === -1 || source.indexOf('React.createClass') !== -1)	 {
		source = createWrappedRenderFunction(file, source);
	}
	let opts = {
		whitelist: ['es6.modules'],
		externalHelpers: true,
		metadataUsedHelpers: true
	};
	return transform(source, opts).code;
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

const TAG_START = '<[a-z0-9]+';
const HTML_ATTRIBUTE = '\\s+[a-z0-9]+="[^"]*?"';
const REACT_ATTRIBUTE = '\\s+[a-z0-9]+={[^}]*?}';
const SPREAD_ATTRIBUTE = '\\s+\\{\\.\\.\\.[^}]+\\}';
const ATTRIBUTES = `(?:${HTML_ATTRIBUTE}|${REACT_ATTRIBUTE}|${SPREAD_ATTRIBUTE})*`;
const TAG_END = '\\s*\\/?>';
const EXPR = new RegExp(`(${TAG_START}${ATTRIBUTES}${TAG_END}[^]*)`, 'gi');

function matchFirstJsxExpressionAndWrapWithReturn(source) {
	return source
		.replace(/(<[a-z0-9]+(?:\s+[a-z0-9]+=["][^"]*?["]|\s+[a-z0-9]+=[{][^}]*?[}]|\s+\{\.\.\.[^}]+\})*\s*\/?>[^]*)/gi,
			'return (\n$1\n);')
}

function loadPatternJson(path) {
	return require(
		join(
			path.substring(0,
				path.lastIndexOf('/')), 'pattern.json'));
}

function convertDependencies(file) {
	return source.replace(EXPR, (match, jsxExpr) => {
		return 'return (\n' + jsxExpr/*.split('\n').map(line => indent + line).join('\n')*/ + '\n);\n'
	});
}

function getDependencies(file) {
	let dependencies = {};
	for (let dependencyName of Object.keys(file.dependencies)) {
		let dependencyFile = file.dependencies[dependencyName];
		dependencies[dependencyName] = dependencyFile;
		merge(dependencies, getDependencies(dependencyFile));
	}
	return dependencies;
}

function createRequireBlock(dependencies) {
	let source = [];
	for (let name of Object.keys(dependencies)) {
		source.push(`
			'${name}': function(module, exports, require) {
				${convertCode(dependencies[name]).split('\n').map(line => '\t\t\t' + line).join('\n')}
			}
		`);
	}
	return dependencyTemplate.replace('$$localDependencies$$', source.join('\n,'));
}

