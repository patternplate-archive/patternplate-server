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
					context$2$0.t17 = context$2$0.sent;

					if (!(context$2$0.t17 === false)) {
						context$2$0.next = 14;
						break;
					}

					this['throw'](404, 'Could not find pattern ' + id, { 'error': true, 'message': 'Could not find ' + id });

				case 14:

					if (application.cache) {
						response = application.cache.get(uri);
					}

					search = (0, _path.resolve)(path, 'pattern.json');

					if (response) {
						context$2$0.next = 118;
						break;
					}

					context$2$0.next = 19;
					return _qIoFs2['default'].exists(search);

				case 19:
					if (!context$2$0.sent) {
						context$2$0.next = 38;
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
					context$2$0.next = 34;
					break;

				case 30:
					context$2$0.prev = 30;
					context$2$0.t18 = context$2$0['catch'](20);

					context$2$0.t18.fileName = context$2$0.t18.fileName || id;
					this['throw'](500, context$2$0.t18);

				case 34:

					response = pattern;
					mtime = response.getLastModified();
					context$2$0.next = 118;
					break;

				case 38:
					context$2$0.next = 40;
					return _qIoFs2['default'].isDirectory(path);

				case 40:
					context$2$0.t19 = context$2$0.sent;

					if (!(context$2$0.t19 === false)) {
						context$2$0.next = 43;
						break;
					}

					return context$2$0.abrupt('return');

				case 43:
					context$2$0.next = 45;
					return _qIoFs2['default'].list(path);

				case 45:
					files = context$2$0.sent;
					patterns = [];

					response = [];

					_iteratorNormalCompletion = true;
					_didIteratorError = false;
					_iteratorError = undefined;
					context$2$0.prev = 51;
					_iterator = files[Symbol.iterator]();

				case 53:
					if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
						context$2$0.next = 63;
						break;
					}

					file = _step.value;
					_search = (0, _path.resolve)(path, file, 'pattern.json');
					context$2$0.next = 58;
					return _qIoFs2['default'].exists(_search);

				case 58:
					if (!context$2$0.sent) {
						context$2$0.next = 60;
						break;
					}

					patterns.push(file);

				case 60:
					_iteratorNormalCompletion = true;
					context$2$0.next = 53;
					break;

				case 63:
					context$2$0.next = 69;
					break;

				case 65:
					context$2$0.prev = 65;
					context$2$0.t20 = context$2$0['catch'](51);
					_didIteratorError = true;
					_iteratorError = context$2$0.t20;

				case 69:
					context$2$0.prev = 69;
					context$2$0.prev = 70;

					if (!_iteratorNormalCompletion && _iterator['return']) {
						_iterator['return']();
					}

				case 72:
					context$2$0.prev = 72;

					if (!_didIteratorError) {
						context$2$0.next = 75;
						break;
					}

					throw _iteratorError;

				case 75:
					return context$2$0.finish(72);

				case 76:
					return context$2$0.finish(69);

				case 77:
					_iteratorNormalCompletion2 = true;
					_didIteratorError2 = false;
					_iteratorError2 = undefined;
					context$2$0.prev = 80;
					_iterator2 = patterns[Symbol.iterator]();

				case 82:
					if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
						context$2$0.next = 103;
						break;
					}

					directory = _step2.value;
					patternID = (0, _path.join)(id, directory);
					context$2$0.prev = 85;
					context$2$0.next = 88;
					return application.pattern.factory(patternID, basePath, config, application.transforms);

				case 88:
					_pattern = context$2$0.sent;

					response.push(_pattern);
					context$2$0.next = 92;
					return _pattern.read();

				case 92:
					context$2$0.next = 94;
					return _pattern.transform();

				case 94:
					context$2$0.next = 100;
					break;

				case 96:
					context$2$0.prev = 96;
					context$2$0.t21 = context$2$0['catch'](85);

					context$2$0.t21.fileName = context$2$0.t21.fileName || patternID;
					this['throw'](500, context$2$0.t21);

				case 100:
					_iteratorNormalCompletion2 = true;
					context$2$0.next = 82;
					break;

				case 103:
					context$2$0.next = 109;
					break;

				case 105:
					context$2$0.prev = 105;
					context$2$0.t22 = context$2$0['catch'](80);
					_didIteratorError2 = true;
					_iteratorError2 = context$2$0.t22;

				case 109:
					context$2$0.prev = 109;
					context$2$0.prev = 110;

					if (!_iteratorNormalCompletion2 && _iterator2['return']) {
						_iterator2['return']();
					}

				case 112:
					context$2$0.prev = 112;

					if (!_didIteratorError2) {
						context$2$0.next = 115;
						break;
					}

					throw _iteratorError2;

				case 115:
					return context$2$0.finish(112);

				case 116:
					return context$2$0.finish(109);

				case 117:

					mtime = response.map(function (item) {
						return item.getLastModified();
					}).sort(function (a, b) {
						return b - a;
					})[0];

				case 118:

					response = Array.isArray(response) ? response : [response];

					response = response.map(function (resp) {
						return typeof resp.toJSON === 'function' ? resp.toJSON() : resp;
					});

					response = response.length === 1 ? response[0] : response;

					if (application.cache) {
						application.cache.set(uri, response);
					}

					if (mtime) {
						this.set('Last-Modified', mtime.toUTCString());
					}
					this.set('Cache-Control', 'maxage=' + (configuration.options.maxage | 0));
					this.body = JSON.stringify(response);

				case 125:
				case 'end':
					return context$2$0.stop();
			}
		}, null, this, [[20, 30], [51, 65, 69, 77], [70,, 72, 76], [80, 105, 109, 117], [85, 96], [110,, 112, 116]]);
	};
}

module.exports = exports['default'];

// Single pattern

// Check if fs.list view is applicable