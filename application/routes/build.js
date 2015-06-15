'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = buildRouteFactory;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _url = require('url');

var _koaSend = require('koa-send');

var _koaSend2 = _interopRequireDefault(_koaSend);

function buildRouteFactory(application, configuration) {
	return regeneratorRuntime.mark(function buildRoute() {
		var root, parsed, path;
		return regeneratorRuntime.wrap(function buildRoute$(context$2$0) {
			while (1) switch (context$2$0.prev = context$2$0.next) {
				case 0:
					root = (0, _path.resolve)(application.runtime.cwd, 'build');
					parsed = (0, _url.parse)(this.req.url, true);
					path = this.params.path || parsed.query.path;

					this.assert(path, 404);
					context$2$0.next = 6;
					return (0, _koaSend2['default'])(this, path, { root: root });

				case 6:
					this.set('Content-Disposition', 'attachment; filename=' + (0, _path.basename)(path));

				case 7:
				case 'end':
					return context$2$0.stop();
			}
		}, buildRoute, this);
	});
}

module.exports = exports['default'];