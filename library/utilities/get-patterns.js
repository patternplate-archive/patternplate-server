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

	var id, base, config, factory, transforms, filters, log, path, search, filterID, paths, patternIDs, results, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, patternID, readCacheID, transformCacheID, pattern, cachedRead, cachedTransform;

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
					context$1$0.next = 80;
					break;
				}

				patternID = _step.value;
				readCacheID = 'pattern:read:' + patternID;
				transformCacheID = 'pattern:transformed:' + patternID;

				log('Initializing pattern "' + patternID + '"');

				context$1$0.prev = 34;
				context$1$0.next = 37;
				return regeneratorRuntime.awrap(factory(patternID, base, config, transforms, filters));

			case 37:
				pattern = context$1$0.sent;
				cachedRead = cache && cache.config.read ? cache.get(readCacheID, false) : null;

				if (cachedRead) {
					context$1$0.next = 51;
					break;
				}

				log('Reading pattern "' + patternID + '"');
				context$1$0.prev = 41;
				context$1$0.next = 44;
				return regeneratorRuntime.awrap(pattern.read());

			case 44:
				context$1$0.next = 49;
				break;

			case 46:
				context$1$0.prev = 46;
				context$1$0.t0 = context$1$0['catch'](41);
				throw context$1$0.t0;

			case 49:
				context$1$0.next = 53;
				break;

			case 51:
				log('Using cached pattern read "' + readCacheID + '"');
				pattern = cachedRead;

			case 53:

				if (cache && cache.config.read) {
					cache.set(readCacheID, pattern.mtime, pattern);
				}

				log('Trying to obtain transform "' + transformCacheID + '" from cache');
				cachedTransform = cache && cache.config.transform ? cache.get(transformCacheID, pattern.mtime, filters) : null;

				if (cachedTransform) {
					context$1$0.next = 68;
					break;
				}

				log('Transforming pattern "' + patternID + '"');
				context$1$0.prev = 58;
				context$1$0.next = 61;
				return regeneratorRuntime.awrap(pattern.transform());

			case 61:
				context$1$0.next = 66;
				break;

			case 63:
				context$1$0.prev = 63;
				context$1$0.t1 = context$1$0['catch'](58);
				throw context$1$0.t1;

			case 66:
				context$1$0.next = 70;
				break;

			case 68:
				log('Using cached pattern transform "' + transformCacheID + '"');
				pattern = cachedTransform;

			case 70:

				if (cache && cache.config.transform) {
					log('Caching pattern transform "' + transformCacheID + '"');
					cache.set(transformCacheID, pattern.mtime, pattern, filters);
				}

				results.push(pattern);
				context$1$0.next = 77;
				break;

			case 74:
				context$1$0.prev = 74;
				context$1$0.t2 = context$1$0['catch'](34);
				throw context$1$0.t2;

			case 77:
				_iteratorNormalCompletion = true;
				context$1$0.next = 29;
				break;

			case 80:
				context$1$0.next = 86;
				break;

			case 82:
				context$1$0.prev = 82;
				context$1$0.t3 = context$1$0['catch'](27);
				_didIteratorError = true;
				_iteratorError = context$1$0.t3;

			case 86:
				context$1$0.prev = 86;
				context$1$0.prev = 87;

				if (!_iteratorNormalCompletion && _iterator['return']) {
					_iterator['return']();
				}

			case 89:
				context$1$0.prev = 89;

				if (!_didIteratorError) {
					context$1$0.next = 92;
					break;
				}

				throw _iteratorError;

			case 92:
				return context$1$0.finish(89);

			case 93:
				return context$1$0.finish(86);

			case 94:

				results = results.map(function (result) {
					return typeof result.toJSON === 'function' ? result.toJSON() : result;
				});

				return context$1$0.abrupt('return', results);

			case 96:
			case 'end':
				return context$1$0.stop();
		}
	}, null, this, [[27, 82, 86, 94], [34, 74], [41, 46], [58, 63], [87,, 89, 93]]);
}

exports['default'] = getPatterns;
module.exports = exports['default'];
// No patterns to find here

// We are dealing with a directory listing

// Get all pattern ids