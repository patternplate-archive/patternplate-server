'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _boilerplateServer = require('boilerplate-server');

var _boilerplateServer2 = _interopRequireDefault(_boilerplateServer);

function server(opts) {
	var options;
	return regeneratorRuntime.async(function server$(context$1$0) {
		while (1) switch (context$1$0.prev = context$1$0.next) {
			case 0:
				options = Object.assign({
					'name': 'patternplate-server'
				}, opts);
				context$1$0.next = 3;
				return _boilerplateServer2['default'](options);

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