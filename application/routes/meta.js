'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = metaRouteFactory;

var _path = require('path');

var _qIoFs = require('q-io/fs');

function metaRouteFactory(application, configuration) {
	return function metaRoute() {
		var config, path, list, patterns;
		return regeneratorRuntime.async(function metaRoute$(context$2$0) {
			while (1) switch (context$2$0.prev = context$2$0.next) {
				case 0:
					config = application.configuration[configuration.options.key];
					path = _path.resolve(application.runtime.patterncwd || application.runtime.cwd, config.path);
					context$2$0.next = 4;
					return _qIoFs.listTree(path);

				case 4:
					list = context$2$0.sent;

					list = list.map(function normalizePath(item) {
						var depth = _qIoFs.split(_path.relative(item, path)).length;

						return _qIoFs.join(_qIoFs.split(item).slice(depth * -1));
					});

					patterns = list.filter(function (item) {
						return _path.basename(item) === 'pattern.json';
					}).map(function (item) {
						return _qIoFs.directory(item);
					});

					this.type = 'json';
					this.body = patterns.reduce(function (tree, path) {
						var fragments = _qIoFs.split(path);
						var sub = tree;

						fragments.forEach(function (fragment, index) {
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