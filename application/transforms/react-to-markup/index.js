'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = createReactRendererFactory;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _pascalCase = require('pascal-case');

var _pascalCase2 = _interopRequireDefault(_pascalCase);

var _babelCore = require('babel-core');

var _react = require('react');

var React = _interopRequireWildcard(_react);

function createReactRendererFactory(application) {
	var config = application.configuration.transforms['react-to-markup'] || {};

	return function renderReactComponent(file, demo) {
		return regeneratorRuntime.async(function renderReactComponent$(context$2$0) {
			while (1) switch (context$2$0.prev = context$2$0.next) {
				case 0:
					file.buffer = renderMarkup(file.buffer.toString('utf-8'), config.opts);
					if (file.demoBuffer) {
						file.demoBuffer = renderMarkup(file.demoBuffer.toString('utf-8'), config.opts);
					}
					file['in'] = config.inFormat;
					file.out = config.outFormat;
					return context$2$0.abrupt('return', file);

				case 5:
				case 'end':
					return context$2$0.stop();
			}
		}, null, this);
	};
}

function renderMarkup(source, opts) {
	// Convert to es5...
	var result = (0, _babelCore.transform)(source, opts);

	// ...then 'require' module...
	var moduleScope = { exports: {} };
	var fn = new Function('module', 'exports', 'require', result.code);
	fn(moduleScope, moduleScope.exports, require);

	// ...finally render markup
	return React.renderToStaticMarkup(React.createElement(moduleScope.exports));
}
module.exports = exports['default'];