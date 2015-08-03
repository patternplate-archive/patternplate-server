'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _qIoFs = require('q-io/fs');

var _qIoFs2 = _interopRequireDefault(_qIoFs);

var defaultManifest = {
	'version': '0.1.0',
	'build': true,
	'display': true
};

function loadManifest(path, id) {
	var content, data;
	return regeneratorRuntime.async(function loadManifest$(context$1$0) {
		while (1) switch (context$1$0.prev = context$1$0.next) {
			case 0:
				context$1$0.next = 2;
				return regeneratorRuntime.awrap(_qIoFs2['default'].read((0, _path.join)(path, id, 'pattern.json')));

			case 2:
				content = context$1$0.sent;
				data = JSON.parse(content);
				return context$1$0.abrupt('return', Object.assign({}, defaultManifest, data, { id: id }));

			case 5:
			case 'end':
				return context$1$0.stop();
		}
	}, null, this);
}

function loadPatterns(path) {
	var paths, patternIDs, manifests;
	return regeneratorRuntime.async(function loadPatterns$(context$1$0) {
		while (1) switch (context$1$0.prev = context$1$0.next) {
			case 0:
				context$1$0.next = 2;
				return regeneratorRuntime.awrap(_qIoFs2['default'].listTree(path));

			case 2:
				paths = context$1$0.sent;
				patternIDs = paths.filter(function (item) {
					return (0, _path.basename)(item) === 'pattern.json';
				}).filter(function (item) {
					return !item.includes('@environments');
				}).map(function (item) {
					return (0, _path.dirname)(item);
				}).map(function (item) {
					return _qIoFs2['default'].relativeFromDirectory(path, item);
				});
				manifests = Promise.all(patternIDs.map(function (id) {
					return loadManifest(path, id);
				}));
				context$1$0.next = 7;
				return regeneratorRuntime.awrap(manifests);

			case 7:
				return context$1$0.abrupt('return', context$1$0.sent);

			case 8:
			case 'end':
				return context$1$0.stop();
		}
	}, null, this);
}

exports['default'] = loadPatterns;
module.exports = exports['default'];