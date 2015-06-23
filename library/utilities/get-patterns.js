'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _qIoFs = require('q-io/fs');

var _qIoFs2 = _interopRequireDefault(_qIoFs);

function getPatterns(id, base, config, factory, transforms, filters) {
	var patterns, response, path, search, pattern, files, matches, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, file, _search, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, directory, patternID, mtime;

	return regeneratorRuntime.async(function getPatterns$(context$1$0) {
		while (1) switch (context$1$0.prev = context$1$0.next) {
			case 0:
				patterns = [];
				response = undefined;
				path = (0, _path.resolve)(base, id);
				search = (0, _path.resolve)(path, 'pattern.json');
				context$1$0.next = 6;
				return regeneratorRuntime.awrap(_qIoFs2['default'].exists(search));

			case 6:
				if (!context$1$0.sent) {
					context$1$0.next = 23;
					break;
				}

				context$1$0.prev = 7;
				context$1$0.next = 10;
				return regeneratorRuntime.awrap(factory(id, base, config, transforms, filters));

			case 10:
				pattern = context$1$0.sent;
				context$1$0.next = 13;
				return regeneratorRuntime.awrap(pattern.read());

			case 13:
				context$1$0.next = 15;
				return regeneratorRuntime.awrap(pattern.transform());

			case 15:
				patterns.push(pattern);
				context$1$0.next = 21;
				break;

			case 18:
				context$1$0.prev = 18;
				context$1$0.t0 = context$1$0['catch'](7);
				throw context$1$0.t0;

			case 21:
				context$1$0.next = 100;
				break;

			case 23:
				context$1$0.next = 25;
				return regeneratorRuntime.awrap(_qIoFs2['default'].isDirectory(path));

			case 25:
				context$1$0.t1 = context$1$0.sent;

				if (!(context$1$0.t1 === false)) {
					context$1$0.next = 28;
					break;
				}

				return context$1$0.abrupt('return', null);

			case 28:
				context$1$0.next = 30;
				return regeneratorRuntime.awrap(_qIoFs2['default'].list(path));

			case 30:
				files = context$1$0.sent;
				matches = [];
				_iteratorNormalCompletion = true;
				_didIteratorError = false;
				_iteratorError = undefined;
				context$1$0.prev = 35;
				_iterator = files[Symbol.iterator]();

			case 37:
				if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
					context$1$0.next = 47;
					break;
				}

				file = _step.value;
				_search = (0, _path.resolve)(path, file, 'pattern.json');
				context$1$0.next = 42;
				return regeneratorRuntime.awrap(_qIoFs2['default'].exists(_search));

			case 42:
				if (!context$1$0.sent) {
					context$1$0.next = 44;
					break;
				}

				matches.push(file);

			case 44:
				_iteratorNormalCompletion = true;
				context$1$0.next = 37;
				break;

			case 47:
				context$1$0.next = 53;
				break;

			case 49:
				context$1$0.prev = 49;
				context$1$0.t2 = context$1$0['catch'](35);
				_didIteratorError = true;
				_iteratorError = context$1$0.t2;

			case 53:
				context$1$0.prev = 53;
				context$1$0.prev = 54;

				if (!_iteratorNormalCompletion && _iterator['return']) {
					_iterator['return']();
				}

			case 56:
				context$1$0.prev = 56;

				if (!_didIteratorError) {
					context$1$0.next = 59;
					break;
				}

				throw _iteratorError;

			case 59:
				return context$1$0.finish(56);

			case 60:
				return context$1$0.finish(53);

			case 61:
				_iteratorNormalCompletion2 = true;
				_didIteratorError2 = false;
				_iteratorError2 = undefined;
				context$1$0.prev = 64;
				_iterator2 = matches[Symbol.iterator]();

			case 66:
				if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
					context$1$0.next = 86;
					break;
				}

				directory = _step2.value;
				patternID = (0, _path.join)(id, directory);
				context$1$0.prev = 69;
				context$1$0.next = 72;
				return regeneratorRuntime.awrap(factory(patternID, base, config, transforms, filters));

			case 72:
				pattern = context$1$0.sent;

				patterns.push(pattern);
				context$1$0.next = 76;
				return regeneratorRuntime.awrap(pattern.read());

			case 76:
				context$1$0.next = 78;
				return regeneratorRuntime.awrap(pattern.transform());

			case 78:
				context$1$0.next = 83;
				break;

			case 80:
				context$1$0.prev = 80;
				context$1$0.t3 = context$1$0['catch'](69);
				throw context$1$0.t3;

			case 83:
				_iteratorNormalCompletion2 = true;
				context$1$0.next = 66;
				break;

			case 86:
				context$1$0.next = 92;
				break;

			case 88:
				context$1$0.prev = 88;
				context$1$0.t4 = context$1$0['catch'](64);
				_didIteratorError2 = true;
				_iteratorError2 = context$1$0.t4;

			case 92:
				context$1$0.prev = 92;
				context$1$0.prev = 93;

				if (!_iteratorNormalCompletion2 && _iterator2['return']) {
					_iterator2['return']();
				}

			case 95:
				context$1$0.prev = 95;

				if (!_didIteratorError2) {
					context$1$0.next = 98;
					break;
				}

				throw _iteratorError2;

			case 98:
				return context$1$0.finish(95);

			case 99:
				return context$1$0.finish(92);

			case 100:
				mtime = patterns.map(function (item) {
					return item.getLastModified();
				}).sort(function (a, b) {
					return b - a;
				})[0] || new Date();

				patterns = patterns.map(function (resp) {
					return typeof resp.toJSON === 'function' ? resp.toJSON() : resp;
				});

				return context$1$0.abrupt('return', { mtime: mtime, 'results': patterns });

			case 103:
			case 'end':
				return context$1$0.stop();
		}
	}, null, this, [[7, 18], [35, 49, 53, 61], [54,, 56, 60], [64, 88, 92, 100], [69, 80], [93,, 95, 99]]);
}

exports['default'] = getPatterns;
module.exports = exports['default'];