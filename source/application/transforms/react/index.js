/* eslint-disable no-use-before-define, no-loop-func */
import merge from 'lodash.merge';
import pascalCase from 'pascal-case';
import {kebabCase, find, uniq, omit} from 'lodash';
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

	const signature = chalk.grey('[transform:react]');
	const deprecation = chalk.yellow('[ ⚠  Deprecation ⚠ ]');

	return async function createReactCode(file, demo, configuration) {
		const opts = merge({}, config.opts, configuration.opts);

		if (opts.globals && Object.keys(opts.globals).length > 0) {
			application.log.warn(
				[
					deprecation,
					`${chalk.bold('"transforms.react.opts.globals"')} is deprecated`,
					'and will be removed in version 1.0. Use static properties on a common root component instead.',
					signature
				].join(' ')
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

		return file;
	};

	function convertCode(file, resolveDependencies, opts) {
		const source = file.buffer.toString('utf-8');
		const local = omit(merge({}, opts, {externalHelpers: resolveDependencies}), 'globals');

		// TODO: This is a weak criteria to check if we have to create a wrapper
		// perhaps we could check for dangling jsx expressions on the last line instead?
		const isPlain = !source.match(/class(.+?)extends(.+?){/g) && // does not contain an es6-class, could possibly checked via babel-ast
			source.indexOf('createClass') === -1; // does not contain an React.createClass call

		// wrap in a render function if plain jsx
		file.buffer = isPlain ? createWrappedRenderFunction(file, source, resolveDependencies, opts) : source;
		application.log.silly(`${file.pattern.id}:${file.name} is plain jsx ${signature}`);

		// rewrite imports to global names
		if (resolveDependencies) {
			file.buffer = rewriteImportsToGlobalNames(file, file.buffer);
		}

		file.buffer = transform(file.buffer, local).code;
		return file.buffer;
	}

	function createWrappedRenderFunction(file, source, resolveDependencies, opts) {
		const dependencies = writeDependencyImports(file).join('\n');
		return renderCodeTemplate(source, dependencies, template, pascalCase(file.pattern.manifest.name), opts);
	}

	function renderCodeTemplate(source, dependencies, templateCode, className, opts) {
		const injected = addImplicitGlobals(source, opts);
		const wrapped = matchFirstJsxExpressionAndWrapWithReturn(injected);
		const stripped = stripImports(wrapped);

		return templateCode
			.replace('$$dependencies$$', dependencies)
			.replace('$$class-name$$', className)
			.replace('$$render-code$$', stripped);
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

	function stripImports(source) {
		return source.replace(IMPORT, '');
	}

	function writeDependencyImports(file) {
		const tagExpression = /<([A-Z][a-zA-Z0-9]+?)(?:\s|\/|>)/g;
		const assignmentExpression = /([A-Z]\w+?)\s?=\s?(.+?)(?:,|;|\n)/g;
		const source = file.buffer.toString('utf-8');
		const externalTagOccurences = [];
		const importOccurences = [];
		const assignmentOccurences = [];

		// Find all non-DOM tags
		let match;
		while((match = tagExpression.exec(source)) !== null) {
			externalTagOccurences.push(match[1]);
		}

		// Find tags that have an assignment in scope
		// to filter them from implicit imports
		// This really should be done via an ast at some point
		let assignmentMatch;
		while((assignmentMatch = assignmentExpression.exec(source)) !== null) {
			assignmentOccurences.push({
				match: assignmentMatch[0],
				tagName: assignmentMatch[1],
				localName: assignmentMatch[2]
			});
		}

		// Find all explicit import statements
		let importMatch;
		while((importMatch = IMPORT.exec(source)) !== null) {
			importOccurences.push({
				match: importMatch[0],
				localName: importMatch[2],
				tagName: importMatch[1]
			});
		}

		// Dedupe matches
		const externalTagNames = [...new Set(externalTagOccurences)];
		const imports = uniq(importOccurences, 'localName');
		const assignments = uniq(assignmentOccurences, 'localName');

		// Extract explicit dependencies
		const explicitDependencies = imports
			.map(importStatement => {
				return importStatement.match;
			});

		// Process non-DOM tags
		const implicitDependencies = externalTagNames
			.map(tagName => {
				// Infer the localName in pattern.json
				const localName = tagName !== 'Pattern' ? kebabCase(tagName) : tagName;
				const tag = `<${tagName}/>`;
				const importStatement = `import ${tagName} from '${localName}';`;

				// Check if all uppercase
				// e.g. <STRONG>foo</STRONG>
				const isUglyDOMTag = tagName.toUpperCase() === tagName;

				// Check if there is a match in the explicit imports
				const hasExplicitImport = typeof find(imports, {localName}) !== 'undefined';

				// Check if there is a match in assignments
				const hasAssignment = typeof find(assignments, {tagName}) !== 'undefined';

				if (hasExplicitImport === false && hasAssignment === false && !isUglyDOMTag) {
					// implicit imports are deprecated
					application.log.warn(
						[
							deprecation,
							`Implicit import "${chalk.bold(localName)}" for ${chalk.bold(tag)}`,
							`detected in ${chalk.bold([file.pattern.id, file.name].join(':'))}.`,
							'Implicit imports are deprecated and should be replaced with explicit ones.',
							'Implicit imports will be removed in version 1.0.',
							`Place "${chalk.bold(importStatement)}" at the top of ${file.path}.`
						].join(' ')
					);
				} else {
					// skip
					return '';
				}

				// Lookup on the dependency.
				const dependency = file.dependencies[localName];

				// Implicit imports do support patterns only
				if (typeof dependency === 'undefined' && hasExplicitImport === false) {
					const err = new Error(
						[
							'Could not resolve dependency ${localName}',
							'introduced by implicit import for <${tagName}/>',
							'in ${file.path}. Only pattern imports',
							'are supported with plain jsx files'
						].join(' ')
					);
					err.fileName = file.path;
					err.file = file.path;
				}

				return importStatement;
			});

		// Search the other way round for implicit dependencies used as class
		// e.g. ReactClass.someStaticProp
		const implicitClassDependencies = Object.keys(file.dependencies)
			.reduce((results, localName) => {
				const className = pascalCase(localName);
				const importStatement = `import ${className} from '${localName}';`;

				// if the localName is included already, skip
				if (
						implicitDependencies.indexOf(importStatement) > -1 ||
						explicitDependencies.indexOf(importStatement) > -1
					) {
						return results;
					}

				const hasUsage = source.indexOf(`${className}.`) > -1 || source.indexOf(`(${className}`);

				if (hasUsage) {
					// implicit imports are deprecated
					application.log.warn(
						[
							deprecation,
							`Implicit import "${chalk.bold(localName)}" for class ${chalk.bold(className)}`,
							`detected in ${chalk.bold([file.pattern.id, file.name].join(':'))}.`,
							'Implicit imports are deprecated and should be replaced with explicit ones.',
							'Implicit imports will be removed in version 1.0.',
							`Place "${chalk.bold(importStatement)}" at the top of ${file.path}.`
						].join(' ')
					);
					return [...results, importStatement];
				} else {
					return results;
				}
			}, []);

		return [
			...implicitClassDependencies,
			...implicitDependencies,
			...explicitDependencies
		];
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

	function getRequiredDependencies(file, externalHelpers, opts) {
		// search for actual imports
		const code = file.buffer;
		const pool = getSquashedDependencies(file);
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
						err.message = [
							err.message,
							`It was not found in ${file.pattern.id}'s pattern.json`,
							'and could not be resolved from npm'
						].join(' ');
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
						...getRequiredDependencies(dependencyFile, externalHelpers, opts)
					};
				}
			}, {});
	}

	function createRequireBlock(file, externalHelpers, opts) {
		const requiredDependencies = getRequiredDependencies(file, externalHelpers, opts);

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

