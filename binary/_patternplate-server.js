#!/usr/bin/env node
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/*eslint-disable no-process-env */

var _path = require('path');

var _application = require('../application');

var _application2 = _interopRequireDefault(_application);

function start() {
	var options = arguments[0] === undefined ? {} : arguments[0];
	var augmented;
	return regeneratorRuntime.async(function start$(context$1$0) {
		while (1) switch (context$1$0.prev = context$1$0.next) {
			case 0:
				augmented = Object.assign(options, { 'api': options });
				context$1$0.next = 3;
				return _application2['default'](augmented);

			case 3:
				return context$1$0.abrupt('return', context$1$0.sent);

			case 4:
			case 'end':
				return context$1$0.stop();
		}
	}, null, this);
}

exports['default'] = start;
module.exports = exports['default'];