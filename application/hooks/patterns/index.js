'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _requireAll = require('require-all');

var _requireAll2 = _interopRequireDefault(_requireAll);

var _path = require('path');

var _qIoFs = require('q-io/fs');

var _qIoFs2 = _interopRequireDefault(_qIoFs);

var _patternCache = require('./pattern-cache');

var _patternCache2 = _interopRequireDefault(_patternCache);

var _pattern = require('./pattern');

var _pattern2 = _interopRequireDefault(_pattern);

function populate(cache, root, hook) {
	var list, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, manifest, patternID, pattern;

	return regeneratorRuntime.async(function populate$(context$1$0) {
		while (1) switch (context$1$0.prev = context$1$0.next) {
			case 0:
				hook.log.info('Pattern cache is enabled, populating it from ' + root);
				context$1$0.next = 3;
				return regeneratorRuntime.awrap(_qIoFs2['default'].listTree(root, function (path) {
					return (0, _path.basename)(path) === 'pattern.json';
				}));

			case 3:
				list = context$1$0.sent;
				_iteratorNormalCompletion = true;
				_didIteratorError = false;
				_iteratorError = undefined;
				context$1$0.prev = 7;
				_iterator = list[Symbol.iterator]();

			case 9:
				if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
					context$1$0.next = 27;
					break;
				}

				manifest = _step.value;
				context$1$0.next = 13;
				return regeneratorRuntime.awrap(_qIoFs2['default'].relative(root, _qIoFs2['default'].directory(manifest)));

			case 13:
				patternID = context$1$0.sent;
				pattern = new _pattern.Pattern(patternID, root, {}, {}, cache);
				context$1$0.prev = 15;
				context$1$0.next = 18;
				return regeneratorRuntime.awrap(pattern.read());

			case 18:
				context$1$0.next = 24;
				break;

			case 20:
				context$1$0.prev = 20;
				context$1$0.t0 = context$1$0['catch'](15);

				hook.log.warn('Error while populating cache for ' + patternID);
				hook.log.error(context$1$0.t0.stack);

			case 24:
				_iteratorNormalCompletion = true;
				context$1$0.next = 9;
				break;

			case 27:
				context$1$0.next = 33;
				break;

			case 29:
				context$1$0.prev = 29;
				context$1$0.t1 = context$1$0['catch'](7);
				_didIteratorError = true;
				_iteratorError = context$1$0.t1;

			case 33:
				context$1$0.prev = 33;
				context$1$0.prev = 34;

				if (!_iteratorNormalCompletion && _iterator['return']) {
					_iterator['return']();
				}

			case 36:
				context$1$0.prev = 36;

				if (!_didIteratorError) {
					context$1$0.next = 39;
					break;
				}

				throw _iteratorError;

			case 39:
				return context$1$0.finish(36);

			case 40:
				return context$1$0.finish(33);

			case 41:

				hook.log.info('Populated pattern cache from ' + root + '. Size ' + Math.round(cache.length / 1024) + ' MB at ' + cache.itemCount + ' items.');

			case 42:
			case 'end':
				return context$1$0.stop();
		}
	}, null, this, [[7, 29, 33, 41], [15, 20], [34,, 36, 40]]);
}

exports['default'] = {
	'wait': true,
	'after': ['hooks:log:start:after'],
	'start': function startPatternHook(application) {
		var patternCwd, patternRoot, transformFactories;
		return regeneratorRuntime.async(function startPatternHook$(context$1$0) {
			while (1) switch (context$1$0.prev = context$1$0.next) {
				case 0:
					if (this.configuration.cache && application.configuration.mode !== 'console') {
						application.patternCache = (0, _patternCache2['default'])(this.configuration.cache);
						patternCwd = application.runtime.patterncwd || application.runtime.cwd;
						patternRoot = (0, _path.resolve)(patternCwd, this.configuration.path);

						populate(application.patternCache, patternRoot, this);
					}

					application.pattern = {
						'factory': function factory() {
							for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
								args[_key] = arguments[_key];
							}

							return _pattern2['default'].apply(undefined, [].concat(args, [application.patternCache]));
						},
						'class': _pattern.Pattern
					};

					transformFactories = (0, _requireAll2['default'])({
						'dirname': (0, _path.resolve)(application.runtime.cwd, this.configuration.transformPath),
						'filter': /^(.*)\.(js|json)/
					});

					application.transforms = Object.keys(transformFactories).reduce(function getTransform(transforms, transformName) {
						if (typeof transformFactories[transformName].index === 'function') {
							application.log.info('[application:hook:patterns] Loading transform factory "' + transformName + '"');
							var fn = transformFactories[transformName].index(application);

							if (typeof fn !== 'function') {
								application.log.info('[application:hook:patterns] transform factory "' + transformName + '" did not return a valid transform.');
								return transforms;
							}

							application.log.info('[application:hook:patterns] transform "' + transformName + '" available.');
							transforms[transformName] = fn;
						}
						return transforms;
					}, {});

					return context$1$0.abrupt('return', this);

				case 5:
				case 'end':
					return context$1$0.stop();
			}
		}, null, this);
	}
};
module.exports = exports['default'];