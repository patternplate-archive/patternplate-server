'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = metaRouteFactory;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _qIoFs = require('q-io/fs');

var _qIoFs2 = _interopRequireDefault(_qIoFs);

var _libraryUtilitiesGetPatterns = require('../../library/utilities/get-patterns');

var _libraryUtilitiesGetPatterns2 = _interopRequireDefault(_libraryUtilitiesGetPatterns);

function metaRouteFactory(application, configuration) {
	var config = application.configuration[configuration.options.key];
	var path = (0, _path.resolve)(application.runtime.patterncwd || application.runtime.cwd, config.path);

	var patternTask = (0, _libraryUtilitiesGetPatterns2['default'])({
		'id': '.',
		'config': {
			'patterns': application.configuration.patterns,
			'transforms': application.configuration.transforms
		},
		'base': path,
		'factory': application.pattern.factory,
		'transforms': application.transforms,
		'filters': {
			'files': false,
			'transforms': false
		},
		'cacheprefix': 'meta'
	}, application.cache, false);

	return function metaRoute() {
		var patternData, patterns, setPatternInTree, tree;
		return regeneratorRuntime.async(function metaRoute$(context$2$0) {
			while (1) switch (context$2$0.prev = context$2$0.next) {
				case 0:
					setPatternInTree = function setPatternInTree(tree, path, value) {
						var node = tree;
						var currentId = '';
						while (path.length > 1) {
							var _name = path[0];
							currentId = currentId == '' ? _name : currentId + '/' + _name;

							if (!node[_name]) {
								node[_name] = {
									'type': 'folder',
									'id': currentId,
									'children': {}
								};
							}
							node = node[_name].children;
							path.shift();
						}
						node[path[0]] = value;
					};

					context$2$0.next = 3;
					return regeneratorRuntime.awrap(patternTask);

				case 3:
					patternData = context$2$0.sent;
					patterns = patternData.map(function (pattern) {
						return {
							'type': 'pattern',
							'id': pattern.id,
							'manifest': pattern.manifest
						};
					});
					tree = patterns.reduce(function (tree, pattern) {
						setPatternInTree(tree, pattern.id.split('/'), pattern);
						return tree;
					}, {});

					this.type = 'json';
					this.body = tree;

				case 8:
				case 'end':
					return context$2$0.stop();
			}
		}, null, this);
	};
}

module.exports = exports['default'];

// we only care about: id, version, name, displayName

// build a tree