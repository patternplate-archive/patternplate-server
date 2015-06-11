'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _qIoFs = require('q-io/fs');

var _qIoFs2 = _interopRequireDefault(_qIoFs);

function build(application, config) {
	var patternHook, patternRoot, virtualPattern, outputBase, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, resultName, result, contents, ext, path;

	return regeneratorRuntime.async(function build$(context$1$0) {
		while (1) switch (context$1$0.prev = context$1$0.next) {
			case 0:
				patternHook = application.hooks.filter(function (hook) {
					return hook.name === 'patterns';
				})[0];
				patternRoot = (0, _path.resolve)(application.runtime.patterncwd || application.runtime.cwd, patternHook.configuration.path);
				context$1$0.next = 4;
				return regeneratorRuntime.awrap(application.pattern.factory('.tmp', patternRoot, application.configuration.patterns, application.transforms));

			case 4:
				virtualPattern = context$1$0.sent;
				context$1$0.next = 7;
				return regeneratorRuntime.awrap(virtualPattern.virtualize());

			case 7:
				context$1$0.prev = 7;
				context$1$0.next = 10;
				return regeneratorRuntime.awrap(virtualPattern.read());

			case 10:
				context$1$0.next = 12;
				return regeneratorRuntime.awrap(virtualPattern.transform(false, true));

			case 12:
				context$1$0.next = 17;
				break;

			case 14:
				context$1$0.prev = 14;
				context$1$0.t0 = context$1$0['catch'](7);
				throw context$1$0.t0;

			case 17:
				context$1$0.prev = 17;
				context$1$0.next = 20;
				return regeneratorRuntime.awrap(virtualPattern.clean());

			case 20:
				return context$1$0.finish(17);

			case 21:
				outputBase = (0, _path.resolve)(application.runtime.patterncwd || application.runtime.cwd, 'build');
				context$1$0.next = 24;
				return regeneratorRuntime.awrap(_qIoFs2['default'].makeTree(outputBase));

			case 24:
				_iteratorNormalCompletion = true;
				_didIteratorError = false;
				_iteratorError = undefined;
				context$1$0.prev = 27;
				_iterator = Object.keys(virtualPattern.results)[Symbol.iterator]();

			case 29:
				if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
					context$1$0.next = 41;
					break;
				}

				resultName = _step.value;
				result = virtualPattern.results[resultName];
				contents = result.buffer.toString('utf-8');
				ext = result.out;
				path = (0, _path.resolve)(outputBase, ['index', ext].join('.'));

				application.log.info('[console:run] Writing ' + ext + ' to ' + path + ' ...');
				context$1$0.next = 38;
				return regeneratorRuntime.awrap(_qIoFs2['default'].write(path, contents));

			case 38:
				_iteratorNormalCompletion = true;
				context$1$0.next = 29;
				break;

			case 41:
				context$1$0.next = 47;
				break;

			case 43:
				context$1$0.prev = 43;
				context$1$0.t1 = context$1$0['catch'](27);
				_didIteratorError = true;
				_iteratorError = context$1$0.t1;

			case 47:
				context$1$0.prev = 47;
				context$1$0.prev = 48;

				if (!_iteratorNormalCompletion && _iterator['return']) {
					_iterator['return']();
				}

			case 50:
				context$1$0.prev = 50;

				if (!_didIteratorError) {
					context$1$0.next = 53;
					break;
				}

				throw _iteratorError;

			case 53:
				return context$1$0.finish(50);

			case 54:
				return context$1$0.finish(47);

			case 55:
			case 'end':
				return context$1$0.stop();
		}
	}, null, this, [[7, 14, 17, 21], [27, 43, 47, 55], [48,, 50, 54]]);
}

exports['default'] = build;
module.exports = exports['default'];