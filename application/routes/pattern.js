'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = patternRouteFactory;

var _path = require('path');

var _qIoFs = require('q-io/fs');

function patternRouteFactory(application, configuration) {
	var config = application.configuration[configuration.options.key];

	return function patternRoute() {
		var id, pattern, response, mtime, cwd, basePath, path, search, files, patterns, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, file, _search, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, directory, patternID, _pattern;

		return regeneratorRuntime.async(function patternRoute$(context$2$0) {
			while (1) switch (context$2$0.prev = context$2$0.next) {
				case 0:
					id = this.params[0].value;
					pattern = undefined;
					response = undefined;
					mtime = undefined;
					cwd = application.runtime.patterncwd || application.runtime.cwd;
					basePath = _path.resolve(cwd, config.path);
					path = _path.resolve(basePath, id);
					context$2$0.next = 9;
					return _qIoFs.contains(basePath, path);

				case 9:
					context$2$0.t19 = context$2$0.sent;

					if (!(context$2$0.t19 === false)) {
						context$2$0.next = 12;
						break;
					}

					return context$2$0.abrupt('return');

				case 12:
					search = _path.resolve(path, 'pattern.json');
					context$2$0.next = 15;
					return _qIoFs.exists(search);

				case 15:
					if (!context$2$0.sent) {
						context$2$0.next = 34;
						break;
					}

					context$2$0.prev = 16;
					context$2$0.next = 19;
					return application.pattern.factory(id, basePath, config, application.transforms);

				case 19:
					pattern = context$2$0.sent;
					context$2$0.next = 22;
					return pattern.read();

				case 22:
					context$2$0.next = 24;
					return pattern.transform();

				case 24:
					context$2$0.next = 30;
					break;

				case 26:
					context$2$0.prev = 26;
					context$2$0.t20 = context$2$0['catch'](16);

					application.log.error(context$2$0.t20);
					return context$2$0.abrupt('return');

				case 30:

					response = pattern;
					mtime = response.getLastModified();
					context$2$0.next = 107;
					break;

				case 34:
					context$2$0.next = 36;
					return _qIoFs.isDirectory(path);

				case 36:
					context$2$0.t21 = context$2$0.sent;

					if (!(context$2$0.t21 === false)) {
						context$2$0.next = 39;
						break;
					}

					return context$2$0.abrupt('return');

				case 39:
					context$2$0.next = 41;
					return _qIoFs.list(path);

				case 41:
					files = context$2$0.sent;
					patterns = [];

					response = [];

					_iteratorNormalCompletion = true;
					_didIteratorError = false;
					_iteratorError = undefined;
					context$2$0.prev = 47;
					_iterator = files[Symbol.iterator]();

				case 49:
					if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
						context$2$0.next = 59;
						break;
					}

					file = _step.value;
					_search = _path.resolve(path, file, 'pattern.json');
					context$2$0.next = 54;
					return _qIoFs.exists(_search);

				case 54:
					if (!context$2$0.sent) {
						context$2$0.next = 56;
						break;
					}

					patterns.push(file);

				case 56:
					_iteratorNormalCompletion = true;
					context$2$0.next = 49;
					break;

				case 59:
					context$2$0.next = 65;
					break;

				case 61:
					context$2$0.prev = 61;
					context$2$0.t22 = context$2$0['catch'](47);
					_didIteratorError = true;
					_iteratorError = context$2$0.t22;

				case 65:
					context$2$0.prev = 65;
					context$2$0.prev = 66;

					if (!_iteratorNormalCompletion && _iterator['return']) {
						_iterator['return']();
					}

				case 68:
					context$2$0.prev = 68;

					if (!_didIteratorError) {
						context$2$0.next = 71;
						break;
					}

					throw _iteratorError;

				case 71:
					return context$2$0.finish(68);

				case 72:
					return context$2$0.finish(65);

				case 73:
					_iteratorNormalCompletion2 = true;
					_didIteratorError2 = false;
					_iteratorError2 = undefined;
					context$2$0.prev = 76;
					_iterator2 = patterns[Symbol.iterator]();

				case 78:
					if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
						context$2$0.next = 92;
						break;
					}

					directory = _step2.value;
					patternID = _path.join(id, directory);
					context$2$0.next = 83;
					return application.pattern.factory(patternID, basePath, config, application.transforms);

				case 83:
					_pattern = context$2$0.sent;
					context$2$0.next = 86;
					return _pattern.read();

				case 86:
					context$2$0.next = 88;
					return _pattern.transform();

				case 88:
					response.push(_pattern);

				case 89:
					_iteratorNormalCompletion2 = true;
					context$2$0.next = 78;
					break;

				case 92:
					context$2$0.next = 98;
					break;

				case 94:
					context$2$0.prev = 94;
					context$2$0.t23 = context$2$0['catch'](76);
					_didIteratorError2 = true;
					_iteratorError2 = context$2$0.t23;

				case 98:
					context$2$0.prev = 98;
					context$2$0.prev = 99;

					if (!_iteratorNormalCompletion2 && _iterator2['return']) {
						_iterator2['return']();
					}

				case 101:
					context$2$0.prev = 101;

					if (!_didIteratorError2) {
						context$2$0.next = 104;
						break;
					}

					throw _iteratorError2;

				case 104:
					return context$2$0.finish(101);

				case 105:
					return context$2$0.finish(98);

				case 106:

					mtime = response.map(function (item) {
						return item.getLastModified();
					}).sort(function (a, b) {
						return b - a;
					})[0];

				case 107:

					if (mtime) {
						this.set('Last-Modified', mtime.toUTCString());
					}
					this.set('Cache-Control', 'maxage=' + (configuration.options.maxage | 0));

					this.type = 'json';
					this.body = response;

				case 111:
				case 'end':
					return context$2$0.stop();
			}
		}, null, this, [[16, 26], [47, 61, 65, 73], [66,, 68, 72], [76, 94, 98, 106], [99,, 101, 105]]);
	};
}

module.exports = exports['default'];

// Single pattern

// Check if list view is applicable