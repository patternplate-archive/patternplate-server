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
	var config = application.configuration[configuration.options.key];

	return function patternRoute() {
		var id, pattern, response, mtime, cwd, basePath, path, uri, search, files, patterns, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, file, _search, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, directory, patternID, _pattern;

		return regeneratorRuntime.async(function patternRoute$(context$2$0) {
			while (1) switch (context$2$0.prev = context$2$0.next) {
				case 0:
					this.type = 'json';

					id = this.params.id;
					pattern = undefined;
					response = undefined;
					mtime = undefined;
					cwd = application.runtime.patterncwd || application.runtime.cwd;
					basePath = (0, _path.resolve)(cwd, config.path);
					path = (0, _path.resolve)(basePath, id);
					uri = 'http://' + this.request.host + '' + this.request.url;
					context$2$0.next = 11;
					return _qIoFs2['default'].contains(basePath, path);

				case 11:
					context$2$0.t0 = context$2$0.sent;

					if (!(context$2$0.t0 === false)) {
						context$2$0.next = 14;
						break;
					}

					this['throw'](404, 'Could not find pattern ' + id, { 'error': true, 'message': 'Could not find ' + id });

				case 14:

					if (application.cache && application.runtime.env === 'production') {
						response = application.cache.get(id);
					}

					search = (0, _path.resolve)(path, 'pattern.json');

					if (response) {
						context$2$0.next = 116;
						break;
					}

					context$2$0.next = 19;
					return _qIoFs2['default'].exists(search);

				case 19:
					if (!context$2$0.sent) {
						context$2$0.next = 37;
						break;
					}

					context$2$0.prev = 20;
					context$2$0.next = 23;
					return application.pattern.factory(id, basePath, config, application.transforms);

				case 23:
					pattern = context$2$0.sent;
					context$2$0.next = 26;
					return pattern.read();

				case 26:
					context$2$0.next = 28;
					return pattern.transform();

				case 28:
					context$2$0.next = 33;
					break;

				case 30:
					context$2$0.prev = 30;
					context$2$0.t1 = context$2$0['catch'](20);

					this['throw'](500, context$2$0.t1);

				case 33:

					response = pattern;
					mtime = response.getLastModified();
					context$2$0.next = 116;
					break;

				case 37:
					context$2$0.next = 39;
					return _qIoFs2['default'].isDirectory(path);

				case 39:
					context$2$0.t2 = context$2$0.sent;

					if (!(context$2$0.t2 === false)) {
						context$2$0.next = 42;
						break;
					}

					return context$2$0.abrupt('return');

				case 42:
					context$2$0.next = 44;
					return _qIoFs2['default'].list(path);

				case 44:
					files = context$2$0.sent;
					patterns = [];

					response = [];

					_iteratorNormalCompletion = true;
					_didIteratorError = false;
					_iteratorError = undefined;
					context$2$0.prev = 50;
					_iterator = files[Symbol.iterator]();

				case 52:
					if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
						context$2$0.next = 62;
						break;
					}

					file = _step.value;
					_search = (0, _path.resolve)(path, file, 'pattern.json');
					context$2$0.next = 57;
					return _qIoFs2['default'].exists(_search);

				case 57:
					if (!context$2$0.sent) {
						context$2$0.next = 59;
						break;
					}

					patterns.push(file);

				case 59:
					_iteratorNormalCompletion = true;
					context$2$0.next = 52;
					break;

				case 62:
					context$2$0.next = 68;
					break;

				case 64:
					context$2$0.prev = 64;
					context$2$0.t3 = context$2$0['catch'](50);
					_didIteratorError = true;
					_iteratorError = context$2$0.t3;

				case 68:
					context$2$0.prev = 68;
					context$2$0.prev = 69;

					if (!_iteratorNormalCompletion && _iterator['return']) {
						_iterator['return']();
					}

				case 71:
					context$2$0.prev = 71;

					if (!_didIteratorError) {
						context$2$0.next = 74;
						break;
					}

					throw _iteratorError;

				case 74:
					return context$2$0.finish(71);

				case 75:
					return context$2$0.finish(68);

				case 76:
					_iteratorNormalCompletion2 = true;
					_didIteratorError2 = false;
					_iteratorError2 = undefined;
					context$2$0.prev = 79;
					_iterator2 = patterns[Symbol.iterator]();

				case 81:
					if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
						context$2$0.next = 101;
						break;
					}

					directory = _step2.value;
					patternID = (0, _path.join)(id, directory);
					context$2$0.prev = 84;
					context$2$0.next = 87;
					return application.pattern.factory(patternID, basePath, config, application.transforms);

				case 87:
					_pattern = context$2$0.sent;

					response.push(_pattern);
					context$2$0.next = 91;
					return _pattern.read();

				case 91:
					context$2$0.next = 93;
					return _pattern.transform();

				case 93:
					context$2$0.next = 98;
					break;

				case 95:
					context$2$0.prev = 95;
					context$2$0.t4 = context$2$0['catch'](84);

					this['throw'](500, context$2$0.t4);

				case 98:
					_iteratorNormalCompletion2 = true;
					context$2$0.next = 81;
					break;

				case 101:
					context$2$0.next = 107;
					break;

				case 103:
					context$2$0.prev = 103;
					context$2$0.t5 = context$2$0['catch'](79);
					_didIteratorError2 = true;
					_iteratorError2 = context$2$0.t5;

				case 107:
					context$2$0.prev = 107;
					context$2$0.prev = 108;

					if (!_iteratorNormalCompletion2 && _iterator2['return']) {
						_iterator2['return']();
					}

				case 110:
					context$2$0.prev = 110;

					if (!_didIteratorError2) {
						context$2$0.next = 113;
						break;
					}

					throw _iteratorError2;

				case 113:
					return context$2$0.finish(110);

				case 114:
					return context$2$0.finish(107);

				case 115:

					mtime = response.map(function (item) {
						return item.getLastModified();
					}).sort(function (a, b) {
						return b - a;
					})[0];

				case 116:

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

				case 123:
				case 'end':
					return context$2$0.stop();
			}
		}, null, this, [[20, 30], [50, 64, 68, 76], [69,, 71, 75], [79, 103, 107, 115], [84, 95], [108,, 110, 114]]);
	};
}

module.exports = exports['default'];

// Single pattern

// Check if fs.list view is applicable