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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NvdXJjZS9hcHBsaWNhdGlvbi9yb3V0ZXMvbWV0YS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztxQkFJd0IsZ0JBQWdCOzs7Ozs7b0JBSkUsTUFBTTs7cUJBQ2pDLFNBQVM7Ozs7bURBQ1EsK0NBQStDOzs7O0FBRWhFLFNBQVMsZ0JBQWdCLENBQUUsV0FBVyxFQUFFLGFBQWEsRUFBRTtBQUNyRSxRQUFPLFNBQWUsU0FBUztNQUMxQixNQUFNLEVBQ04sSUFBSSxFQUVKLFNBQVMsRUFFVCxRQUFRLEVBV0gsZ0JBQWdCLEVBb0JyQixJQUFJOzs7O0FBcEJDLHFCQUFnQixZQUFoQixnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUM1QyxVQUFJLElBQUksR0FBRyxJQUFJLENBQUM7QUFDaEIsVUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFDO0FBQ25CLGFBQU8sSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDdkIsV0FBSSxLQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25CLGdCQUFTLEdBQUcsQUFBQyxTQUFTLElBQUksRUFBRSxHQUFJLEtBQUksR0FBSSxTQUFTLEdBQUcsR0FBRyxHQUFHLEtBQUksQUFBQyxDQUFDOztBQUVoRSxXQUFJLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxFQUFFO0FBQ2hCLFlBQUksQ0FBQyxLQUFJLENBQUMsR0FBRztBQUNaLGVBQU0sRUFBRSxRQUFRO0FBQ2hCLGFBQUksRUFBRSxTQUFTO0FBQ2YsbUJBQVUsRUFBRSxFQUFFO1NBQ2QsQ0FBQztRQUNGO0FBQ0QsV0FBSSxHQUFHLElBQUksQ0FBQyxLQUFJLENBQUMsQ0FBQyxRQUFRLENBQUM7QUFDM0IsV0FBSSxDQUFDLEtBQUssRUFBRSxDQUFDO09BQ2I7QUFDRCxVQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO01BQ3RCOztBQWxDRyxXQUFNLEdBQUcsV0FBVyxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQztBQUM3RCxTQUFJLEdBQUcsbUJBQVEsV0FBVyxDQUFDLE9BQU8sQ0FBQyxVQUFVLElBQUksV0FBVyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQzs7cUNBRXBFLHNEQUFvQixJQUFJLENBQUM7OztBQUEzQyxjQUFTO0FBRVQsYUFBUSxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBQSxRQUFRLEVBQUk7VUFDbEMsRUFBRSxHQUFjLFFBQVEsQ0FBeEIsRUFBRTs7VUFBSyxJQUFJLDRCQUFLLFFBQVE7O0FBRTlCLGFBQU87QUFDTixhQUFNLEVBQUUsU0FBUztBQUNqQixXQUFJLEVBQUUsRUFBRTtBQUNSLGlCQUFVLEVBQUUsSUFBSTtPQUNoQixDQUFDO01BQ0YsQ0FBQztBQXFCRCxNQUFDOztBQUVFLFNBQUksR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQUMsSUFBSSxFQUFFLE9BQU8sRUFBSztBQUM3QyxzQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDdkQsYUFBTyxJQUFJLENBQUM7TUFDWixFQUFFLEVBQUUsQ0FBQzs7QUFFTixTQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQztBQUNuQixTQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQzs7Ozs7OztFQUNqQixDQUFDO0NBQ0YiLCJmaWxlIjoibWV0YS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7cmVzb2x2ZSwgcmVsYXRpdmUsIGJhc2VuYW1lfSBmcm9tICdwYXRoJztcbmltcG9ydCBmcyBmcm9tICdxLWlvL2ZzJztcbmltcG9ydCBnZXRQYXR0ZXJuTWFuaWZlc3RzIGZyb20gJy4uLy4uL2xpYnJhcnkvdXRpbGl0aWVzL2dldC1wYXR0ZXJuLW1hbmlmZXN0cyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1ldGFSb3V0ZUZhY3RvcnkgKGFwcGxpY2F0aW9uLCBjb25maWd1cmF0aW9uKSB7XG5cdHJldHVybiBhc3luYyBmdW5jdGlvbiBtZXRhUm91dGUgKCkge1xuXHRcdGxldCBjb25maWcgPSBhcHBsaWNhdGlvbi5jb25maWd1cmF0aW9uW2NvbmZpZ3VyYXRpb24ub3B0aW9ucy5rZXldO1xuXHRcdGxldCBwYXRoID0gcmVzb2x2ZShhcHBsaWNhdGlvbi5ydW50aW1lLnBhdHRlcm5jd2QgfHwgYXBwbGljYXRpb24ucnVudGltZS5jd2QsIGNvbmZpZy5wYXRoKTtcblxuXHRcdGxldCBtYW5pZmVzdHMgPSBhd2FpdCBnZXRQYXR0ZXJuTWFuaWZlc3RzKHBhdGgpO1xuXG5cdFx0bGV0IHBhdHRlcm5zID0gbWFuaWZlc3RzLm1hcChtYW5pZmVzdCA9PiB7XG5cdFx0XHRsZXQgeyBpZCwgLi4ucmVzdCB9ID0gbWFuaWZlc3Q7XG5cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdCd0eXBlJzogJ3BhdHRlcm4nLFxuXHRcdFx0XHQnaWQnOiBpZCxcblx0XHRcdFx0J21hbmlmZXN0JzogcmVzdFxuXHRcdFx0fTtcblx0XHR9KTtcblxuXHRcdC8vIGJ1aWxkIGEgdHJlZVxuXHRcdGZ1bmN0aW9uIHNldFBhdHRlcm5JblRyZWUodHJlZSwgcGF0aCwgdmFsdWUpIHtcblx0XHRcdGxldCBub2RlID0gdHJlZTtcblx0XHRcdGxldCBjdXJyZW50SWQgPSAnJztcblx0XHRcdHdoaWxlIChwYXRoLmxlbmd0aCA+IDEpIHtcblx0XHRcdFx0bGV0IG5hbWUgPSBwYXRoWzBdO1xuXHRcdFx0XHRjdXJyZW50SWQgPSAoY3VycmVudElkID09ICcnKSA/IG5hbWUgOiAoY3VycmVudElkICsgJy8nICsgbmFtZSk7XG5cblx0XHRcdFx0aWYgKCFub2RlW25hbWVdKSB7XG5cdFx0XHRcdFx0bm9kZVtuYW1lXSA9IHtcblx0XHRcdFx0XHRcdCd0eXBlJzogJ2ZvbGRlcicsXG5cdFx0XHRcdFx0XHQnaWQnOiBjdXJyZW50SWQsXG5cdFx0XHRcdFx0XHQnY2hpbGRyZW4nOiB7fVxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH1cblx0XHRcdFx0bm9kZSA9IG5vZGVbbmFtZV0uY2hpbGRyZW47XG5cdFx0XHRcdHBhdGguc2hpZnQoKTtcblx0XHRcdH1cblx0XHRcdG5vZGVbcGF0aFswXV0gPSB2YWx1ZTtcblx0XHR9O1xuXG5cdFx0bGV0IHRyZWUgPSBwYXR0ZXJucy5yZWR1Y2UoKHRyZWUsIHBhdHRlcm4pID0+IHtcblx0XHRcdHNldFBhdHRlcm5JblRyZWUodHJlZSwgcGF0dGVybi5pZC5zcGxpdCgnLycpLCBwYXR0ZXJuKTtcblx0XHRcdHJldHVybiB0cmVlO1xuXHRcdH0sIHt9KTtcblxuXHRcdHRoaXMudHlwZSA9ICdqc29uJztcblx0XHR0aGlzLmJvZHkgPSB0cmVlO1xuXHR9O1xufVxuIl19