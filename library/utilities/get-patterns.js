'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _qIoFs = require('q-io/fs');

var _qIoFs2 = _interopRequireDefault(_qIoFs);

function getPatterns(options) {
	var cache = arguments[1] === undefined ? null : arguments[1];

	var id, base, config, factory, transforms, filters, log, path, search, paths, patternIDs, results, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, patternID, readCacheID, pattern, cachedRead;

	return regeneratorRuntime.async(function getPatterns$(context$1$0) {
		while (1) switch (context$1$0.prev = context$1$0.next) {
			case 0:
				id = options.id;
				base = options.base;
				config = options.config;
				factory = options.factory;
				transforms = options.transforms;
				filters = options.filters;
				log = options.log;
				path = (0, _path.resolve)(base, id);
				search = (0, _path.resolve)(path, 'pattern.json');

				log = log || function () {};

				context$1$0.next = 12;
				return regeneratorRuntime.awrap(_qIoFs2['default'].exists(path));

			case 12:
				if (context$1$0.sent) {
					context$1$0.next = 14;
					break;
				}

				return context$1$0.abrupt('return', null);

			case 14:
				context$1$0.next = 16;
				return regeneratorRuntime.awrap(_qIoFs2['default'].exists(search));

			case 16:
				if (context$1$0.sent) {
					context$1$0.next = 18;
					break;
				}

				search = path;

			case 18:
				context$1$0.next = 20;
				return regeneratorRuntime.awrap(_qIoFs2['default'].listTree(search));

			case 20:
				paths = context$1$0.sent;
				patternIDs = paths.filter(function (item) {
					return (0, _path.basename)(item) === 'pattern.json';
				}).filter(function (item) {
					return !item.includes('@environments');
				}).map(function (item) {
					return (0, _path.dirname)(item);
				}).map(function (item) {
					return _qIoFs2['default'].relativeFromDirectory(options.base, item);
				});
				results = [];
				_iteratorNormalCompletion = true;
				_didIteratorError = false;
				_iteratorError = undefined;
				context$1$0.prev = 26;
				_iterator = patternIDs[Symbol.iterator]();

			case 28:
				if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
					context$1$0.next = 65;
					break;
				}

				patternID = _step.value;
				readCacheID = 'pattern:read:' + patternID;

				log('Initializing pattern "' + patternID + '"');

				context$1$0.next = 34;
				return regeneratorRuntime.awrap(factory(patternID, base, config, transforms, filters));

			case 34:
				pattern = context$1$0.sent;
				cachedRead = cache && cache.config.read ? cache.get(readCacheID, false) : null;

				if (cachedRead) {
					context$1$0.next = 48;
					break;
				}

				log('Reading pattern "' + patternID + '"');
				context$1$0.prev = 38;
				context$1$0.next = 41;
				return regeneratorRuntime.awrap(pattern.read());

			case 41:
				context$1$0.next = 46;
				break;

			case 43:
				context$1$0.prev = 43;
				context$1$0.t0 = context$1$0['catch'](38);
				throw context$1$0.t0;

			case 46:
				context$1$0.next = 50;
				break;

			case 48:
				log('Using cached pattern read "' + readCacheID + '"');
				pattern = cachedRead;

			case 50:

				if (cache && cache.config.read) {
					cache.set(readCacheID, pattern.mtime, pattern);
				}

				context$1$0.prev = 51;
				context$1$0.t1 = results;
				context$1$0.next = 55;
				return regeneratorRuntime.awrap(pattern.transform());

			case 55:
				context$1$0.t2 = context$1$0.sent;
				context$1$0.t1.push.call(context$1$0.t1, context$1$0.t2);
				context$1$0.next = 62;
				break;

			case 59:
				context$1$0.prev = 59;
				context$1$0.t3 = context$1$0['catch'](51);
				throw context$1$0.t3;

			case 62:
				_iteratorNormalCompletion = true;
				context$1$0.next = 28;
				break;

			case 65:
				context$1$0.next = 71;
				break;

			case 67:
				context$1$0.prev = 67;
				context$1$0.t4 = context$1$0['catch'](26);
				_didIteratorError = true;
				_iteratorError = context$1$0.t4;

			case 71:
				context$1$0.prev = 71;
				context$1$0.prev = 72;

				if (!_iteratorNormalCompletion && _iterator['return']) {
					_iterator['return']();
				}

			case 74:
				context$1$0.prev = 74;

				if (!_didIteratorError) {
					context$1$0.next = 77;
					break;
				}

				throw _iteratorError;

			case 77:
				return context$1$0.finish(74);

			case 78:
				return context$1$0.finish(71);

			case 79:

				results = results.map(function (result) {
					return typeof result.toJSON === 'function' ? result.toJSON() : result;
				});

				return context$1$0.abrupt('return', results);

			case 81:
			case 'end':
				return context$1$0.stop();
		}
	}, null, this, [[26, 67, 71, 79], [38, 43], [51, 59], [72,, 74, 78]]);
}

exports['default'] = getPatterns;
module.exports = exports['default'];
// No patterns to find here

// We are dealing with a directory listing

// Get all pattern ids