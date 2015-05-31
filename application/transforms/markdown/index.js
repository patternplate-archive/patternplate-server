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

	return function markdowTransform(file) {
		return regeneratorRuntime.async(function markdowTransform$(context$2$0) {
			while (1) switch (context$2$0.prev = context$2$0.next) {
				case 0:
					context$2$0.prev = 0;
					context$2$0.next = 3;
					return parser(file.buffer.toString('utf-8'));

				case 3:
					context$2$0.t0 = context$2$0.sent;
					file.buffer = new Buffer(context$2$0.t0, 'utf-8');
					context$2$0.next = 10;
					break;

				case 7:
					context$2$0.prev = 7;
					context$2$0.t1 = context$2$0['catch'](0);
					throw new Error(context$2$0.t1);

				case 10:

					file['in'] = config.inFormat;
					file.out = config.outFormat;

					return context$2$0.abrupt('return', file);

				case 13:
				case 'end':
					return context$2$0.stop();
			}
		}, null, this, [[0, 7]]);
	};
}

module.exports = exports['default'];