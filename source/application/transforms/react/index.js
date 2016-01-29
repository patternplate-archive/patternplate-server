import {join, dirname} from 'path';
import pascalCase from 'pascal-case';
import merge from 'lodash.merge';
import {transform, buildExternalHelpers} from 'babel-core';
import chalk from 'chalk';
import template from './react-class.tmpl';
import dependencyTemplate from './require.tmpl';

export default function createReactCodeFactory(application) {
	const config = application.configuration.transforms['react'] || {};

	return async function createReactCode(file, demo, configuration) {
		try {
			const opts = merge({}, config.opts, configuration.opts);

			let result = convertCode(file, configuration.resolveDependencies, opts);
			const helpers = configuration.resolveDependencies ? buildExternalHelpers(undefined, 'var') : '';
			const requireBlock = configuration.resolveDependencies ? createRequireBlock(getDependencies(file), configuration.resolveDependencies, opts) : '';

			result = helpers + requireBlock + result;

			if (opts.globals && Object.keys(opts.globals).length > 0) {
				application.log.warn(
					`${chalk.yellow('[ ⚠  Deprecation ⚠ ]')}    "transforms.react.opts.globals" is deprecated and will be removed in version 1.0  ${chalk.grey('[transforms.react]')}`
				);
			}

			if (demo) {
				demo.dependencies = {
					pattern: file
				};
				merge(demo.dependencies, file.dependencies);
				let demoResult = convertCode(demo, configuration.resolveDependencies, opts);
				const demoRequireBlock = configuration.resolveDependencies ?
					createRequireBlock(getDependencies(demo), configuration.resolveDependencies, opts) :
					'';

				demoResult = helpers + demoRequireBlock + demoResult;
				file.demoSource = demo.source;
				file.demoBuffer = new Buffer(demoResult, 'utf-8');
			}
			file.buffer = result;
			return file;
		} catch (error) {
			const patternName = loadPatternJson(file.path).name;
			application.log.error(`Unable to run react transform for ${patternName}/${file.name}.`);
			application.log.error(error.stack);
			throw error;
		}
	}
}

function convertCode(file, resolveDependencies, opts) {
	let source = file.buffer.toString('utf-8');
	// TODO: This is a weak criteria to check if we have to create a wrapper
	if (source.indexOf('extends React.Component') === -1 || source.indexOf('React.createClass') !== -1)	 {
		source = createWrappedRenderFunction(file, source, resolveDependencies, opts);
	} else if (resolveDependencies) {
		source = rewriteImportsToGlobalNames(file, source);
	}
	// XXX: This is required to satisfy babel but keep the option to define global vars
	let localOpts = merge({}, opts);
	delete localOpts.globals;
	return transform(source, merge({externalHelpers: resolveDependencies}, localOpts)).code;
}

function createWrappedRenderFunction(file, source, resolveDependencies, opts) {
	let patternJson = loadPatternJson(file.path);
	let dependencies = writeDependencyImports(file, resolveDependencies).join('\n');
	return renderCodeTemplate(source, dependencies, template, pascalCase(patternJson.name), opts);
}

function writeDependencyImports(file, resolveDependencies) {
	const patterns = loadPatternJson(file.path).patterns || {};
	const dependencies = [];

	for (const localName of Object.keys(file.dependencies)) {
		const name = resolveDependencies ? (patterns[localName] || localName) : localName;
		dependencies.push(`import ${pascalCase(localName)} from '${name}';`);
	}
	return dependencies;
}

function renderCodeTemplate(source, dependencies, template, className, opts) {
	return template
		.replace('$$dependencies$$', dependencies)
		.replace('$$class-name$$', className)
		.replace('$$render-code$$', matchFirstJsxExpressionAndWrapWithReturn(addImplicitGlobals(source, opts)));
}

function addImplicitGlobals(source, opts) {
	let vars = [];
	if (opts && opts.globals) {
		for (let key of Object.keys(opts.globals)) {
			vars.push(`this.${key} = ${JSON.stringify(opts.globals[key])};`);
		}
	}
	return vars.join('\n') + '\n' + source;
}

const TAG_START = '<[-_a-z0-9]+';
const ATTRIBUTE_NAME = '[-_a-z0-9]+';
const HTML_ATTRIBUTE_VALUE = `"[^"]*"`;
const REACT_ATTRIBUTE_VALUE = `{(?:{[^}]*}|[^}]*)}`;
const ATTRIBUTE_VALUE = `\\s*=\\s*(?:${HTML_ATTRIBUTE_VALUE}|${REACT_ATTRIBUTE_VALUE})`;
const NAMED_ATTRIBUTE= `(?:${ATTRIBUTE_NAME}(?:${ATTRIBUTE_VALUE})?)`;
const SPREAD_ATTRIBUTE = '{\\.\\.\\.[^}]+}';
const ATTRIBUTE = `(?:${NAMED_ATTRIBUTE}|${SPREAD_ATTRIBUTE})`;
const ATTRIBUTES = `(?:\\s+${ATTRIBUTE})*`;
const TAG_END = '\\s*\\/?>';
const EXPR = new RegExp(`\n\s*(${TAG_START}${ATTRIBUTES}${TAG_END}[^]*)`, 'gi');

function matchFirstJsxExpressionAndWrapWithReturn(source) {
	return source.replace(EXPR, (match, jsxExpr) => {
		return 'return (\n' + jsxExpr/*.split('\n').map(line => indent + line).join('\n')*/ + '\n);\n'
	});
}

function loadPatternJson(path) {
	return require(join(dirname(path), 'pattern.json'));
}

function rewriteImportsToGlobalNames(file, source) {
	let patterns = loadPatternJson(file.path).patterns || {};
	return source.replace(/(import\s+(?:\* as\s)?[^\s]+\s+from\s+["'])([^"']+)(["'];)/g, (match, before, name, after) => {
		return `${before}${patterns[name] || name}${after}`;
	});
}

function getDependencies(file) {
	let patterns = loadPatternJson(file.path).patterns || {};
	let dependencies = {};
	for (let name of Object.keys(file.dependencies)) {
		let globalName = patterns[name] || name;
		let dependencyFile = file.dependencies[name];
		dependencies[globalName] = dependencyFile;
		merge(dependencies, getDependencies(dependencyFile));
	}
	return dependencies;
}

function createRequireBlock(dependencies, externalHelpers, opts) {
	let source = [];
	for (let name of Object.keys(dependencies)) {
		source.push(`
			'${name}': function(module, exports, require) {
				${convertCode(dependencies[name], externalHelpers, opts).split('\n').map(line => '\t\t\t' + line).join('\n')}
			}
		`);
	}
	return dependencyTemplate.replace('$$localDependencies$$', source.join('\n,'));
}
