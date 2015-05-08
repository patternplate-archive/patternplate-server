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
					this.type = 'json';

					id = this.params[0].value;
					pattern = undefined;
					response = undefined;
					mtime = undefined;
					cwd = application.runtime.patterncwd || application.runtime.cwd;
					basePath = _path.resolve(cwd, config.path);
					path = _path.resolve(basePath, id);
					context$2$0.next = 10;
					return _qIoFs.contains(basePath, path);

				case 10:
					context$2$0.t21 = context$2$0.sent;

					if (!(context$2$0.t21 === false)) {
						context$2$0.next = 13;
						break;
					}

					this['throw'](404, 'Could not find pattern ' + id, { 'error': true, 'message': 'Could not find ' + id });

				case 13:
					search = _path.resolve(path, 'pattern.json');
					context$2$0.next = 16;
					return _qIoFs.exists(search);

				case 16:
					if (!context$2$0.sent) {
						context$2$0.next = 35;
						break;
					}

					context$2$0.prev = 17;
					context$2$0.next = 20;
					return application.pattern.factory(id, basePath, config, application.transforms);

				case 20:
					pattern = context$2$0.sent;
					context$2$0.next = 23;
					return pattern.read();

				case 23:
					context$2$0.next = 25;
					return pattern.transform();

				case 25:
					context$2$0.next = 31;
					break;

				case 27:
					context$2$0.prev = 27;
					context$2$0.t22 = context$2$0['catch'](17);

					context$2$0.t22.fileName = context$2$0.t22.fileName || id;
					this['throw'](500, context$2$0.t22);

				case 31:

					response = pattern;
					mtime = response.getLastModified();
					context$2$0.next = 115;
					break;

				case 35:
					context$2$0.next = 37;
					return _qIoFs.isDirectory(path);

				case 37:
					context$2$0.t23 = context$2$0.sent;

					if (!(context$2$0.t23 === false)) {
						context$2$0.next = 40;
						break;
					}

					return context$2$0.abrupt('return');

				case 40:
					context$2$0.next = 42;
					return _qIoFs.list(path);

				case 42:
					files = context$2$0.sent;
					patterns = [];

					response = [];

					_iteratorNormalCompletion = true;
					_didIteratorError = false;
					_iteratorError = undefined;
					context$2$0.prev = 48;
					_iterator = files[Symbol.iterator]();

				case 50:
					if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
						context$2$0.next = 60;
						break;
					}

					file = _step.value;
					_search = _path.resolve(path, file, 'pattern.json');
					context$2$0.next = 55;
					return _qIoFs.exists(_search);

				case 55:
					if (!context$2$0.sent) {
						context$2$0.next = 57;
						break;
					}

					patterns.push(file);

				case 57:
					_iteratorNormalCompletion = true;
					context$2$0.next = 50;
					break;

				case 60:
					context$2$0.next = 66;
					break;

				case 62:
					context$2$0.prev = 62;
					context$2$0.t24 = context$2$0['catch'](48);
					_didIteratorError = true;
					_iteratorError = context$2$0.t24;

				case 66:
					context$2$0.prev = 66;
					context$2$0.prev = 67;

					if (!_iteratorNormalCompletion && _iterator['return']) {
						_iterator['return']();
					}

				case 69:
					context$2$0.prev = 69;

					if (!_didIteratorError) {
						context$2$0.next = 72;
						break;
					}

					throw _iteratorError;

				case 72:
					return context$2$0.finish(69);

				case 73:
					return context$2$0.finish(66);

				case 74:
					_iteratorNormalCompletion2 = true;
					_didIteratorError2 = false;
					_iteratorError2 = undefined;
					context$2$0.prev = 77;
					_iterator2 = patterns[Symbol.iterator]();

				case 79:
					if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
						context$2$0.next = 100;
						break;
					}

					directory = _step2.value;
					patternID = _path.join(id, directory);
					context$2$0.prev = 82;
					context$2$0.next = 85;
					return application.pattern.factory(patternID, basePath, config, application.transforms);

				case 85:
					_pattern = context$2$0.sent;

					response.push(_pattern);
					context$2$0.next = 89;
					return _pattern.read();

				case 89:
					context$2$0.next = 91;
					return _pattern.transform();

				case 91:
					context$2$0.next = 97;
					break;

				case 93:
					context$2$0.prev = 93;
					context$2$0.t25 = context$2$0['catch'](82);

					context$2$0.t25.fileName = context$2$0.t25.fileName || patternID;
					this['throw'](500, context$2$0.t25);

				case 97:
					_iteratorNormalCompletion2 = true;
					context$2$0.next = 79;
					break;

				case 100:
					context$2$0.next = 106;
					break;

				case 102:
					context$2$0.prev = 102;
					context$2$0.t26 = context$2$0['catch'](77);
					_didIteratorError2 = true;
					_iteratorError2 = context$2$0.t26;

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

					if (mtime) {
						this.set('Last-Modified', mtime.toUTCString());
					}
					this.set('Cache-Control', 'maxage=' + (configuration.options.maxage | 0));

					this.body = response;

				case 118:
				case 'end':
					return context$2$0.stop();
			}
		}, null, this, [[17, 27], [48, 62, 66, 74], [67,, 69, 73], [77, 102, 106, 114], [82, 93], [107,, 109, 113]]);
	};
}

module.exports = exports['default'];

// Single pattern

// Check if list view is applicable