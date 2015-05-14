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
					context$2$0.t154 = context$2$0.sent;

					if (!(context$2$0.t154 === false)) {
						context$2$0.next = 14;
						break;
					}

					this['throw'](404, 'Could not find pattern ' + id, { 'error': true, 'message': 'Could not find ' + id });

				case 14:

					if (application.cache) {
						response = application.cache.get(uri);
					}

					search = (0, _path.resolve)(path, 'pattern.json');

					console.log(response);

					if (response) {
						context$2$0.next = 119;
						break;
					}

					context$2$0.next = 20;
					return _qIoFs2['default'].exists(search);

				case 20:
					if (!context$2$0.sent) {
						context$2$0.next = 39;
						break;
					}

					context$2$0.prev = 21;
					context$2$0.next = 24;
					return application.pattern.factory(id, basePath, config, application.transforms);

				case 24:
					pattern = context$2$0.sent;
					context$2$0.next = 27;
					return pattern.read();

				case 27:
					context$2$0.next = 29;
					return pattern.transform();

				case 29:
					context$2$0.next = 35;
					break;

				case 31:
					context$2$0.prev = 31;
					context$2$0.t155 = context$2$0['catch'](21);

					context$2$0.t155.fileName = context$2$0.t155.fileName || id;
					this['throw'](500, context$2$0.t155);

				case 35:

					response = pattern;
					mtime = response.getLastModified();
					context$2$0.next = 119;
					break;

				case 39:
					context$2$0.next = 41;
					return _qIoFs2['default'].isDirectory(path);

				case 41:
					context$2$0.t156 = context$2$0.sent;

					if (!(context$2$0.t156 === false)) {
						context$2$0.next = 44;
						break;
					}

					return context$2$0.abrupt('return');

				case 44:
					context$2$0.next = 46;
					return _qIoFs2['default'].list(path);

				case 46:
					files = context$2$0.sent;
					patterns = [];

					response = [];

					_iteratorNormalCompletion = true;
					_didIteratorError = false;
					_iteratorError = undefined;
					context$2$0.prev = 52;
					_iterator = files[Symbol.iterator]();

				case 54:
					if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
						context$2$0.next = 64;
						break;
					}

					file = _step.value;
					_search = (0, _path.resolve)(path, file, 'pattern.json');
					context$2$0.next = 59;
					return _qIoFs2['default'].exists(_search);

				case 59:
					if (!context$2$0.sent) {
						context$2$0.next = 61;
						break;
					}

					patterns.push(file);

				case 61:
					_iteratorNormalCompletion = true;
					context$2$0.next = 54;
					break;

				case 64:
					context$2$0.next = 70;
					break;

				case 66:
					context$2$0.prev = 66;
					context$2$0.t157 = context$2$0['catch'](52);
					_didIteratorError = true;
					_iteratorError = context$2$0.t157;

				case 70:
					context$2$0.prev = 70;
					context$2$0.prev = 71;

					if (!_iteratorNormalCompletion && _iterator['return']) {
						_iterator['return']();
					}

				case 73:
					context$2$0.prev = 73;

					if (!_didIteratorError) {
						context$2$0.next = 76;
						break;
					}

					throw _iteratorError;

				case 76:
					return context$2$0.finish(73);

				case 77:
					return context$2$0.finish(70);

				case 78:
					_iteratorNormalCompletion2 = true;
					_didIteratorError2 = false;
					_iteratorError2 = undefined;
					context$2$0.prev = 81;
					_iterator2 = patterns[Symbol.iterator]();

				case 83:
					if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
						context$2$0.next = 104;
						break;
					}

					directory = _step2.value;
					patternID = (0, _path.join)(id, directory);
					context$2$0.prev = 86;
					context$2$0.next = 89;
					return application.pattern.factory(patternID, basePath, config, application.transforms);

				case 89:
					_pattern = context$2$0.sent;

					response.push(_pattern);
					context$2$0.next = 93;
					return _pattern.read();

				case 93:
					context$2$0.next = 95;
					return _pattern.transform();

				case 95:
					context$2$0.next = 101;
					break;

				case 97:
					context$2$0.prev = 97;
					context$2$0.t158 = context$2$0['catch'](86);

					context$2$0.t158.fileName = context$2$0.t158.fileName || patternID;
					this['throw'](500, context$2$0.t158);

				case 101:
					_iteratorNormalCompletion2 = true;
					context$2$0.next = 83;
					break;

				case 104:
					context$2$0.next = 110;
					break;

				case 106:
					context$2$0.prev = 106;
					context$2$0.t159 = context$2$0['catch'](81);
					_didIteratorError2 = true;
					_iteratorError2 = context$2$0.t159;

				case 110:
					context$2$0.prev = 110;
					context$2$0.prev = 111;

					if (!_iteratorNormalCompletion2 && _iterator2['return']) {
						_iterator2['return']();
					}

				case 113:
					context$2$0.prev = 113;

					if (!_didIteratorError2) {
						context$2$0.next = 116;
						break;
					}

					throw _iteratorError2;

				case 116:
					return context$2$0.finish(113);

				case 117:
					return context$2$0.finish(110);

				case 118:

					mtime = response.map(function (item) {
						return item.getLastModified();
					}).sort(function (a, b) {
						return b - a;
					})[0];

				case 119:

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

				case 126:
				case 'end':
					return context$2$0.stop();
			}
		}, null, this, [[21, 31], [52, 66, 70, 78], [71,, 73, 77], [81, 106, 110, 118], [86, 97], [111,, 113, 117]]);
	};
}

module.exports = exports['default'];

// Single pattern

// Check if fs.list view is applicable