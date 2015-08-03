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

var _libraryUtilitiesGetPatterns = require('../../../library/utilities/get-patterns');

var _libraryUtilitiesGetPatterns2 = _interopRequireDefault(_libraryUtilitiesGetPatterns);

function populate(application) {
	var config, id, cwd, base, factory, transforms, start, delta;
	return regeneratorRuntime.async(function populate$(context$1$0) {
		while (1) switch (context$1$0.prev = context$1$0.next) {
			case 0:
				config = {
					'patterns': application.configuration.patterns,
					'transforms': application.configuration.transforms
				};
				id = '.';
				cwd = application.runtime.patterncwd || application.runtime.cwd;
				base = (0, _path.resolve)(cwd, config.patterns.path);
				factory = application.pattern.factory;
				transforms = application.transforms;

				application.log.info('Populating cache from ' + base + '...');
				start = Date.now();
				context$1$0.next = 10;
				return regeneratorRuntime.awrap((0, _libraryUtilitiesGetPatterns2['default'])({
					id: id, config: config, base: base, factory: factory, transforms: transforms,
					'log': function log() {
						var _application$log;

						for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
							args[_key] = arguments[_key];
						}

						(_application$log = application.log).silly.apply(_application$log, ['[cache:pattern:getpattern]'].concat(args));
					}
				}, application.cache, false));

			case 10:
				delta = Date.now() - start / 1000;

				application.cache.ready = true;
				application.log.info('Populated cache from ' + base + ' in ' + delta + 's');

			case 13:
			case 'end':
				return context$1$0.stop();
		}
	}, null, this);
}

exports['default'] = {
	'wait': true,
	'after': ['hooks:log:start:after'],
	'start': function startPatternHook(application) {
		var transformPaths, transformFactories, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, transformPath, resolvedTransformPath, resolvedTransformFactories;

		return regeneratorRuntime.async(function startPatternHook$(context$1$0) {
			while (1) switch (context$1$0.prev = context$1$0.next) {
				case 0:
					application.pattern = {
						'factory': function factory() {
							for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
								args[_key2] = arguments[_key2];
							}

							return _pattern2['default'].apply(undefined, [].concat(args, [application.cache]));
						},
						'class': _pattern.Pattern
					};

					this.configuration.transformPath = Array.isArray(this.configuration.transformPath) ? this.configuration.transformPath : [this.configuration.transformPath];

					transformPaths = this.configuration.transformPath.reduce(function (items, item) {
						return items.concat(application.runtime.cwds.map(function (cwd) {
							return (0, _path.resolve)(cwd, item);
						}));
					}, []);
					transformFactories = {};
					_iteratorNormalCompletion = true;
					_didIteratorError = false;
					_iteratorError = undefined;
					context$1$0.prev = 7;
					_iterator = transformPaths[Symbol.iterator]();

				case 9:
					if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
						context$1$0.next = 21;
						break;
					}

					transformPath = _step.value;
					resolvedTransformPath = (0, _path.resolve)(application.runtime.cwd, transformPath);
					context$1$0.next = 14;
					return regeneratorRuntime.awrap(_qIoFs2['default'].exists(resolvedTransformPath));

				case 14:
					if (!context$1$0.sent) {
						context$1$0.next = 18;
						break;
					}

					this.log.silly('Importing transforms from: ' + resolvedTransformPath);
					resolvedTransformFactories = (0, _requireAll2['default'])({
						'dirname': resolvedTransformPath,
						'filter': /^(.*)\.(js|json)/
					});

					Object.assign(transformFactories, resolvedTransformFactories);

				case 18:
					_iteratorNormalCompletion = true;
					context$1$0.next = 9;
					break;

				case 21:
					context$1$0.next = 27;
					break;

				case 23:
					context$1$0.prev = 23;
					context$1$0.t0 = context$1$0['catch'](7);
					_didIteratorError = true;
					_iteratorError = context$1$0.t0;

				case 27:
					context$1$0.prev = 27;
					context$1$0.prev = 28;

					if (!_iteratorNormalCompletion && _iterator['return']) {
						_iterator['return']();
					}

				case 30:
					context$1$0.prev = 30;

					if (!_didIteratorError) {
						context$1$0.next = 33;
						break;
					}

					throw _iteratorError;

				case 33:
					return context$1$0.finish(30);

				case 34:
					return context$1$0.finish(27);

				case 35:

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

					if (this.configuration.cache) {
						application.cache = (0, _patternCache2['default'])(this.configuration.cache);
						application.cache.ready = !this.configuration.cache.populate;

						application.cache.staticRoot = (0, _path.resolve)(application.runtime.patterncwd || application.runtime.cwd, '.cache'); // TODO: Make this configurable

						if (this.configuration.cache.populate) {
							populate(application);
						}
					}

					return context$1$0.abrupt('return', this);

				case 38:
				case 'end':
					return context$1$0.stop();
			}
		}, null, this, [[7, 23, 27, 35], [28,, 30, 34]]);
	}
};
module.exports = exports['default'];