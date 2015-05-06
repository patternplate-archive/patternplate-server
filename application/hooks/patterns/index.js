'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _requireAll = require('require-all');

var _requireAll2 = _interopRequireDefault(_requireAll);

var _path = require('path');

var _pattern = require('./pattern');

var _pattern2 = _interopRequireDefault(_pattern);

exports['default'] = {
	'wait': true,
	'after': ['hooks:log:start:after'],
	'start': function startPatternHook(application) {
		var transformFactories;
		return regeneratorRuntime.async(function startPatternHook$(context$1$0) {
			while (1) switch (context$1$0.prev = context$1$0.next) {
				case 0:
					application.pattern = { 'factory': _pattern2['default'], 'class': _pattern.Pattern };

					transformFactories = _requireAll2['default']({
						'dirname': _path.resolve(application.runtime.cwd, this.configuration.transformPath),
						'filter': /^(.*)\.(js|json)/
					});

					application.transforms = Object.keys(transformFactories).reduce(function getTransform(transforms, transformName) {
						if (transformFactories[transformName].index) {
							transforms[transformName] = transformFactories[transformName].index(application);
						}
						return transforms;
					}, {});

					return context$1$0.abrupt('return', this);

				case 4:
				case 'end':
					return context$1$0.stop();
			}
		}, null, this);
	}
};
module.exports = exports['default'];