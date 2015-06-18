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