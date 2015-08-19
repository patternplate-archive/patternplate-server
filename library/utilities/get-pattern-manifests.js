'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _qIoFs = require('q-io/fs');

var _qIoFs2 = _interopRequireDefault(_qIoFs);

var defaultManifest = {
	'version': '0.1.0',
	'build': true,
	'display': true
};

function loadManifest(path, id) {
	var content, data;
	return regeneratorRuntime.async(function loadManifest$(context$1$0) {
		while (1) switch (context$1$0.prev = context$1$0.next) {
			case 0:
				context$1$0.next = 2;
				return regeneratorRuntime.awrap(_qIoFs2['default'].read((0, _path.join)(path, id, 'pattern.json')));

			case 2:
				content = context$1$0.sent;
				data = JSON.parse(content);
				return context$1$0.abrupt('return', Object.assign({}, defaultManifest, data, { id: id }));

			case 5:
			case 'end':
				return context$1$0.stop();
		}
	}, null, this);
}

function loadPatterns(path) {
	var paths, patternIDs, manifests;
	return regeneratorRuntime.async(function loadPatterns$(context$1$0) {
		while (1) switch (context$1$0.prev = context$1$0.next) {
			case 0:
				context$1$0.next = 2;
				return regeneratorRuntime.awrap(_qIoFs2['default'].listTree(path));

			case 2:
				paths = context$1$0.sent;
				patternIDs = paths.filter(function (item) {
					return (0, _path.basename)(item) === 'pattern.json';
				}).filter(function (item) {
					return !item.includes('@environments');
				}).map(function (item) {
					return (0, _path.dirname)(item);
				}).map(function (item) {
					return _qIoFs2['default'].relativeFromDirectory(path, item);
				});
				manifests = Promise.all(patternIDs.map(function (id) {
					return loadManifest(path, id);
				}));
				context$1$0.next = 7;
				return regeneratorRuntime.awrap(manifests);

			case 7:
				return context$1$0.abrupt('return', context$1$0.sent);

			case 8:
			case 'end':
				return context$1$0.stop();
		}
	}, null, this);
}

exports['default'] = loadPatterns;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NvdXJjZS9saWJyYXJ5L3V0aWxpdGllcy9nZXQtcGF0dGVybi1tYW5pZmVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7b0JBQWlELE1BQU07O3FCQUN4QyxTQUFTOzs7O0FBRXhCLElBQU0sZUFBZSxHQUFHO0FBQ3ZCLFVBQVMsRUFBRSxPQUFPO0FBQ2xCLFFBQU8sRUFBRSxJQUFJO0FBQ2IsVUFBUyxFQUFFLElBQUk7Q0FDZixDQUFDOztBQUVGLFNBQWUsWUFBWSxDQUFFLElBQUksRUFBRSxFQUFFO0tBQ2hDLE9BQU8sRUFDUCxJQUFJOzs7OztvQ0FEWSxtQkFBRyxJQUFJLENBQUMsZ0JBQUssSUFBSSxFQUFFLEVBQUUsRUFBRSxjQUFjLENBQUMsQ0FBQzs7O0FBQXZELFdBQU87QUFDUCxRQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7d0NBQ3ZCLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLGVBQWUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUYsRUFBRSxFQUFFLENBQUM7Ozs7Ozs7Q0FDdkQ7O0FBRUQsU0FBZSxZQUFZLENBQUUsSUFBSTtLQUM1QixLQUFLLEVBRUwsVUFBVSxFQU1WLFNBQVM7Ozs7O29DQVJLLG1CQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUM7OztBQUEvQixTQUFLO0FBRUwsY0FBVSxHQUFHLEtBQUssQ0FDcEIsTUFBTSxDQUFDLFVBQUMsSUFBSTtZQUFLLG9CQUFTLElBQUksQ0FBQyxLQUFLLGNBQWM7S0FBQSxDQUFDLENBQ25ELE1BQU0sQ0FBQyxVQUFDLElBQUk7WUFBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDO0tBQUEsQ0FBQyxDQUNqRCxHQUFHLENBQUMsVUFBQyxJQUFJO1lBQUssbUJBQVEsSUFBSSxDQUFDO0tBQUEsQ0FBQyxDQUM1QixHQUFHLENBQUMsVUFBQyxJQUFJO1lBQUssbUJBQUcscUJBQXFCLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztLQUFBLENBQUM7QUFFakQsYUFBUyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxVQUFBLEVBQUU7WUFBSSxZQUFZLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQztLQUFBLENBQUMsQ0FBQzs7b0NBQzVELFNBQVM7Ozs7Ozs7Ozs7Q0FDdEI7O3FCQUVjLFlBQVkiLCJmaWxlIjoiZ2V0LXBhdHRlcm4tbWFuaWZlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcmVzb2x2ZSwgam9pbiwgZGlybmFtZSwgYmFzZW5hbWUgfSBmcm9tICdwYXRoJztcbmltcG9ydCBmcyBmcm9tICdxLWlvL2ZzJztcblxuY29uc3QgZGVmYXVsdE1hbmlmZXN0ID0ge1xuXHQndmVyc2lvbic6ICcwLjEuMCcsXG5cdCdidWlsZCc6IHRydWUsXG5cdCdkaXNwbGF5JzogdHJ1ZVxufTtcblxuYXN5bmMgZnVuY3Rpb24gbG9hZE1hbmlmZXN0IChwYXRoLCBpZCkge1xuXHRsZXQgY29udGVudCA9IGF3YWl0IGZzLnJlYWQoam9pbihwYXRoLCBpZCwgJ3BhdHRlcm4uanNvbicpKTtcblx0bGV0IGRhdGEgPSBKU09OLnBhcnNlKGNvbnRlbnQpO1xuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdE1hbmlmZXN0LCBkYXRhLCB7IGlkIH0pO1xufVxuXG5hc3luYyBmdW5jdGlvbiBsb2FkUGF0dGVybnMgKHBhdGgpIHtcblx0bGV0IHBhdGhzID0gYXdhaXQgZnMubGlzdFRyZWUocGF0aCk7XG5cblx0bGV0IHBhdHRlcm5JRHMgPSBwYXRoc1xuXHRcdC5maWx0ZXIoKGl0ZW0pID0+IGJhc2VuYW1lKGl0ZW0pID09PSAncGF0dGVybi5qc29uJylcblx0XHQuZmlsdGVyKChpdGVtKSA9PiAhaXRlbS5pbmNsdWRlcygnQGVudmlyb25tZW50cycpKVxuXHRcdC5tYXAoKGl0ZW0pID0+IGRpcm5hbWUoaXRlbSkpXG5cdFx0Lm1hcCgoaXRlbSkgPT4gZnMucmVsYXRpdmVGcm9tRGlyZWN0b3J5KHBhdGgsIGl0ZW0pKTtcblxuXHRsZXQgbWFuaWZlc3RzID0gUHJvbWlzZS5hbGwocGF0dGVybklEcy5tYXAoaWQgPT4gbG9hZE1hbmlmZXN0KHBhdGgsIGlkKSkpO1xuXHRyZXR1cm4gYXdhaXQgbWFuaWZlc3RzO1xufVxuXG5leHBvcnQgZGVmYXVsdCBsb2FkUGF0dGVybnM7XG4iXX0=