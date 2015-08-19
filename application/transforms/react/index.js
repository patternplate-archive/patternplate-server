'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = createReactCodeFactory;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _pascalCase = require('pascal-case');

var _pascalCase2 = _interopRequireDefault(_pascalCase);

var _reactClassTmpl = require('./react-class.tmpl');

var _reactClassTmpl2 = _interopRequireDefault(_reactClassTmpl);

function createReactCodeFactory(application) {
	var config = application.configuration.transforms['react'] || {};

	return function createReactCode(file, demo) {
		var result, demoResult;
		return regeneratorRuntime.async(function createReactCode$(context$2$0) {
			while (1) switch (context$2$0.prev = context$2$0.next) {
				case 0:
					result = convertCode(file);

					if (demo) {
						demo.dependencies = {
							pattern: file
						};
						demoResult = convertCode(demo);

						file.demoSource = demo.source;
						file.demoBuffer = new Buffer(demoResult, 'utf-8');
					}

					file.buffer = result;
					file['in'] = config.inFormat;
					file.out = config.outFormat;
					return context$2$0.abrupt('return', file);

				case 6:
				case 'end':
					return context$2$0.stop();
			}
		}, null, this);
	};
}

function convertCode(file) {
	var source = file.buffer.toString('utf-8');
	if (source.indexOf('export default class') === -1 || source.indexOf('React.createClass') !== -1) {
		source = createWrappedRenderFunction(file, source);
	}
	var dependencies = convertDependencies(file);
	return fixDependencyImports(source, dependencies);
}

function createWrappedRenderFunction(file, source) {
	var patternJson = loadPatternJson(file.path);
	var dependencies = writeDependencyImports(file).join('\n');
	return renderCodeTemplate(source, dependencies, _reactClassTmpl2['default'], (0, _pascalCase2['default'])(patternJson.name));
}

function loadPatternJson(path) {
	return require((0, _path.join)(path.substring(0, path.lastIndexOf('/')), 'pattern.json'));
}

function writeDependencyImports(file) {
	var dependencies = [];
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = Object.keys(file.dependencies)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var dependencyName = _step.value;

			dependencies.push('import ' + (0, _pascalCase2['default'])(dependencyName) + ' from \'' + dependencyName + '\';');
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator['return']) {
				_iterator['return']();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	return dependencies;
}

function renderCodeTemplate(source, dependencies, template, className) {
	return template.replace('$$dependencies$$', dependencies).replace('$$class-name$$', className).replace('$$render-code$$', matchFirstJsxExpressionAndWrapWithReturn(source));
}

function matchFirstJsxExpressionAndWrapWithReturn(source) {
	return source.replace(/(<[a-z0-9]+(?:\s+[a-z0-9]+=["{][^"}]*?["}])*\s*\/?>[^]*)/gi, 'return (\n$1\n);');
}

function convertDependencies(file) {
	var dependencies = {};
	var _iteratorNormalCompletion2 = true;
	var _didIteratorError2 = false;
	var _iteratorError2 = undefined;

	try {
		for (var _iterator2 = Object.keys(file.dependencies)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
			var dependencyName = _step2.value;

			var dependencyFile = file.dependencies[dependencyName];
			dependencies[dependencyName] = convertCode(dependencyFile);
		}
	} catch (err) {
		_didIteratorError2 = true;
		_iteratorError2 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion2 && _iterator2['return']) {
				_iterator2['return']();
			}
		} finally {
			if (_didIteratorError2) {
				throw _iteratorError2;
			}
		}
	}

	return dependencies;
}

function fixDependencyImports(source, dependencies) {
	// Replace import statements (but react) with a dumb module loader
	return source.replace(/^\s*import\s+(?:\*\s+as\s+)?([^R][^e][^a][^c][^t].*?)\s+from\s+['"]([-_a-zA-Z0-9]+)['"].*$/gm, function (match, name, module) {
		return 'let ' + name + ' = (() => {\n\t\t\t' + dependencies[module].replace("import * as React from 'react';", '').replace('export default ', 'return ') + '\n\t\t})();\n\t\t';
	});
}
module.exports = exports['default'];