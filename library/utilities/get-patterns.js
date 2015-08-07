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

	var id, base, config, factory, transforms, filters, log, path, search, paths, patternIDs, results, errors, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, patternID, readCacheID, cachedPatternPath, pattern, cachedRead;

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

				// No patterns to find here
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
				context$1$0.prev = 27;
				_iterator = patternIDs[Symbol.iterator]();

			case 29:
				if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
					context$1$0.next = 97;
					break;
				}

				patternID = _step.value;
				readCacheID = 'pattern:read:' + patternID;

				log('Initializing pattern "' + patternID + '"');

				context$1$0.t0 = cache && cache.config['static'] && cache.staticRoot;

				if (!context$1$0.t0) {
					context$1$0.next = 38;
					break;
				}

				context$1$0.next = 37;
				return regeneratorRuntime.awrap(_qIoFs2['default'].exists(cache.staticRoot));

			case 37:
				context$1$0.t0 = context$1$0.sent;

			case 38:
				if (!context$1$0.t0) {
					context$1$0.next = 60;
					break;
				}

				cachedPatternPath = (0, _path.resolve)(cache.staticRoot, patternID, 'build.json');

				log('Searching ' + patternID + ' static cache at ' + cachedPatternPath);

				context$1$0.next = 43;
				return regeneratorRuntime.awrap(_qIoFs2['default'].exists(cachedPatternPath));

			case 43:
				if (!context$1$0.sent) {
					context$1$0.next = 59;
					break;
				}

				context$1$0.prev = 44;
				context$1$0.t1 = results;
				context$1$0.t2 = JSON;
				context$1$0.next = 49;
				return regeneratorRuntime.awrap(_qIoFs2['default'].read(cachedPatternPath));

			case 49:
				context$1$0.t3 = context$1$0.sent;
				context$1$0.t4 = context$1$0.t2.parse.call(context$1$0.t2, context$1$0.t3);
				context$1$0.t1.push.call(context$1$0.t1, context$1$0.t4);

				log('Static cache hit for ' + patternID + ' at ' + cachedPatternPath + '. Profit!');
				return context$1$0.abrupt('continue', 94);

			case 56:
				context$1$0.prev = 56;
				context$1$0.t5 = context$1$0['catch'](44);

				log('Error reading static cache version of ' + patternID + ' at ' + cachedPatternPath, context$1$0.t5);

			case 59:

				log('Static cache miss for ' + patternID + ' at ' + cachedPatternPath + ', falling back to dynamic version');

			case 60:
				context$1$0.next = 62;
				return regeneratorRuntime.awrap(factory(patternID, base, config, transforms, filters));

			case 62:
				pattern = context$1$0.sent;
				cachedRead = cache && cache.config.read ? cache.get(readCacheID, false) : null;

				if (cachedRead) {
					context$1$0.next = 78;
					break;
				}

				log('Reading pattern "' + patternID + '"');
				context$1$0.prev = 66;
				context$1$0.next = 69;
				return regeneratorRuntime.awrap(pattern.read());

			case 69:
				context$1$0.next = 76;
				break;

			case 71:
				context$1$0.prev = 71;
				context$1$0.t6 = context$1$0['catch'](66);

				if (!fail) {
					context$1$0.next = 75;
					break;
				}

				throw context$1$0.t6;

			case 75:
				errors.push(context$1$0.t6);

			case 76:
				context$1$0.next = 80;
				break;

			case 78:
				log('Using cached pattern read "' + readCacheID + '"');
				pattern = cachedRead;

			case 80:

				if (cache && cache.config.read) {
					cache.set(readCacheID, pattern.mtime, pattern);
				}

				context$1$0.prev = 81;
				context$1$0.t7 = results;
				context$1$0.next = 85;
				return regeneratorRuntime.awrap(pattern.transform(!isEnvironment, isEnvironment));

			case 85:
				context$1$0.t8 = context$1$0.sent;
				context$1$0.t7.push.call(context$1$0.t7, context$1$0.t8);
				context$1$0.next = 94;
				break;

			case 89:
				context$1$0.prev = 89;
				context$1$0.t9 = context$1$0['catch'](81);

				if (!fail) {
					context$1$0.next = 93;
					break;
				}

				throw context$1$0.t9;

			case 93:
				errors.push(context$1$0.t9);

			case 94:
				_iteratorNormalCompletion = true;
				context$1$0.next = 29;
				break;

			case 97:
				context$1$0.next = 103;
				break;

			case 99:
				context$1$0.prev = 99;
				context$1$0.t10 = context$1$0['catch'](27);
				_didIteratorError = true;
				_iteratorError = context$1$0.t10;

			case 103:
				context$1$0.prev = 103;
				context$1$0.prev = 104;

				if (!_iteratorNormalCompletion && _iterator['return']) {
					_iterator['return']();
				}

			case 106:
				context$1$0.prev = 106;

				if (!_didIteratorError) {
					context$1$0.next = 109;
					break;
				}

				throw _iteratorError;

			case 109:
				return context$1$0.finish(106);

			case 110:
				return context$1$0.finish(103);

			case 111:

				results = results.map(function (result) {
					return typeof result.toJSON === 'function' ? result.toJSON() : result;
				});

				return context$1$0.abrupt('return', results);

			case 113:
			case 'end':
				return context$1$0.stop();
		}
	}, null, this, [[27, 99, 103, 111], [44, 56], [66, 71], [81, 89], [104,, 106, 110]]);
}

exports['default'] = getPatterns;
module.exports = exports['default'];

// We are dealing with a directory listing

// Get all pattern ids