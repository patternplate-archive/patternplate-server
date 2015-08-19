'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = markdownTransformFactory;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _marked = require('marked');

var _marked2 = _interopRequireDefault(_marked);

var _bluebird = require('bluebird');

function markdownTransformFactory(application) {
	var parser = (0, _bluebird.promisify)(_marked2['default']);
	var config = application.configuration.transforms.markdown || {};

	return function markdowTransform(file, demo, configuration) {
		return regeneratorRuntime.async(function markdowTransform$(context$2$0) {
			while (1) switch (context$2$0.prev = context$2$0.next) {
				case 0:
					context$2$0.prev = 0;
					context$2$0.t0 = Buffer;
					context$2$0.next = 4;
					return regeneratorRuntime.awrap(parser(file.buffer.toString('utf-8')));

				case 4:
					context$2$0.t1 = context$2$0.sent;
					file.buffer = new context$2$0.t0(context$2$0.t1, 'utf-8');
					context$2$0.next = 11;
					break;

				case 8:
					context$2$0.prev = 8;
					context$2$0.t2 = context$2$0['catch'](0);
					throw new Error(context$2$0.t2);

				case 11:

					file['in'] = config.inFormat;
					file.out = config.outFormat;

					return context$2$0.abrupt('return', file);

				case 14:
				case 'end':
					return context$2$0.stop();
			}
		}, null, this, [[0, 8]]);
	};
}

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NvdXJjZS9hcHBsaWNhdGlvbi90cmFuc2Zvcm1zL21hcmtkb3duL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O3FCQUd3Qix3QkFBd0I7Ozs7c0JBSDdCLFFBQVE7Ozs7d0JBQ0gsVUFBVTs7QUFFbkIsU0FBUyx3QkFBd0IsQ0FBRSxXQUFXLEVBQUU7QUFDOUQsS0FBTSxNQUFNLEdBQUcsNkNBQWlCLENBQUM7QUFDakMsS0FBTSxNQUFNLEdBQUcsV0FBVyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQzs7QUFFbkUsUUFBTyxTQUFlLGdCQUFnQixDQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsYUFBYTs7Ozs7c0JBRTdDLE1BQU07O3FDQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQzs7OztBQUFwRSxTQUFJLENBQUMsTUFBTSxzQ0FBMkQsT0FBTzs7Ozs7OztXQUV2RSxJQUFJLEtBQUssZ0JBQUs7Ozs7QUFHckIsU0FBSSxNQUFHLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztBQUMxQixTQUFJLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUM7O3lDQUVyQixJQUFJOzs7Ozs7O0VBQ1gsQ0FBQztDQUNGIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1hcmtlZCBmcm9tICdtYXJrZWQnO1xuaW1wb3J0IHtwcm9taXNpZnl9IGZyb20gJ2JsdWViaXJkJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWFya2Rvd25UcmFuc2Zvcm1GYWN0b3J5IChhcHBsaWNhdGlvbikge1xuXHRjb25zdCBwYXJzZXIgPSBwcm9taXNpZnkobWFya2VkKTtcblx0Y29uc3QgY29uZmlnID0gYXBwbGljYXRpb24uY29uZmlndXJhdGlvbi50cmFuc2Zvcm1zLm1hcmtkb3duIHx8IHt9O1xuXG5cdHJldHVybiBhc3luYyBmdW5jdGlvbiBtYXJrZG93VHJhbnNmb3JtIChmaWxlLCBkZW1vLCBjb25maWd1cmF0aW9uKSB7XG5cdFx0dHJ5IHtcblx0XHRcdGZpbGUuYnVmZmVyID0gbmV3IEJ1ZmZlcihhd2FpdCBwYXJzZXIoZmlsZS5idWZmZXIudG9TdHJpbmcoJ3V0Zi04JykpLCAndXRmLTgnKTtcblx0XHR9IGNhdGNoIChlcnIpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihlcnIpO1xuXHRcdH1cblxuXHRcdGZpbGUuaW4gPSBjb25maWcuaW5Gb3JtYXQ7XG5cdFx0ZmlsZS5vdXQgPSBjb25maWcub3V0Rm9ybWF0O1xuXG5cdFx0cmV0dXJuIGZpbGU7XG5cdH07XG59XG4iXX0=