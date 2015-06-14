'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = buildRouteFactory;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _koaSend = require('koa-send');

var _koaSend2 = _interopRequireDefault(_koaSend);

function buildRouteFactory(application, configuration) {
	return regeneratorRuntime.mark(function buildRoute() {
		var result;
		return regeneratorRuntime.wrap(function buildRoute$(context$2$0) {
			while (1) switch (context$2$0.prev = context$2$0.next) {
				case 0:
					result = (0, _path.resolve)(application.runtime.cwd, 'build', 'build.zip');
					context$2$0.next = 3;
					return (0, _koaSend2['default'])(this, result);

				case 3:
				case 'end':
					return context$2$0.stop();
			}
		}, buildRoute, this);
	});
}

module.exports = exports['default'];