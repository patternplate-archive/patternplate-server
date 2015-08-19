'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = metaRouteFactory;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var _path = require('path');

var _qIoFs = require('q-io/fs');

var _qIoFs2 = _interopRequireDefault(_qIoFs);

var _libraryUtilitiesGetPatternManifests = require('../../library/utilities/get-pattern-manifests');

var _libraryUtilitiesGetPatternManifests2 = _interopRequireDefault(_libraryUtilitiesGetPatternManifests);

function metaRouteFactory(application, configuration) {
	return function metaRoute() {
		var config, path, manifests, patterns, setPatternInTree, tree;
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

					config = application.configuration[configuration.options.key];
					path = (0, _path.resolve)(application.runtime.patterncwd || application.runtime.cwd, config.path);
					context$2$0.next = 5;
					return regeneratorRuntime.awrap((0, _libraryUtilitiesGetPatternManifests2['default'])(path));

				case 5:
					manifests = context$2$0.sent;
					patterns = manifests.map(function (manifest) {
						var id = manifest.id;

						var rest = _objectWithoutProperties(manifest, ['id']);

						return {
							'type': 'pattern',
							'id': id,
							'manifest': rest
						};
					});
					;

					tree = patterns.reduce(function (tree, pattern) {
						setPatternInTree(tree, pattern.id.split('/'), pattern);
						return tree;
					}, {});

					this.type = 'json';
					this.body = tree;

				case 11:
				case 'end':
					return context$2$0.stop();
			}
		}, null, this);
	};
}

module.exports = exports['default'];

// build a tree