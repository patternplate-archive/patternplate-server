'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = reactJSXTransformFactory;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/*eslint-disable no-loop-func */

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactJsx = require('react-jsx');

var _reactJsx2 = _interopRequireDefault(_reactJsx);

var _pascalCase = require('pascal-case');

var _pascalCase2 = _interopRequireDefault(_pascalCase);

function resolveDependencies() {
	var dependencies = arguments[0] === undefined ? {} : arguments[0];

	var data = {
		'props': {}
	};

	function createReactClass(template, file) {
		return _react2['default'].createClass({
			'render': function renderDependencyTemplate() {
				return template(resolveDependencies(file.dependencies));
			}
		});
	}

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = Object.keys(dependencies)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var dependencyName = _step.value;

			var dependencyBuffer = dependencies[dependencyName].source || dependencies[dependencyName].results.Markup.source;
			var dependencySource = dependencyBuffer.toString('utf-8');
			var dependecyTemplate = _reactJsx2['default'].server(dependencySource, { 'raw': true });
			data[_pascalCase2['default'](dependencyName)] = createReactClass(dependecyTemplate, dependencies[dependencyName]);
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

	return data;
}

function reactJSXTransformFactory(application) {
	var config = application.configuration.transforms['react-jsx'] || {};

	return function reactJSXTransform(file, demo) {
		var source, sourceTemplate, data, result, demoTemplate, demoData, demoResult;
		return regeneratorRuntime.async(function reactJSXTransform$(context$2$0) {
			while (1) switch (context$2$0.prev = context$2$0.next) {
				case 0:
					source = file.buffer.toString('utf-8');
					sourceTemplate = _reactJsx2['default'].server(source, { 'raw': true });
					data = resolveDependencies(file.dependencies);
					result = sourceTemplate(data, { 'html': true });

					file.buffer = new Buffer(result, 'utf-8');
					file['in'] = config.inFormat;
					file.out = config.outFormat;

					if (demo) {
						demoTemplate = _reactJsx2['default'].server(demo.buffer.toString('utf-8'), { 'raw': true });
						demoData = Object.assign(data, {
							'Pattern': _react2['default'].createClass({
								'render': function renderSourceTemplate() {
									return sourceTemplate(data);
								}
							})
						});
						demoResult = demoTemplate(demoData, { 'html': true });

						file.demoSource = demo.source;
						file.demoBuffer = new Buffer(demoResult, 'utf-8');
					}

					return context$2$0.abrupt('return', file);

				case 9:
				case 'end':
					return context$2$0.stop();
			}
		}, null, this);
	};
}

module.exports = exports['default'];