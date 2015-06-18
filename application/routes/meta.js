'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = metaRouteFactory;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _qIoFs = require('q-io/fs');

var _qIoFs2 = _interopRequireDefault(_qIoFs);

function metaRouteFactory(application, configuration) {
	return function metaRoute() {
		var config, path, list, patterns;
		return regeneratorRuntime.async(function metaRoute$(context$2$0) {
			while (1) switch (context$2$0.prev = context$2$0.next) {
				case 0:
					config = application.configuration[configuration.options.key];
					path = (0, _path.resolve)(application.runtime.patterncwd || application.runtime.cwd, config.path);
					context$2$0.next = 4;
					return regeneratorRuntime.awrap(_qIoFs2['default'].listTree(path));

				case 4:
					list = context$2$0.sent;

					list = list.map(function normalizePath(item) {
						var depth = _qIoFs2['default'].split((0, _path.relative)(item, path)).length;
						return _qIoFs2['default'].join(_qIoFs2['default'].split(item).slice(depth * -1));
					});

					patterns = list.filter(function (item) {
						return (0, _path.basename)(item) === 'pattern.json';
					}).filter(function (item) {
						return !item.includes('@environments');
					}).map(function (item) {
						return _qIoFs2['default'].directory(item);
					});

					this.type = 'json';
					this.body = patterns.reduce(function reducePatterns(tree, patternPath) {
						var fragments = _qIoFs2['default'].split(patternPath);
						var sub = tree;

						fragments.forEach(function iterateFragments(fragment, index) {
							if (!(fragment in sub)) {
								sub[fragment] = index + 1 === fragments.length ? true : {};
							}
							sub = sub[fragment];
						});

						return tree;
					}, {});

				case 9:
				case 'end':
					return context$2$0.stop();
			}
		}, null, this);
	};
}

module.exports = exports['default'];