'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _requireAll = require('require-all');

var _requireAll2 = _interopRequireDefault(_requireAll);

var _path = require('path');

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
				}, application.cache));

			case 10:
				delta = Date.now() - start / 1000;

				application.log.info('Populated cache from ' + base + ' in ' + delta + 's');

			case 12:
			case 'end':
				return context$1$0.stop();
		}
	}, null, this);
}

exports['default'] = {
	'wait': true,
	'after': ['hooks:log:start:after'],
	'start': function startPatternHook(application) {
		var transformFactories;
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

					if (this.configuration.cache && application.runtime.mode !== 'console') {
						application.cache = (0, _patternCache2['default'])(this.configuration.cache);

						if (this.configuration.cache.populate) {
							populate(application);
						}
					}

					return context$1$0.abrupt('return', this);

				case 5:
				case 'end':
					return context$1$0.stop();
			}
		}, null, this);
	}
};
module.exports = exports['default'];