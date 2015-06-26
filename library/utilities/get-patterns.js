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
					context$1$0.next = 67;
					break;
				}

				patternID = _step.value;
				readCacheID = 'pattern:read:' + patternID;
				transformCacheID = 'pattern:transformed:' + patternID + '' + filterID;

				log('Initializing pattern "' + patternID + '"');

				context$1$0.prev = 34;
				context$1$0.next = 37;
				return regeneratorRuntime.awrap(factory(patternID, base, config, transforms, filters));

			case 37:
				pattern = context$1$0.sent;
				cachedRead = cache && cache.config.read ? cache.get(readCacheID, false) : null;

				if (cachedRead) {
					context$1$0.next = 45;
					break;
				}

				log('Reading pattern "' + patternID + '"');
				context$1$0.next = 43;
				return regeneratorRuntime.awrap(pattern.read());

			case 43:
				context$1$0.next = 47;
				break;

			case 45:
				log('Using cached pattern read "' + readCacheID + '"');
				pattern = cachedRead;

			case 47:

				if (cache && cache.config.read) {
					cache.set(readCacheID, pattern.mtime, pattern);
				}

				cachedTransform = cache && cache.config.transform ? cache.get(transformCacheID, pattern.mtime) : null;

				if (cachedTransform) {
					context$1$0.next = 55;
					break;
				}

				log('Transforming pattern "' + patternID + '"');
				context$1$0.next = 53;
				return regeneratorRuntime.awrap(pattern.transform());

			case 53:
				context$1$0.next = 57;
				break;

			case 55:
				log('Using cached pattern transform "' + transformCacheID + '"');
				pattern = cachedTransform;

			case 57:

				if (cache && cache.config.transform) {
					cache.set(transformCacheID, pattern.mtime, pattern);
				}

				results.push(pattern);
				context$1$0.next = 64;
				break;

			case 61:
				context$1$0.prev = 61;
				context$1$0.t0 = context$1$0['catch'](34);
				throw context$1$0.t0;

			case 64:
				_iteratorNormalCompletion = true;
				context$1$0.next = 29;
				break;

			case 67:
				context$1$0.next = 73;
				break;

			case 69:
				context$1$0.prev = 69;
				context$1$0.t1 = context$1$0['catch'](27);
				_didIteratorError = true;
				_iteratorError = context$1$0.t1;

			case 73:
				context$1$0.prev = 73;
				context$1$0.prev = 74;

				if (!_iteratorNormalCompletion && _iterator['return']) {
					_iterator['return']();
				}

			case 76:
				context$1$0.prev = 76;

				if (!_didIteratorError) {
					context$1$0.next = 79;
					break;
				}

				throw _iteratorError;

			case 79:
				return context$1$0.finish(76);

			case 80:
				return context$1$0.finish(73);

			case 81:

				results = results.map(function (result) {
					return typeof result.toJSON === 'function' ? result.toJSON() : result;
				});

				return context$1$0.abrupt('return', results);

			case 83:
			case 'end':
				return context$1$0.stop();
		}
	}, null, this, [[27, 69, 73, 81], [34, 61], [74,, 76, 80]]);
}

exports['default'] = getPatterns;
module.exports = exports['default'];
// No patterns to find here

// We are dealing with a directory listing

// Get all pattern ids