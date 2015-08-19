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
					root = (0, _path.resolve)(application.runtime.patterncwd || application.runtime.cwd, 'build');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NvdXJjZS9hcHBsaWNhdGlvbi9yb3V0ZXMvYnVpbGQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7cUJBS3dCLGlCQUFpQjs7OztvQkFMVCxNQUFNOzttQkFDTixLQUFLOzt1QkFFcEIsVUFBVTs7OztBQUVaLFNBQVMsaUJBQWlCLENBQUUsV0FBVyxFQUFFLGFBQWEsRUFBRTtBQUN0RSxnQ0FBTyxTQUFXLFVBQVU7TUFDdkIsSUFBSSxFQUNKLE1BQU0sRUFDTixJQUFJOzs7O0FBRkosU0FBSSxHQUFHLG1CQUFRLFdBQVcsQ0FBQyxPQUFPLENBQUMsVUFBVSxJQUFJLFdBQVcsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQztBQUNsRixXQUFNLEdBQUcsZ0JBQVMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDO0FBQ3JDLFNBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUk7O0FBQ2hELFNBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDOztZQUNqQiwwQkFBSyxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUMsSUFBSSxFQUFKLElBQUksRUFBQyxDQUFDOzs7QUFDOUIsU0FBSSxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsNEJBQTBCLG9CQUFTLElBQUksQ0FBQyxDQUFHLENBQUM7Ozs7OztLQU56RCxVQUFVO0VBTzNCLEVBQUM7Q0FDRiIsImZpbGUiOiJidWlsZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7cmVzb2x2ZSwgYmFzZW5hbWV9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IHtwYXJzZSBhcyBwYXJzZVVybH0gZnJvbSAndXJsJztcblxuaW1wb3J0IHNlbmQgZnJvbSAna29hLXNlbmQnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBidWlsZFJvdXRlRmFjdG9yeSAoYXBwbGljYXRpb24sIGNvbmZpZ3VyYXRpb24pIHtcblx0cmV0dXJuIGZ1bmN0aW9uICogYnVpbGRSb3V0ZSAoKSB7XG5cdFx0bGV0IHJvb3QgPSByZXNvbHZlKGFwcGxpY2F0aW9uLnJ1bnRpbWUucGF0dGVybmN3ZCB8fCBhcHBsaWNhdGlvbi5ydW50aW1lLmN3ZCwgJ2J1aWxkJyk7XG5cdFx0bGV0IHBhcnNlZCA9IHBhcnNlVXJsKHRoaXMucmVxLnVybCwgdHJ1ZSk7XG5cdFx0bGV0IHBhdGggPSB0aGlzLnBhcmFtcy5wYXRoIHx8IHBhcnNlZC5xdWVyeS5wYXRoO1xuXHRcdHRoaXMuYXNzZXJ0KHBhdGgsIDQwNCk7XG5cdFx0eWllbGQgc2VuZCh0aGlzLCBwYXRoLCB7cm9vdH0pO1xuXHRcdHRoaXMuc2V0KCdDb250ZW50LURpc3Bvc2l0aW9uJywgYGF0dGFjaG1lbnQ7IGZpbGVuYW1lPSR7YmFzZW5hbWUocGF0aCl9YCk7XG5cdH07XG59XG4iXX0=