/* eslint-disable no-use-before-define, no-loop-func */
import merge from 'lodash.merge';
import pascalCase from 'pascal-case';
import {transform, buildExternalHelpers} from 'babel-core';
import chalk from 'chalk';
import template from './react-class.tmpl';
import dependencyTemplate from './require.tmpl';

export default function createReactCodeFactory(application) {
	const config = application.configuration.transforms.react || {};

	return async function createReactCode(file, demo, configuration) {
		try {
			const opts = merge({}, config.opts, configuration.opts);

			if (opts.globals && Object.keys(opts.globals).length > 0) {
				application.log.warn(
					`${chalk.yellow('[ ⚠  Deprecation ⚠ ]')}    "transforms.react.opts.globals" is deprecated and will be removed in version 1.0  ${chalk.grey('[transforms.react]')}`
				);
			}

			const code = convertCode(file, configuration.resolveDependencies, opts);
			const helpers = configuration.resolveDependencies ? buildExternalHelpers(undefined, 'var') : '';
			const requireBlock = configuration.resolveDependencies ? createRequireBlock(file.dependencies, configuration.resolveDependencies, opts) : '';
			const result = helpers + requireBlock + code;
			file.buffer = result;
			return file;
		} catch (error) {
			const patternName = file.pattern.id;
			application.log.error(`Unable to run react transform for ${patternName}/${file.name}.`);
			application.log.error(error.stack);
			throw error;
		}
	};
}

function convertCode(file, resolveDependencies, opts) {
	let source = file.buffer.toString('utf-8');
	// TODO: This is a weak criteria to check if we have to create a wrapper
	if (source.indexOf('extends React.Component') === -1 || source.indexOf('React.createClass') !== -1) {
		source = createWrappedRenderFunction(file, source, resolveDependencies, opts);
	} else if (resolveDependencies) {
		source = rewriteImportsToGlobalNames(file, source);
	}
	// XXX: This is required to satisfy babel but keep the option to define global vars
	const localOpts = merge({}, opts);
	delete localOpts.globals;
	return transform(source, merge({externalHelpers: resolveDependencies}, localOpts)).code;
}

function createWrappedRenderFunction(file, source, resolveDependencies, opts) {
	const dependencies = writeDependencyImports(file, resolveDependencies).join('\n');
	return renderCodeTemplate(source, dependencies, template, pascalCase(file.pattern.id), opts);
}

function renderCodeTemplate(source, dependencies, templateCode, className, opts) {
	return templateCode
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
const NAMED_ATTRIBUTE = `(?:${ATTRIBUTE_NAME}(?:${ATTRIBUTE_VALUE})?)`;
const SPREAD_ATTRIBUTE = '{\\.\\.\\.[^}]+}';
const ATTRIBUTE = `(?:${NAMED_ATTRIBUTE}|${SPREAD_ATTRIBUTE})`;
const ATTRIBUTES = `(?:\\s+${ATTRIBUTE})*`;
const TAG_END = '\\s*\\/?>';
const EXPR = new RegExp(`\n\s*(${TAG_START}${ATTRIBUTES}${TAG_END}[^]*)`, 'gi');

function writeDependencyImports(file, resolveDependencies) {
	const tagExpression = /<([A-Z][a-zA-Z0-9]+?)(?:\s|\/|>)/g;
	const source = file.buffer.toString('utf-8');
	const externalTagNames = [];
	let match;

	while((match = tagExpression.exec(source)) !== null) {
		externalTagNames.push(match[1]);
	}

	return externalTagNames.map(tagName => {
		const localName = tagName !== 'Pattern' ? tagName.toLowerCase() : tagName;
		const dependency = file.dependencies[localName];

		const name = resolveDependencies ?
			dependency.pattern.id :
			localName;
		return `import ${tagName} from '${name}';`;
	});
}

function matchFirstJsxExpressionAndWrapWithReturn(source) {
	return source.replace(EXPR, (match, jsxExpr) => {
		return 'return (\n' + jsxExpr/*.split('\n').map(line => indent + line).join('\n')*/ + '\n);\n';
	});
}

function rewriteImportsToGlobalNames(file, source) {
	return source.replace(/(import\s+(?:\* as\s)?[^\s]+\s+from\s+["'])([^"']+)(["'];)/g, (match, before, name, after) => {
		return `${before}${file.dependencies[name] || name}${after}`;
	});
}

function createRequireBlock(dependencies, externalHelpers, opts) {
	const source = Object.entries(dependencies)
		.map(entry => {
			const [, file] = entry;
			const body = convertCode(file, externalHelpers, opts);
			return `'${file.pattern.id}': function(module, exports, require) {${body}}`;
		});

	return dependencyTemplate.replace('$$localDependencies$$', source.join('\n,'));
}
