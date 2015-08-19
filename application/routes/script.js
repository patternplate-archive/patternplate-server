'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _path = require('path');

var _browserify = require('browserify');

var _browserify2 = _interopRequireDefault(_browserify);

var _qIoFs = require('q-io/fs');

var _qIoFs2 = _interopRequireDefault(_qIoFs);

function scriptRouteFactory(application) {
	var browserifyConfig = application.configuration.assets.browserify || {};

	return function scriptRoute() {
		var suffix, ext, filename, relative, path, bundler;
		return regeneratorRuntime.async(function scriptRoute$(context$2$0) {
			while (1) switch (context$2$0.prev = context$2$0.next) {
				case 0:
					suffix = application.runtime.env === 'development' ? '' : 'bundle';
					ext = (0, _path.extname)(this.params.path).slice(1);
					filename = [(0, _path.basename)(this.params.path, '.' + ext), suffix, ext].filter(function (fragment) {
						return fragment;
					}).join('.');
					relative = (0, _path.dirname)(this.params.path);
					path = (0, _path.resolve)(application.runtime.cwd, 'assets', 'script', relative, filename);
					context$2$0.next = 7;
					return regeneratorRuntime.awrap(_qIoFs2['default'].exists(path));

				case 7:
					if (context$2$0.sent) {
						context$2$0.next = 9;
						break;
					}

					return context$2$0.abrupt('return');

				case 9:

					this.type = 'js';

					try {
						if (application.runtime.env === 'development') {
							bundler = (0, _browserify2['default'])(path, browserifyConfig);

							this.body = bundler.bundle();
						} else {
							this.body = (0, _fs.createReadStream)(path);
						}
					} catch (err) {
						application.log.error(err);
						this['throw'](err, 500);
					}

				case 11:
				case 'end':
					return context$2$0.stop();
			}
		}, null, this);
	};
}

