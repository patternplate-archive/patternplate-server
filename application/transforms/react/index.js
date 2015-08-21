'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = createReactCodeFactory;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _pascalCase = require('pascal-case');

var _pascalCase2 = _interopRequireDefault(_pascalCase);

var _lodashMerge = require('lodash.merge');

var _lodashMerge2 = _interopRequireDefault(_lodashMerge);

var _babelCore = require('babel-core');

var _reactClassTmpl = require('./react-class.tmpl');

var _reactClassTmpl2 = _interopRequireDefault(_reactClassTmpl);

var _requireTmpl = require('./require.tmpl');

var _requireTmpl2 = _interopRequireDefault(_requireTmpl);

function createReactCodeFactory(application) {
	var config = application.configuration.transforms['react'] || {};

	return function createReactCode(file, demo) {
		var result, requireBlock, demoResult, _requireBlock;

		return regeneratorRuntime.async(function createReactCode$(context$2$0) {
			while (1) switch (context$2$0.prev = context$2$0.next) {
				case 0:
					result = convertCode(file, config.opts);
					requireBlock = createRequireBlock(getDependencies(file), config.opts);

					result = requireBlock + result;
					if (demo) {
						demo.dependencies = {
							pattern: file
						};
						(0, _lodashMerge2['default'])(demo.dependencies, file.dependencies);
						demoResult = convertCode(demo, config.opts);
						_requireBlock = createRequireBlock(getDependencies(demo), config.opts);

						demoResult = _requireBlock + demoResult;
						file.demoSource = demo.source;
						file.demoBuffer = new Buffer(demoResult, 'utf-8');
					}

					file.buffer = result;
					file['in'] = config.inFormat;
					file.out = config.outFormat;
					return context$2$0.abrupt('return', file);

				case 8:
				case 'end':
					return context$2$0.stop();
			}
		}, null, this);
	};
}

function convertCode(file, opts) {
	var source = file.buffer.toString('utf-8');
	// TODO: This is a weak criteria to check if we have to create a wrapper
	if (source.indexOf('extends React.Component') === -1 || source.indexOf('React.createClass') !== -1) {
		source = createWrappedRenderFunction(file, source);
	}
	var result = (0, _babelCore.transform)(source, opts).code;
	return result;
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

var TAG_START = '<[a-z0-9]+';
var HTML_ATTRIBUTE = '\\s+[a-z0-9]+="[^"]*?"';
var REACT_ATTRIBUTE = '\\s+[a-z0-9]+={[^}]*?}';
var SPREAD_ATTRIBUTE = '\\s+\\{\\.\\.\\.[^}]+\\}';
var ATTRIBUTES = '(?:' + HTML_ATTRIBUTE + '|' + REACT_ATTRIBUTE + '|' + SPREAD_ATTRIBUTE + ')*';
var TAG_END = '\\s*\\/?>';
var EXPR = new RegExp('(' + TAG_START + ATTRIBUTES + TAG_END + '[^]*)', 'gi');

function matchFirstJsxExpressionAndWrapWithReturn(source) {
	return source.replace(EXPR, function (match, jsxExpr) {
		return 'return (\n' + jsxExpr /*.split('\n').map(line => indent + line).join('\n')*/ + '\n);\n';
	});
}

function getDependencies(file) {
	var dependencies = {};
	var _iteratorNormalCompletion2 = true;
	var _didIteratorError2 = false;
	var _iteratorError2 = undefined;

	try {
		for (var _iterator2 = Object.keys(file.dependencies)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
			var dependencyName = _step2.value;

			var dependencyFile = file.dependencies[dependencyName];
			dependencies[dependencyName] = dependencyFile;
			(0, _lodashMerge2['default'])(dependencies, getDependencies(dependencyFile));
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

function createRequireBlock(dependencies, opts) {
	var source = [];
	var _iteratorNormalCompletion3 = true;
	var _didIteratorError3 = false;
	var _iteratorError3 = undefined;

	try {
		for (var _iterator3 = Object.keys(dependencies)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
			var _name = _step3.value;

			source.push('\n\t\t\t\'' + _name + '\': function(module, exports, require) {\n\t\t\t\t' + convertCode(dependencies[_name], opts) + '\n\t\t\t}\n\t\t');
		}
	} catch (err) {
		_didIteratorError3 = true;
		_iteratorError3 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion3 && _iterator3['return']) {
				_iterator3['return']();
			}
		} finally {
			if (_didIteratorError3) {
				throw _iteratorError3;
			}
		}
	}

	return _requireTmpl2['default'].replace('$$localDependencies$$', source.join('\n,'));
}
module.exports = exports['default'];