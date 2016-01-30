/* eslint-disable no-use-before-define, no-loop-func */
import merge from 'lodash.merge';
import pascalCase from 'pascal-case';
import {kebabCase, find, uniq} from 'lodash';
import {transform, buildExternalHelpers} from 'babel-core';
import chalk from 'chalk';
import template from './react-class.tmpl';
import dependencyTemplate from './require.tmpl';

export default function createReactCodeFactory(application) {
	const config = application.configuration.transforms.react || {};
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
	const IMPORT = /(import\s+(?:\* as\s)?[^\s]+\s+from\s+["'])([^"']+)(["'];)/g;
	const REQUIRE = /require\(["'](.+?)["']\)/g;

	return async function createReactCode(file, demo, configuration) {
		try {
			const opts = merge({}, config.opts, configuration.opts);

			if (opts.globals && Object.keys(opts.globals).length > 0) {
				application.log.warn(
					`${chalk.yellow('[ ⚠  Deprecation ⚠ ]')}    "transforms.react.opts.globals" is deprecated and will be removed in version 1.0  ${chalk.grey('[transforms.react]')}`
				);
			}

			file.buffer = convertCode(file, configuration.resolveDependencies, opts);
			const helpers = configuration.resolveDependencies ? buildExternalHelpers(undefined, 'var') : '';
			const requireBlock = configuration.resolveDependencies ? createRequireBlock(file, configuration.resolveDependencies, opts) : '';
			file.buffer = [
				helpers,
				requireBlock,
				file.buffer
			].join('\n');
			//console.log(file.buffer);
			return file;
		} catch (error) {
			const patternName = file.pattern.id;
			application.log.error(`Unable to run react transform for ${patternName}/${file.name}.`);
			application.log.error(error.stack);
			throw error;
		}
	};

	function convertCode(file, resolveDependencies, opts) {
		let source = file.buffer.toString('utf-8');
		// TODO: This is a weak criteria to check if we have to create a wrapper
		// perhaps we could check for dangling jsx expressions on the last line instead?
		if (source.indexOf('extends React.Component') === -1 || source.indexOf('React.createClass') !== -1) {
			application.log.debug(`Detected plain jsx file ${file.pattern.id}/${file.name}`);
			source = createWrappedRenderFunction(file, source, resolveDependencies, opts);
		} else if (resolveDependencies) {
			application.log.debug(`Detected jsx file ${file.pattern.id}/${file.name} with React class`);
			source = rewriteImportsToGlobalNames(file, source);
		}
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

	function writeDependencyImports(file, resolveDependencies) {
		/**
		 * Instead of deprecating the simple jsx templates altogether
		 * we could require the user to provide an import block
		 * to do away with the implicit imports
		 **/
		const tagExpression = /<([A-Z][a-zA-Z0-9]+?)(?:\s|\/|>)/g;
		const source = file.buffer.toString('utf-8');
		const externalTagOccurences = [];
		let match;

		while((match = tagExpression.exec(source)) !== null) {
			externalTagOccurences.push(match[1]);
		}

		const externalTagNames = [...new Set(externalTagOccurences)];

		return externalTagNames.map(tagName => {
			const localName = tagName !== 'Pattern' ? kebabCase(tagName) : tagName;		const dependency = file.dependencies[localName];

			if (!dependency) {
				const err = new Error('Could not resolve dependency ${localName} introduced by implicit import for <${tagName}/> in ${file.path}. Only pattern imports are supported with plain jsx files');
				err.fileName = file.path;
				err.file = file.path;
			}

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
		return source.replace(IMPORT, (match, before, name, after) => {
			const dependencyFile = file.dependencies[name];
			// must be npm
			if (!dependencyFile) {
				// check if require.resolve finds a match
				try {
					require.resolve(name);
				} catch (err) {
					err.message = [err.message, `It was not found in ${file.pattern.id}'s pattern.json and could not be resolved from npm`].join(' ');
					err.file = file.path;
					err.fileName = file.path;
					throw err;
				}
				// all is well, leave it unchanged
				return match;
			} else {
				// rewrite to global pattern name
				const dependencyName = dependencyFile.pattern.id;
				return `${before}${dependencyName}${after}`;
			}
		});
	}

	function getSquashedDependencies(file) {
		return uniq(
				Object
					.values(file.dependencies)
					.reduce((dependencies, dependency) =>
						[...dependencies, dependency],
					[]),
				dependency => dependency.pattern.id
		);
	}

	function getRequiredDependencies(file, pool, externalHelpers, opts) {
		// search for actual imports
		const code = file.buffer;
		const rawImportNames = [];
		let match;

		while((match = REQUIRE.exec(code)) !== null) {
			rawImportNames.push(match[1]);
		}

		// get deduped list of required names
		const importNames = [...new Set(rawImportNames)];

		// return a hashmap of required globalNames => file
		return importNames
			.reduce((results, importName) => {
				// skip the import if it is already in the hashmap
				if (importName in results) {
					return results;
				}

				// find a matching dependency file
				const dependencyFile = find(pool, (fileItem) => {
					return fileItem.pattern.id === importName;
				});

				// must be npm if we did not find one
				if (!dependencyFile) {
					// check if require.resolve finds a match
					try {
						require.resolve(importName);
					} catch (err) {
						err.message = [err.message, `It was not found in ${file.pattern.id}'s pattern.json and could not be resolved from npm`].join(' ');
						err.file = file.path;
						err.pattern = file.pattern.id;
						err.fileName = file.path;
						throw err;
					}
					// nothing to do for npm dependencies
					return results;
				} else {
					// dealing with a local dependency, convert it
					dependencyFile.buffer = convertCode(dependencyFile, externalHelpers, opts);
					// add it to the hashmap, search for more required dependencies recursively
					return {
						...results,
						[importName]: dependencyFile.buffer,
						...getRequiredDependencies(dependencyFile, pool, externalHelpers, opts)
					};
				}
			}, {});
	}

	function createRequireBlock(file, externalHelpers, opts) {
		const dependencyFiles = getSquashedDependencies(file);
		const requiredDependencies = getRequiredDependencies(file, dependencyFiles, externalHelpers, opts);

		console.log(Object.keys(requiredDependencies));

		const results = Object.entries(requiredDependencies)
			.map(requiredEntry => {
				const [name, code] = requiredEntry;
				const formatted = code
					.split('\n')
					.map(line => `${'\t\t\t'}${line}`)
					.join('\n');
				return `'${name}': function(module, exports, require){\n${formatted}\n}`;
			})
			.join(',\n');

		return dependencyTemplate.replace('$$localDependencies$$', results);
	}
}

