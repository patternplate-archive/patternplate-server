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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NvdXJjZS9saWJyYXJ5L3V0aWxpdGllcy9nZXQtcGF0dGVybnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7b0JBQStDLE1BQU07O3FCQUN0QyxTQUFTOzs7O0FBRXhCLFNBQWUsV0FBVyxDQUFDLE9BQU87S0FBRSxLQUFLLHlEQUFHLElBQUk7S0FBRSxJQUFJLHlEQUFHLElBQUk7S0FBRSxhQUFhLHlEQUFHLEtBQUs7O0tBQzlFLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFDcEQsSUFBSSxFQUNKLE1BQU0sRUFjTixLQUFLLEVBQ0wsVUFBVSxFQU1WLE9BQU8sRUFDUCxNQUFNLGtGQUVELFNBQVMsRUFDYixXQUFXLEVBSVYsaUJBQWlCLEVBZ0JsQixPQUFPLEVBQ1AsVUFBVTs7Ozs7QUFoRFYsTUFBRSxHQUFxRCxPQUFPLENBQTlELEVBQUU7QUFBRSxRQUFJLEdBQStDLE9BQU8sQ0FBMUQsSUFBSTtBQUFFLFVBQU0sR0FBdUMsT0FBTyxDQUFwRCxNQUFNO0FBQUUsV0FBTyxHQUE4QixPQUFPLENBQTVDLE9BQU87QUFBRSxjQUFVLEdBQWtCLE9BQU8sQ0FBbkMsVUFBVTtBQUFFLFdBQU8sR0FBUyxPQUFPLENBQXZCLE9BQU87QUFBRSxPQUFHLEdBQUksT0FBTyxDQUFkLEdBQUc7QUFDcEQsUUFBSSxHQUFHLG1CQUFRLElBQUksRUFBRSxFQUFFLENBQUM7QUFDeEIsVUFBTSxHQUFHLG1CQUFRLElBQUksRUFBRSxjQUFjLENBQUM7O0FBQzFDLE9BQUcsR0FBRyxHQUFHLElBQUksWUFBVyxFQUFFLENBQUM7Ozs7b0NBR2hCLG1CQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7Ozs7Ozs7O3dDQUNsQixJQUFJOzs7O29DQUlELG1CQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7Ozs7Ozs7O0FBQzNCLFVBQU0sR0FBRyxJQUFJLENBQUM7Ozs7b0NBSUcsbUJBQUcs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QUFNLEVBQUUsR0FBRyxNQUFNLENBQUM7S0FDdEUsQ0FBQyxDQUFDOzt3Q0FFSSxPQUFPOzs7Ozs7O0NBQ2Q7O3FCQUVjLFdBQVciLCJmaWxlIjoiZ2V0LXBhdHRlcm5zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtyZXNvbHZlLCBqb2luLCBkaXJuYW1lLCBiYXNlbmFtZX0gZnJvbSAncGF0aCc7XG5pbXBvcnQgZnMgZnJvbSAncS1pby9mcyc7XG5cbmFzeW5jIGZ1bmN0aW9uIGdldFBhdHRlcm5zKG9wdGlvbnMsIGNhY2hlID0gbnVsbCwgZmFpbCA9IHRydWUsIGlzRW52aXJvbm1lbnQgPSBmYWxzZSkge1xuXHRsZXQge2lkLCBiYXNlLCBjb25maWcsIGZhY3RvcnksIHRyYW5zZm9ybXMsIGZpbHRlcnMsIGxvZ30gPSBvcHRpb25zO1xuXHRsZXQgcGF0aCA9IHJlc29sdmUoYmFzZSwgaWQpO1xuXHRsZXQgc2VhcmNoID0gcmVzb2x2ZShwYXRoLCAncGF0dGVybi5qc29uJyk7XG5cdGxvZyA9IGxvZyB8fCBmdW5jdGlvbigpIHt9O1xuXG5cdC8vIE5vIHBhdHRlcm5zIHRvIGZpbmQgaGVyZVxuXHRpZiAoIWF3YWl0IGZzLmV4aXN0cyhwYXRoKSkge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0Ly8gV2UgYXJlIGRlYWxpbmcgd2l0aCBhIGRpcmVjdG9yeSBsaXN0aW5nXG5cdGlmICghYXdhaXQgZnMuZXhpc3RzKHNlYXJjaCkpIHtcblx0XHRzZWFyY2ggPSBwYXRoO1xuXHR9XG5cblx0Ly8gR2V0IGFsbCBwYXR0ZXJuIGlkc1xuXHRsZXQgcGF0aHMgPSBhd2FpdCBmcy5saXN0VHJlZShzZWFyY2gpO1xuXHRsZXQgcGF0dGVybklEcyA9IHBhdGhzXG5cdFx0LmZpbHRlcigoaXRlbSkgPT4gYmFzZW5hbWUoaXRlbSkgPT09ICdwYXR0ZXJuLmpzb24nKVxuXHRcdC5maWx0ZXIoKGl0ZW0pID0+IGlzRW52aXJvbm1lbnQgPyB0cnVlIDogIWl0ZW0uaW5jbHVkZXMoJ0BlbnZpcm9ubWVudHMnKSlcblx0XHQubWFwKChpdGVtKSA9PiBkaXJuYW1lKGl0ZW0pKVxuXHRcdC5tYXAoKGl0ZW0pID0+IGZzLnJlbGF0aXZlRnJvbURpcmVjdG9yeShvcHRpb25zLmJhc2UsIGl0ZW0pKTtcblxuXHRsZXQgcmVzdWx0cyA9IFtdO1xuXHRsZXQgZXJyb3JzID0gW107XG5cblx0Zm9yIChsZXQgcGF0dGVybklEIG9mIHBhdHRlcm5JRHMpIHtcblx0XHRsZXQgcmVhZENhY2hlSUQgPSBgcGF0dGVybjpyZWFkOiR7cGF0dGVybklEfWA7XG5cdFx0bG9nKGBJbml0aWFsaXppbmcgcGF0dGVybiBcIiR7cGF0dGVybklEfVwiYCk7XG5cblx0XHRpZiAoY2FjaGUgJiYgY2FjaGUuY29uZmlnLnN0YXRpYyAmJiBjYWNoZS5zdGF0aWNSb290ICYmIGF3YWl0IGZzLmV4aXN0cyhjYWNoZS5zdGF0aWNSb290KSkge1xuXHRcdFx0bGV0IGNhY2hlZFBhdHRlcm5QYXRoID0gcmVzb2x2ZShjYWNoZS5zdGF0aWNSb290LCBwYXR0ZXJuSUQsICdidWlsZC5qc29uJyk7XG5cdFx0XHRsb2coYFNlYXJjaGluZyAke3BhdHRlcm5JRH0gc3RhdGljIGNhY2hlIGF0ICR7Y2FjaGVkUGF0dGVyblBhdGh9YCk7XG5cblx0XHRcdGlmIChhd2FpdCBmcy5leGlzdHMoY2FjaGVkUGF0dGVyblBhdGgpKSB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0cmVzdWx0cy5wdXNoKEpTT04ucGFyc2UoYXdhaXQgZnMucmVhZChjYWNoZWRQYXR0ZXJuUGF0aCkpKTtcblx0XHRcdFx0XHRsb2coYFN0YXRpYyBjYWNoZSBoaXQgZm9yICR7cGF0dGVybklEfSBhdCAke2NhY2hlZFBhdHRlcm5QYXRofS4gUHJvZml0IWApO1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9IGNhdGNoIChlcnIpIHtcblx0XHRcdFx0XHRsb2coYEVycm9yIHJlYWRpbmcgc3RhdGljIGNhY2hlIHZlcnNpb24gb2YgJHtwYXR0ZXJuSUR9IGF0ICR7Y2FjaGVkUGF0dGVyblBhdGh9YCwgZXJyKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRsb2coYFN0YXRpYyBjYWNoZSBtaXNzIGZvciAke3BhdHRlcm5JRH0gYXQgJHtjYWNoZWRQYXR0ZXJuUGF0aH0sIGZhbGxpbmcgYmFjayB0byBkeW5hbWljIHZlcnNpb25gKTtcblx0XHR9XG5cblx0XHRsZXQgcGF0dGVybiA9IGF3YWl0IGZhY3RvcnkocGF0dGVybklELCBiYXNlLCBjb25maWcsIHRyYW5zZm9ybXMsIGZpbHRlcnMpO1xuXHRcdGxldCBjYWNoZWRSZWFkID0gY2FjaGUgJiYgY2FjaGUuY29uZmlnLnJlYWQgPyBjYWNoZS5nZXQocmVhZENhY2hlSUQsIGZhbHNlKSA6IG51bGw7XG5cblx0XHRpZiAoIWNhY2hlZFJlYWQpIHtcblx0XHRcdGxvZyhgUmVhZGluZyBwYXR0ZXJuIFwiJHtwYXR0ZXJuSUR9XCJgKTtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGF3YWl0IHBhdHRlcm4ucmVhZCgpO1xuXHRcdFx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0XHRcdGlmIChmYWlsKSB0aHJvdyBlcnI7XG5cdFx0XHRcdGVycm9ycy5wdXNoKGVycik7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGxvZyhgVXNpbmcgY2FjaGVkIHBhdHRlcm4gcmVhZCBcIiR7cmVhZENhY2hlSUR9XCJgKTtcblx0XHRcdHBhdHRlcm4gPSBjYWNoZWRSZWFkO1xuXHRcdH1cblxuXHRcdGlmIChjYWNoZSAmJiBjYWNoZS5jb25maWcucmVhZCkge1xuXHRcdFx0Y2FjaGUuc2V0KHJlYWRDYWNoZUlELCBwYXR0ZXJuLm10aW1lLCBwYXR0ZXJuKTtcblx0XHR9XG5cblx0XHR0cnkge1xuXHRcdFx0cmVzdWx0cy5wdXNoKGF3YWl0IHBhdHRlcm4udHJhbnNmb3JtKCFpc0Vudmlyb25tZW50LCBpc0Vudmlyb25tZW50KSk7XG5cdFx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0XHRpZiAoZmFpbCkgdGhyb3cgZXJyO1xuXHRcdFx0ZXJyb3JzLnB1c2goZXJyKTtcblx0XHR9XG5cdH1cblxuXHRyZXN1bHRzID0gcmVzdWx0cy5tYXAoKHJlc3VsdCkgPT4ge1xuXHRcdHJldHVybiB0eXBlb2YgcmVzdWx0LnRvSlNPTiA9PT0gJ2Z1bmN0aW9uJyA/IHJlc3VsdC50b0pTT04oKSA6IHJlc3VsdDtcblx0fSk7XG5cblx0cmV0dXJuIHJlc3VsdHM7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldFBhdHRlcm5zO1xuIl19