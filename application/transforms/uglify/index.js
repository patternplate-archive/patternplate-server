'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = uglifyTransformFactory;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _uglifyJs = require('uglify-js');

var _uglifyJs2 = _interopRequireDefault(_uglifyJs);

function uglifyTransformFactory(application) {
	var config = application.configuration.transforms.uglify || {};

	return function uglifyTransform(file, demo, configuration) {
		var ast, compressor;
		return regeneratorRuntime.async(function uglifyTransform$(context$2$0) {
			while (1) switch (context$2$0.prev = context$2$0.next) {
				case 0:
					context$2$0.prev = 0;
					ast = _uglifyJs2['default'].parse(file.buffer.toString('utf-8'));
					compressor = _uglifyJs2['default'].Compressor(config.opts);

					ast.figure_out_scope();
					ast = ast.transform(compressor);
					ast.figure_out_scope();
					ast.compute_char_frequency();
					ast.mangle_names();

					file.buffer = new Buffer(ast.print_to_string(), 'utf-8');
					context$2$0.next = 15;
					break;

				case 11:
					context$2$0.prev = 11;
					context$2$0.t0 = context$2$0['catch'](0);

					context$2$0.t0.file = file.path;
					throw context$2$0.t0;

				case 15:

					file['in'] = config.inFormat;
					file.out = config.outFormat;

					return context$2$0.abrupt('return', file);

				case 18:
				case 'end':
					return context$2$0.stop();
			}
		}, null, this, [[0, 11]]);
	};
}

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NvdXJjZS9hcHBsaWNhdGlvbi90cmFuc2Zvcm1zL3VnbGlmeS9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztxQkFFd0Isc0JBQXNCOzs7O3dCQUYzQixXQUFXOzs7O0FBRWYsU0FBUyxzQkFBc0IsQ0FBRSxXQUFXLEVBQUU7QUFDNUQsS0FBTSxNQUFNLEdBQUcsV0FBVyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQzs7QUFFakUsUUFBTyxTQUFlLGVBQWUsQ0FBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLGFBQWE7TUFFMUQsR0FBRyxFQUNILFVBQVU7Ozs7O0FBRFYsUUFBRyxHQUFHLHNCQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNqRCxlQUFVLEdBQUcsc0JBQU8sVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7O0FBRS9DLFFBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0FBQ3ZCLFFBQUcsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ2hDLFFBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0FBQ3ZCLFFBQUcsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO0FBQzdCLFFBQUcsQ0FBQyxZQUFZLEVBQUUsQ0FBQzs7QUFFbkIsU0FBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7Ozs7Ozs7O0FBRXpELG9CQUFJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDOzs7OztBQUl0QixTQUFJLE1BQUcsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO0FBQzFCLFNBQUksQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQzs7eUNBRXJCLElBQUk7Ozs7Ozs7RUFDWCxDQUFDO0NBQ0YiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdWdsaWZ5IGZyb20gJ3VnbGlmeS1qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHVnbGlmeVRyYW5zZm9ybUZhY3RvcnkgKGFwcGxpY2F0aW9uKSB7XG5cdGNvbnN0IGNvbmZpZyA9IGFwcGxpY2F0aW9uLmNvbmZpZ3VyYXRpb24udHJhbnNmb3Jtcy51Z2xpZnkgfHwge307XG5cblx0cmV0dXJuIGFzeW5jIGZ1bmN0aW9uIHVnbGlmeVRyYW5zZm9ybSAoZmlsZSwgZGVtbywgY29uZmlndXJhdGlvbikge1xuXHRcdHRyeSB7XG5cdFx0XHRsZXQgYXN0ID0gdWdsaWZ5LnBhcnNlKGZpbGUuYnVmZmVyLnRvU3RyaW5nKCd1dGYtOCcpKTtcblx0XHRcdGxldCBjb21wcmVzc29yID0gdWdsaWZ5LkNvbXByZXNzb3IoY29uZmlnLm9wdHMpO1xuXG5cdFx0XHRhc3QuZmlndXJlX291dF9zY29wZSgpO1xuXHRcdFx0YXN0ID0gYXN0LnRyYW5zZm9ybShjb21wcmVzc29yKTtcblx0XHRcdGFzdC5maWd1cmVfb3V0X3Njb3BlKCk7XG5cdFx0XHRhc3QuY29tcHV0ZV9jaGFyX2ZyZXF1ZW5jeSgpO1xuXHRcdFx0YXN0Lm1hbmdsZV9uYW1lcygpO1xuXG5cdFx0XHRmaWxlLmJ1ZmZlciA9IG5ldyBCdWZmZXIoYXN0LnByaW50X3RvX3N0cmluZygpLCAndXRmLTgnKTtcblx0XHR9IGNhdGNoIChlcnIpIHtcblx0XHRcdGVyci5maWxlID0gZmlsZS5wYXRoO1xuXHRcdFx0dGhyb3cgZXJyO1xuXHRcdH1cblxuXHRcdGZpbGUuaW4gPSBjb25maWcuaW5Gb3JtYXQ7XG5cdFx0ZmlsZS5vdXQgPSBjb25maWcub3V0Rm9ybWF0O1xuXG5cdFx0cmV0dXJuIGZpbGU7XG5cdH07XG59XG4iXX0=