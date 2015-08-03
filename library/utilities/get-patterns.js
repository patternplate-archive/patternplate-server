'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _qIoFs = require('q-io/fs');

var _qIoFs2 = _interopRequireDefault(_qIoFs);

function getPatterns(options) {
	var cache = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
	var fail = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];
	var isEnvironment = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

	var id, base, config, factory, transforms, filters, log, cacheprefix, path, search, paths, patternIDs, results, errors, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, patternID, readCacheID, cachedPatternPath, pattern, cachedRead;

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
				cacheprefix = options.cacheprefix;
				path = (0, _path.resolve)(base, id);
				search = (0, _path.resolve)(path, 'pattern.json');

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
					return isEnvironment ? true : !item.includes('@environments');
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
				context$1$0.prev = 28;
				_iterator = patternIDs[Symbol.iterator]();

			case 30:
				if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
					context$1$0.next = 98;
					break;
				}

				patternID = _step.value;
				readCacheID = ['pattern', 'read', cacheprefix, patternID].filter(function (item) {
					return item;
				}).join(':');

				log('Initializing pattern "' + patternID + '"');

				context$1$0.t0 = cache && cache.config['static'] && cache.staticRoot;

				if (!context$1$0.t0) {
					context$1$0.next = 39;
					break;
				}

				context$1$0.next = 38;
				return regeneratorRuntime.awrap(_qIoFs2['default'].exists(cache.staticRoot));

			case 38:
				context$1$0.t0 = context$1$0.sent;

			case 39:
				if (!context$1$0.t0) {
					context$1$0.next = 61;
					break;
				}

				cachedPatternPath = (0, _path.resolve)(cache.staticRoot, patternID, 'build.json');

				log('Searching ' + patternID + ' static cache at ' + cachedPatternPath);

				context$1$0.next = 44;
				return regeneratorRuntime.awrap(_qIoFs2['default'].exists(cachedPatternPath));

			case 44:
				if (!context$1$0.sent) {
					context$1$0.next = 60;
					break;
				}

				context$1$0.prev = 45;
				context$1$0.t1 = results;
				context$1$0.t2 = JSON;
				context$1$0.next = 50;
				return regeneratorRuntime.awrap(_qIoFs2['default'].read(cachedPatternPath));

			case 50:
				context$1$0.t3 = context$1$0.sent;
				context$1$0.t4 = context$1$0.t2.parse.call(context$1$0.t2, context$1$0.t3);
				context$1$0.t1.push.call(context$1$0.t1, context$1$0.t4);

				log('Static cache hit for ' + patternID + ' at ' + cachedPatternPath + '. Profit!');
				return context$1$0.abrupt('continue', 95);

			case 57:
				context$1$0.prev = 57;
				context$1$0.t5 = context$1$0['catch'](45);

				log('Error reading static cache version of ' + patternID + ' at ' + cachedPatternPath, context$1$0.t5);

			case 60:

				log('Static cache miss for ' + patternID + ' at ' + cachedPatternPath + ', falling back to dynamic version');

			case 61:
				context$1$0.next = 63;
				return regeneratorRuntime.awrap(factory(patternID, base, config, transforms, filters));

			case 63:
				pattern = context$1$0.sent;
				cachedRead = cache && cache.config.read ? cache.get(readCacheID, false) : null;

				if (cachedRead) {
					context$1$0.next = 79;
					break;
				}

				log('Reading pattern "' + patternID + '"');
				context$1$0.prev = 67;
				context$1$0.next = 70;
				return regeneratorRuntime.awrap(pattern.read());

			case 70:
				context$1$0.next = 77;
				break;

			case 72:
				context$1$0.prev = 72;
				context$1$0.t6 = context$1$0['catch'](67);

				if (!fail) {
					context$1$0.next = 76;
					break;
				}

				throw context$1$0.t6;

			case 76:
				errors.push(context$1$0.t6);

			case 77:
				context$1$0.next = 81;
				break;

			case 79:
				log('Using cached pattern read "' + readCacheID + '"');
				pattern = cachedRead;

			case 81:

				if (cache && cache.config.read) {
					cache.set(readCacheID, pattern.mtime, pattern);
				}

				context$1$0.prev = 82;
				context$1$0.t7 = results;
				context$1$0.next = 86;
				return regeneratorRuntime.awrap(pattern.transform(!isEnvironment, isEnvironment));

			case 86:
				context$1$0.t8 = context$1$0.sent;
				context$1$0.t7.push.call(context$1$0.t7, context$1$0.t8);
				context$1$0.next = 95;
				break;

			case 90:
				context$1$0.prev = 90;
				context$1$0.t9 = context$1$0['catch'](82);

				if (!fail) {
					context$1$0.next = 94;
					break;
				}

				throw context$1$0.t9;

			case 94:
				errors.push(context$1$0.t9);

			case 95:
				_iteratorNormalCompletion = true;
				context$1$0.next = 30;
				break;

			case 98:
				context$1$0.next = 104;
				break;

			case 100:
				context$1$0.prev = 100;
				context$1$0.t10 = context$1$0['catch'](28);
				_didIteratorError = true;
				_iteratorError = context$1$0.t10;

			case 104:
				context$1$0.prev = 104;
				context$1$0.prev = 105;

				if (!_iteratorNormalCompletion && _iterator['return']) {
					_iterator['return']();
				}

			case 107:
				context$1$0.prev = 107;

				if (!_didIteratorError) {
					context$1$0.next = 110;
					break;
				}

				throw _iteratorError;

			case 110:
				return context$1$0.finish(107);

			case 111:
				return context$1$0.finish(104);

			case 112:

				results = results.map(function (result) {
					return typeof result.toJSON === 'function' ? result.toJSON() : result;
				});

				return context$1$0.abrupt('return', results);

			case 114:
			case 'end':
				return context$1$0.stop();
		}
	}, null, this, [[28, 100, 104, 112], [45, 57], [67, 72], [82, 90], [105,, 107, 111]]);
}

exports['default'] = getPatterns;
module.exports = exports['default'];
// No patterns to find here

// We are dealing with a directory listing

// Get all pattern ids