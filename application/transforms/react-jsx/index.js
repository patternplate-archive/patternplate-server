'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = reactJSXTransformFactory;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _resolveDependencies = require('./resolve-dependencies');

var _resolveDependencies2 = _interopRequireDefault(_resolveDependencies);

function reactJSXTransformFactory(application) {
	var config = application.configuration.transforms['react-jsx'] || {};

	return function reactJSXTransform(file, demo) {
		var scope, result, _scope;

		return regeneratorRuntime.async(function reactJSXTransform$(context$2$0) {
			while (1) switch (context$2$0.prev = context$2$0.next) {
				case 0:
					scope = (0, _resolveDependencies2['default'])({ 'Pattern': file });
					context$2$0.prev = 1;
					result = _react2['default'].renderToString(_react2['default'].createElement(scope.Pattern));

					file.buffer = new Buffer(result, 'utf-8');
					file['in'] = config.inFormat;
					file.out = config.outFormat;
					context$2$0.next = 12;
					break;

				case 8:
					context$2$0.prev = 8;
					context$2$0.t31 = context$2$0['catch'](1);

					context$2$0.t31.file = file.path;
					throw context$2$0.t31;

				case 12:
					if (!demo) {
						context$2$0.next = 25;
						break;
					}

					demo.dependencies = Object.assign({ 'pattern': file }, file.dependencies);
					_scope = (0, _resolveDependencies2['default'])({ 'Demo': demo });
					context$2$0.prev = 15;
					result = _react2['default'].renderToString(_react2['default'].createElement(_scope.Demo));

					file.demoSource = demo.source;
					file.demoBuffer = new Buffer(result, 'utf-8');
					context$2$0.next = 25;
					break;

				case 21:
					context$2$0.prev = 21;
					context$2$0.t32 = context$2$0['catch'](15);

					context$2$0.t32.file = demo.path;
					throw context$2$0.t32;

				case 25:
					return context$2$0.abrupt('return', file);

				case 26:
				case 'end':
					return context$2$0.stop();
			}
		}, null, this, [[1, 8], [15, 21]]);
	};
}

module.exports = exports['default'];