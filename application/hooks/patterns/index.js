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
	return regeneratorRuntime.async(function populate$(context$1$0) {
		while (1) switch (context$1$0.prev = context$1$0.next) {
			case 0:
				hook.log.info('Pattern cache is enabled, populating it from ' + root);
				/*let list = await fs.listTree(root, (path) => basename(path) === 'pattern.json');
    	for (let manifest of list) {
    	let patternID = await fs.relative(root, fs.directory(manifest));
    	let pattern = new Pattern(patternID, root, {}, {}, {}, cache);
    	try {
    		await pattern.read();
    	} catch (err) {
    		hook.log.warn(`Error while populating cache for ${patternID}`);
    		hook.log.error(err.stack);
    	}
    }
    	hook.log.info(`Populated pattern cache from ${root}. Size ${Math.round(cache.length / 1024)} MB at ${cache.itemCount} items.`); */

			case 1:
			case 'end':
				return context$1$0.stop();
		}
	}, null, this);
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