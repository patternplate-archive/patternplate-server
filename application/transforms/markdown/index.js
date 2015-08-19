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