exports['default'] = scriptRouteFactory;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NvdXJjZS9hcHBsaWNhdGlvbi9yb3V0ZXMvc2NyaXB0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O2tCQUErQixJQUFJOztvQkFDZSxNQUFNOzswQkFFakMsWUFBWTs7OztxQkFDbkIsU0FBUzs7OztBQUV6QixTQUFTLGtCQUFrQixDQUFFLFdBQVcsRUFBRTtBQUN6QyxLQUFNLGdCQUFnQixHQUFHLFdBQVcsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLFVBQVUsSUFBSSxFQUFFLENBQUM7O0FBRTNFLFFBQU8sU0FBZSxXQUFXO01BQzVCLE1BQU0sRUFDTixHQUFHLEVBRUgsUUFBUSxFQUlSLFFBQVEsRUFDUixJQUFJLEVBVUYsT0FBTzs7OztBQWxCVCxXQUFNLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEtBQUssYUFBYSxHQUFHLEVBQUUsR0FBRyxRQUFRO0FBQ2xFLFFBQUcsR0FBRyxtQkFBUSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFFeEMsYUFBUSxHQUFHLENBQUMsb0JBQVMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLFFBQU0sR0FBRyxDQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUNqRSxNQUFNLENBQUMsVUFBQyxRQUFRO2FBQUssUUFBUTtNQUFBLENBQUMsQ0FDOUIsSUFBSSxDQUFDLEdBQUcsQ0FBQztBQUVQLGFBQVEsR0FBRyxtQkFBUSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztBQUNwQyxTQUFJLEdBQUcsbUJBQVEsV0FBVyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDOztxQ0FFeEUsbUJBQUksTUFBTSxDQUFDLElBQUksQ0FBQzs7Ozs7Ozs7Ozs7O0FBSTNCLFNBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVqQixTQUFJO0FBQ0gsVUFBSSxXQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsS0FBSyxhQUFhLEVBQUU7QUFDMUMsY0FBTyxHQUFHLDZCQUFXLElBQUksRUFBRSxnQkFBZ0IsQ0FBQzs7QUFDaEQsV0FBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7T0FDN0IsTUFBTTtBQUNOLFdBQUksQ0FBQyxJQUFJLEdBQUcsMEJBQWlCLElBQUksQ0FBQyxDQUFDO09BQ25DO01BQ0QsQ0FBQyxPQUFNLEdBQUcsRUFBRTtBQUNaLGlCQUFXLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMzQixVQUFJLFNBQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7TUFDckI7Ozs7Ozs7RUFDRCxDQUFDO0NBQ0Y7O3FCQUVjLGtCQUFrQiIsImZpbGUiOiJzY3JpcHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2NyZWF0ZVJlYWRTdHJlYW19IGZyb20gJ2ZzJztcbmltcG9ydCB7cmVzb2x2ZSwgYmFzZW5hbWUsIGV4dG5hbWUsIGRpcm5hbWV9IGZyb20gJ3BhdGgnO1xuXG5pbXBvcnQgYnJvd3NlcmlmeSBmcm9tICdicm93c2VyaWZ5JztcbmltcG9ydCBxaW8gZnJvbSAncS1pby9mcyc7XG5cbmZ1bmN0aW9uIHNjcmlwdFJvdXRlRmFjdG9yeSAoYXBwbGljYXRpb24pIHtcblx0Y29uc3QgYnJvd3NlcmlmeUNvbmZpZyA9IGFwcGxpY2F0aW9uLmNvbmZpZ3VyYXRpb24uYXNzZXRzLmJyb3dzZXJpZnkgfHwge307XG5cblx0cmV0dXJuIGFzeW5jIGZ1bmN0aW9uIHNjcmlwdFJvdXRlICgpIHtcblx0XHRsZXQgc3VmZml4ID0gYXBwbGljYXRpb24ucnVudGltZS5lbnYgPT09ICdkZXZlbG9wbWVudCcgPyAnJyA6ICdidW5kbGUnO1xuXHRcdGxldCBleHQgPSBleHRuYW1lKHRoaXMucGFyYW1zLnBhdGgpLnNsaWNlKDEpO1xuXG5cdFx0bGV0IGZpbGVuYW1lID0gW2Jhc2VuYW1lKHRoaXMucGFyYW1zLnBhdGgsIGAuJHtleHR9YCksIHN1ZmZpeCwgZXh0XVxuXHRcdFx0LmZpbHRlcigoZnJhZ21lbnQpID0+IGZyYWdtZW50KVxuXHRcdFx0LmpvaW4oJy4nKTtcblxuXHRcdGxldCByZWxhdGl2ZSA9IGRpcm5hbWUodGhpcy5wYXJhbXMucGF0aCk7XG5cdFx0bGV0IHBhdGggPSByZXNvbHZlKGFwcGxpY2F0aW9uLnJ1bnRpbWUuY3dkLCAnYXNzZXRzJywgJ3NjcmlwdCcsIHJlbGF0aXZlLCBmaWxlbmFtZSk7XG5cblx0XHRpZiAoIWF3YWl0IHFpby5leGlzdHMocGF0aCkpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLnR5cGUgPSAnanMnO1xuXG5cdFx0dHJ5IHtcblx0XHRcdGlmIChhcHBsaWNhdGlvbi5ydW50aW1lLmVudiA9PT0gJ2RldmVsb3BtZW50Jykge1xuXHRcdFx0XHRsZXQgYnVuZGxlciA9IGJyb3dzZXJpZnkocGF0aCwgYnJvd3NlcmlmeUNvbmZpZyk7XG5cdFx0XHRcdHRoaXMuYm9keSA9IGJ1bmRsZXIuYnVuZGxlKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLmJvZHkgPSBjcmVhdGVSZWFkU3RyZWFtKHBhdGgpO1xuXHRcdFx0fVxuXHRcdH0gY2F0Y2goZXJyKSB7XG5cdFx0XHRhcHBsaWNhdGlvbi5sb2cuZXJyb3IoZXJyKTtcblx0XHRcdHRoaXMudGhyb3coZXJyLCA1MDApO1xuXHRcdH1cblx0fTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgc2NyaXB0Um91dGVGYWN0b3J5O1xuIl19