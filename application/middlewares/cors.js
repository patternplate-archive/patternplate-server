'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = startCorsMiddleware;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _koaCors = require('koa-cors');

var _koaCors2 = _interopRequireDefault(_koaCors);

function startCorsMiddleware() {
	return (0, _koaCors2['default'])();
}

module.exports = exports['default'];