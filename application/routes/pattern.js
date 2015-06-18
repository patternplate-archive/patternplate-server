'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = patternRouteFactory;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _qIoFs = require('q-io/fs');

var _qIoFs2 = _interopRequireDefault(_qIoFs);

function patternRouteFactory(application, configuration) {
	var patterns = application.configuration[configuration.options.key] || {};
	var transforms = application.configuration.transforms || {};

	var config = { patterns: patterns, transforms: transforms };

	return function patternRoute() {
		var id, pattern, response, mtime, cwd, basePath, path, search, files, _patterns, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, file, _search, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, directory, patternID, _pattern;

		return regeneratorRuntime.async(function patternRoute$(context$2$0) {
			while (1) switch (context$2$0.prev = context$2$0.next) {
				case 0:
					this.type = 'json';

					id = this.params.id;
					pattern = undefined;
					response = undefined;
					mtime = undefined;
					cwd = application.runtime.patterncwd || application.runtime.cwd;
					basePath = (0, _path.resolve)(cwd, config.patterns.path);
					path = (0, _path.resolve)(basePath, id);
					context$2$0.next = 10;
					return regeneratorRuntime.awrap(_qIoFs2['default'].contains(basePath, path));

				case 10:
					context$2$0.t0 = context$2$0.sent;

					if (!(context$2$0.t0 === false)) {
						context$2$0.next = 13;
						break;
					}

					this['throw'](404, 'Could not find pattern ' + id, { 'error': true, 'message': 'Could not find ' + id });

				case 13:

					if (application.cache && application.runtime.env === 'production') {
						response = application.cache.get(id);
					}

					search = (0, _path.resolve)(path, 'pattern.json');

					if (response) {
						context$2$0.next = 115;
						break;
					}

					context$2$0.next = 18;
					return regeneratorRuntime.awrap(_qIoFs2['default'].exists(search));

				case 18:
					if (!context$2$0.sent) {
						context$2$0.next = 36;
						break;
					}

					context$2$0.prev = 19;
					context$2$0.next = 22;
					return regeneratorRuntime.awrap(application.pattern.factory(id, basePath, config, application.transforms));

				case 22:
					pattern = context$2$0.sent;
					context$2$0.next = 25;
					return regeneratorRuntime.awrap(pattern.read());

				case 25:
					context$2$0.next = 27;
					return regeneratorRuntime.awrap(pattern.transform());

				case 27:
					context$2$0.next = 32;
					break;

				case 29:
					context$2$0.prev = 29;
					context$2$0.t1 = context$2$0['catch'](19);

					this['throw'](500, context$2$0.t1);

				case 32:

					response = pattern;
					mtime = response.getLastModified();
					context$2$0.next = 115;
					break;

				case 36:
					context$2$0.next = 38;
					return regeneratorRuntime.awrap(_qIoFs2['default'].isDirectory(path));

				case 38:
					context$2$0.t2 = context$2$0.sent;

					if (!(context$2$0.t2 === false)) {
						context$2$0.next = 41;
						break;
					}

					return context$2$0.abrupt('return');

				case 41:
					context$2$0.next = 43;
					return regeneratorRuntime.awrap(_qIoFs2['default'].list(path));

				case 43:
					files = context$2$0.sent;
					_patterns = [];

					response = [];

					_iteratorNormalCompletion = true;
					_didIteratorError = false;
					_iteratorError = undefined;
					context$2$0.prev = 49;
					_iterator = files[Symbol.iterator]();

				case 51:
					if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
						context$2$0.next = 61;
						break;
					}

					file = _step.value;
					_search = (0, _path.resolve)(path, file, 'pattern.json');
					context$2$0.next = 56;
					return regeneratorRuntime.awrap(_qIoFs2['default'].exists(_search));

				case 56:
					if (!context$2$0.sent) {
						context$2$0.next = 58;
						break;
					}

					_patterns.push(file);

				case 58:
					_iteratorNormalCompletion = true;
					context$2$0.next = 51;
					break;

				case 61:
					context$2$0.next = 67;
					break;

				case 63:
					context$2$0.prev = 63;
					context$2$0.t3 = context$2$0['catch'](49);
					_didIteratorError = true;
					_iteratorError = context$2$0.t3;

				case 67:
					context$2$0.prev = 67;
					context$2$0.prev = 68;

					if (!_iteratorNormalCompletion && _iterator['return']) {
						_iterator['return']();
					}

				case 70:
					context$2$0.prev = 70;

					if (!_didIteratorError) {
						context$2$0.next = 73;
						break;
					}

					throw _iteratorError;

				case 73:
					return context$2$0.finish(70);

				case 74:
					return context$2$0.finish(67);

				case 75:
					_iteratorNormalCompletion2 = true;
					_didIteratorError2 = false;
					_iteratorError2 = undefined;
					context$2$0.prev = 78;
					_iterator2 = _patterns[Symbol.iterator]();

				case 80:
					if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
						context$2$0.next = 100;
						break;
					}

					directory = _step2.value;
					patternID = (0, _path.join)(id, directory);
					context$2$0.prev = 83;
					context$2$0.next = 86;
					return regeneratorRuntime.awrap(application.pattern.factory(patternID, basePath, config, application.transforms));

				case 86:
					_pattern = context$2$0.sent;

					response.push(_pattern);
					context$2$0.next = 90;
					return regeneratorRuntime.awrap(_pattern.read());

				case 90:
					context$2$0.next = 92;
					return regeneratorRuntime.awrap(_pattern.transform());

				case 92:
					context$2$0.next = 97;
					break;

				case 94:
					context$2$0.prev = 94;
					context$2$0.t4 = context$2$0['catch'](83);

					this['throw'](500, context$2$0.t4);

				case 97:
					_iteratorNormalCompletion2 = true;
					context$2$0.next = 80;
					break;

				case 100:
					context$2$0.next = 106;
					break;

				case 102:
					context$2$0.prev = 102;
					context$2$0.t5 = context$2$0['catch'](78);
					_didIteratorError2 = true;
					_iteratorError2 = context$2$0.t5;

				case 106:
					context$2$0.prev = 106;
					context$2$0.prev = 107;

					if (!_iteratorNormalCompletion2 && _iterator2['return']) {
						_iterator2['return']();
					}

				case 109:
					context$2$0.prev = 109;

					if (!_didIteratorError2) {
						context$2$0.next = 112;
						break;
					}

					throw _iteratorError2;

				case 112:
					return context$2$0.finish(109);

				case 113:
					return context$2$0.finish(106);

				case 114:

					mtime = response.map(function (item) {
						return item.getLastModified();
					}).sort(function (a, b) {
						return b - a;
					})[0];

				case 115:

					response = Array.isArray(response) ? response : [response];

					response = response.map(function (resp) {
						return typeof resp.toJSON === 'function' ? resp.toJSON() : resp;
					});

					if (application.cache && application.runtime.env === 'production') {
						application.cache.set(id, response);

						response.forEach(function cacheResponseItems(resp) {
							application.cache.set(resp.id, resp);
						});
					}

					response = response.length === 1 ? response[0] : response;

					if (mtime) {
						this.set('Last-Modified', mtime.toUTCString());
					}
					this.set('Cache-Control', 'maxage=' + (configuration.options.maxage | 0));
					this.body = JSON.stringify(response);

				case 122:
				case 'end':
					return context$2$0.stop();
			}
		}, null, this, [[19, 29], [49, 63, 67, 75], [68,, 70, 74], [78, 102, 106, 114], [83, 94], [107,, 109, 113]]);
	};
}

module.exports = exports['default'];

// Single pattern

// Check if fs.list view is applicable