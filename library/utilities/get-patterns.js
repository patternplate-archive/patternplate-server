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
	var fail = arguments[2] === undefined ? true : arguments[2];

	var id, base, config, factory, transforms, filters, log, path, search, paths, patternIDs, results, errors, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, patternID, readCacheID, pattern, cachedRead;

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
				errors = [];
				_iteratorNormalCompletion = true;
				_didIteratorError = false;
				_iteratorError = undefined;
				context$1$0.prev = 27;
				_iterator = patternIDs[Symbol.iterator]();

			case 29:
				if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
					context$1$0.next = 70;
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
					context$1$0.next = 51;
					break;
				}

				log('Reading pattern "' + patternID + '"');
				context$1$0.prev = 39;
				context$1$0.next = 42;
				return regeneratorRuntime.awrap(pattern.read());

			case 42:
				context$1$0.next = 49;
				break;

			case 44:
				context$1$0.prev = 44;
				context$1$0.t0 = context$1$0['catch'](39);

				if (!fail) {
					context$1$0.next = 48;
					break;
				}

				throw context$1$0.t0;

			case 48:
				errors.push(context$1$0.t0);

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

				context$1$0.prev = 54;
				context$1$0.t1 = results;
				context$1$0.next = 58;
				return regeneratorRuntime.awrap(pattern.transform());

			case 58:
				context$1$0.t2 = context$1$0.sent;
				context$1$0.t1.push.call(context$1$0.t1, context$1$0.t2);
				context$1$0.next = 67;
				break;

			case 62:
				context$1$0.prev = 62;
				context$1$0.t3 = context$1$0['catch'](54);

				if (!fail) {
					context$1$0.next = 66;
					break;
				}

				throw context$1$0.t3;

			case 66:
				errors.push(context$1$0.t3);

			case 67:
				_iteratorNormalCompletion = true;
				context$1$0.next = 29;
				break;

			case 70:
				context$1$0.next = 76;
				break;

			case 72:
				context$1$0.prev = 72;
				context$1$0.t4 = context$1$0['catch'](27);
				_didIteratorError = true;
				_iteratorError = context$1$0.t4;

			case 76:
				context$1$0.prev = 76;
				context$1$0.prev = 77;

				if (!_iteratorNormalCompletion && _iterator['return']) {
					_iterator['return']();
				}

			case 79:
				context$1$0.prev = 79;

				if (!_didIteratorError) {
					context$1$0.next = 82;
					break;
				}

				throw _iteratorError;

			case 82:
				return context$1$0.finish(79);

			case 83:
				return context$1$0.finish(76);

			case 84:

				results = results.map(function (result) {
					return typeof result.toJSON === 'function' ? result.toJSON() : result;
				});

				return context$1$0.abrupt('return', results);

			case 86:
			case 'end':
				return context$1$0.stop();
		}
	}, null, this, [[27, 72, 76, 84], [39, 44], [54, 62], [77,, 79, 83]]);
}

exports['default'] = getPatterns;
module.exports = exports['default'];
// No patterns to find here

// We are dealing with a directory listing

// Get all pattern ids