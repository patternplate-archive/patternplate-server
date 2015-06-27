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

	var id, base, config, factory, transforms, filters, log, path, search, filterID, paths, patternIDs, results, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, patternID, readCacheID, pattern, cachedRead;

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
				filterID = JSON.stringify(filters);

				log = log || function () {};

				context$1$0.next = 13;
				return regeneratorRuntime.awrap(_qIoFs2['default'].exists(path));

			case 13:
				if (context$1$0.sent) {
					context$1$0.next = 15;
					break;
				}

				return context$1$0.abrupt('return', null);

			case 15:
				context$1$0.next = 17;
				return regeneratorRuntime.awrap(_qIoFs2['default'].exists(search));

			case 17:
				if (context$1$0.sent) {
					context$1$0.next = 19;
					break;
				}

				search = path;

			case 19:
				context$1$0.next = 21;
				return regeneratorRuntime.awrap(_qIoFs2['default'].listTree(search));

			case 21:
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
				context$1$0.prev = 27;
				_iterator = patternIDs[Symbol.iterator]();

			case 29:
				if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
					context$1$0.next = 65;
					break;
				}

				patternID = _step.value;
				readCacheID = 'pattern:read:' + patternID;

				log('Initializing pattern "' + patternID + '"');

				context$1$0.next = 35;
				return regeneratorRuntime.awrap(factory(patternID, base, config, transforms, filters));

			case 35:
				pattern = context$1$0.sent;
				cachedRead = cache && cache.config.read ? cache.get(readCacheID, false) : null;

				if (cachedRead) {
					context$1$0.next = 49;
					break;
				}

				log('Reading pattern "' + patternID + '"');
				context$1$0.prev = 39;
				context$1$0.next = 42;
				return regeneratorRuntime.awrap(pattern.read());

			case 42:
				context$1$0.next = 47;
				break;

			case 44:
				context$1$0.prev = 44;
				context$1$0.t0 = context$1$0['catch'](39);
				throw context$1$0.t0;

			case 47:
				context$1$0.next = 51;
				break;

			case 49:
				log('Using cached pattern read "' + readCacheID + '"');
				pattern = cachedRead;

			case 51:

				if (cache && cache.config.read) {
					cache.set(readCacheID, pattern.mtime, pattern);
				}

				context$1$0.prev = 52;
				context$1$0.next = 55;
				return regeneratorRuntime.awrap(pattern.transform());

			case 55:
				context$1$0.t1 = context$1$0.sent;
				results.push(context$1$0.t1);
				context$1$0.next = 62;
				break;

			case 59:
				context$1$0.prev = 59;
				context$1$0.t2 = context$1$0['catch'](52);
				throw context$1$0.t2;

			case 62:
				_iteratorNormalCompletion = true;
				context$1$0.next = 29;
				break;

			case 65:
				context$1$0.next = 71;
				break;

			case 67:
				context$1$0.prev = 67;
				context$1$0.t3 = context$1$0['catch'](27);
				_didIteratorError = true;
				_iteratorError = context$1$0.t3;

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
	}, null, this, [[27, 67, 71, 79], [39, 44], [52, 59], [72,, 74, 78]]);
}

exports['default'] = getPatterns;
module.exports = exports['default'];
// No patterns to find here

// We are dealing with a directory listing

// Get all pattern ids