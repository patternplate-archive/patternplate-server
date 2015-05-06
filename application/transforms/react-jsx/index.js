'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = reactJSXTransformFactory;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactJsx = require('react-jsx');

var _reactJsx2 = _interopRequireDefault(_reactJsx);

var _pascalCase = require('pascal-case');

var _pascalCase2 = _interopRequireDefault(_pascalCase);

function reactJSXTransformFactory(application) {
	var config = application.configuration.transforms['react-jsx'] || {};

	return function reactJSXTransform(file, dependencies, demo) {
		var source, sourceTemplate, data, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step, result, demoTemplate, demoData, demoResult;

		return regeneratorRuntime.async(function reactJSXTransform$(context$2$0) {
			while (1) switch (context$2$0.prev = context$2$0.next) {
				case 0:
					source = file.buffer.toString('utf-8');
					sourceTemplate = _reactJsx2['default'].server(source, { 'raw': true });
					data = {
						'props': {}
					};
					_iteratorNormalCompletion = true;
					_didIteratorError = false;
					_iteratorError = undefined;
					context$2$0.prev = 6;

					_loop = function () {
						var dependencyName = _step.value;

						var dependencyBuffer = dependencies[dependencyName].source || dependencies[dependencyName].results.Markup.source;
						var dependencySource = dependencyBuffer.toString('utf-8');
						var dependecyTemplate = _reactJsx2['default'].server(dependencySource, { 'raw': true });

						data[_pascalCase2['default'](dependencyName)] = _react2['default'].createClass({
							'render': function renderDependencyTemplate() {
								return dependecyTemplate(this);
							}
						});
					};

					for (_iterator = Object.keys(dependencies)[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						_loop();
					}

					context$2$0.next = 15;
					break;

				case 11:
					context$2$0.prev = 11;
					context$2$0.t32 = context$2$0['catch'](6);
					_didIteratorError = true;
					_iteratorError = context$2$0.t32;

				case 15:
					context$2$0.prev = 15;
					context$2$0.prev = 16;

					if (!_iteratorNormalCompletion && _iterator['return']) {
						_iterator['return']();
					}

				case 18:
					context$2$0.prev = 18;

					if (!_didIteratorError) {
						context$2$0.next = 21;
						break;
					}

					throw _iteratorError;

				case 21:
					return context$2$0.finish(18);

				case 22:
					return context$2$0.finish(15);

				case 23:
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

				case 29:
				case 'end':
					return context$2$0.stop();
			}
		}, null, this, [[6, 11, 15, 23], [16,, 18, 22]]);
	};
}

module.exports = exports['default'];