'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _boilerplateServer = require('boilerplate-server');

var _boilerplateServer2 = _interopRequireDefault(_boilerplateServer);

var _findRoot = require('find-root');

var _findRoot2 = _interopRequireDefault(_findRoot);

function server(opts) {
	var options;
	return regeneratorRuntime.async(function server$(context$1$0) {
		while (1) switch (context$1$0.prev = context$1$0.next) {
			case 0:
				options = Object.assign({
					'name': 'patternplate-server',
					'cwd': (0, _findRoot2['default'])(__dirname)
				}, opts);
				context$1$0.next = 3;
				return regeneratorRuntime.awrap((0, _boilerplateServer2['default'])(options));

			case 3:
				return context$1$0.abrupt('return', context$1$0.sent);

			case 4:
			case 'end':
				return context$1$0.stop();
		}
	}, null, this);
}

exports['default'] = server;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NvdXJjZS9saWJyYXJ5L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O2lDQUF3QixvQkFBb0I7Ozs7d0JBQ3ZCLFdBQVc7Ozs7QUFFaEMsU0FBZSxNQUFNLENBQUUsSUFBSTtLQUN0QixPQUFPOzs7O0FBQVAsV0FBTyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDMUIsV0FBTSxFQUFFLHFCQUFxQjtBQUM3QixVQUFLLEVBQUUsMkJBQVMsU0FBUyxDQUFDO0tBQzFCLEVBQUUsSUFBSSxDQUFDOztvQ0FFSSxvQ0FBWSxPQUFPLENBQUM7Ozs7Ozs7Ozs7Q0FDakM7O3FCQUVjLE1BQU0iLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYm9pbGVycGxhdGUgZnJvbSAnYm9pbGVycGxhdGUtc2VydmVyJztcbmltcG9ydCBmaW5kUm9vdCBmcm9tICdmaW5kLXJvb3QnO1xuXG5hc3luYyBmdW5jdGlvbiBzZXJ2ZXIgKG9wdHMpIHtcblx0bGV0IG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHtcblx0XHRcdCduYW1lJzogJ3BhdHRlcm5wbGF0ZS1zZXJ2ZXInLFxuXHRcdFx0J2N3ZCc6IGZpbmRSb290KF9fZGlybmFtZSlcblx0XHR9LCBvcHRzKTtcblxuXHRyZXR1cm4gYXdhaXQgYm9pbGVycGxhdGUob3B0aW9ucyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHNlcnZlcjtcbiJdfQ==