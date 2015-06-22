'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = staticRouteFactory;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _url = require('url');

var _koaSend = require('koa-send');

var _koaSend2 = _interopRequireDefault(_koaSend);

function staticRouteFactory(application, configuration) {
	return regeneratorRuntime.mark(function staticRoute() {
		var root;
		return regeneratorRuntime.wrap(function staticRoute$(context$2$0) {
			while (1) switch (context$2$0.prev = context$2$0.next) {
				case 0:
					root = (0, _path.resolve)(application.runtime.patterncwd || application.runtime.cwd, 'static');

					this.assert(this.params.path, 404);
					context$2$0.next = 4;
					return (0, _koaSend2['default'])(this, this.params.path, { root: root });

				case 4:
				case 'end':
					return context$2$0.stop();
			}
		}, staticRoute, this);
	});
}

module.exports = exports['default'];