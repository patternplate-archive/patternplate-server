'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = createReactRendererFactory;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _pascalCase = require('pascal-case');

var _pascalCase2 = _interopRequireDefault(_pascalCase);

var _babelCore = require('babel-core');

var _react = require('react');

var React = _interopRequireWildcard(_react);

function createReactRendererFactory(application) {
	var config = application.configuration.transforms['react-to-markup'] || {};

	return function renderReactComponent(file, demo) {
		return regeneratorRuntime.async(function renderReactComponent$(context$2$0) {
			while (1) switch (context$2$0.prev = context$2$0.next) {
				case 0:
					file.buffer = renderMarkup(file.buffer.toString('utf-8'));
					if (file.demoBuffer) {
						file.demoBuffer = renderMarkup(file.demoBuffer.toString('utf-8'));
					}
					file['in'] = config.inFormat;
					file.out = config.outFormat;
					return context$2$0.abrupt('return', file);

				case 5:
				case 'end':
					return context$2$0.stop();
			}
		}, null, this);
	};
}

function renderMarkup(source) {
	// Convert to es5...
	var result = (0, _babelCore.transform)(source, {});

	// ...then 'require' module...
	var moduleScope = { exports: {} };
	var fn = new Function('module', 'exports', 'require', result.code);
	fn(moduleScope, moduleScope.exports, require);

	// ...finally render markup
	return React.renderToStaticMarkup(React.createElement(moduleScope.exports));
}
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NvdXJjZS9hcHBsaWNhdGlvbi90cmFuc2Zvcm1zL3JlYWN0LXRvLW1hcmt1cC9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztxQkFLd0IsMEJBQTBCOzs7Ozs7b0JBTC9CLE1BQU07OzBCQUNGLGFBQWE7Ozs7eUJBQ1osWUFBWTs7cUJBQ2IsT0FBTzs7SUFBbEIsS0FBSzs7QUFFRixTQUFTLDBCQUEwQixDQUFDLFdBQVcsRUFBRTtBQUMvRCxLQUFNLE1BQU0sR0FBRyxXQUFXLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7QUFFN0UsUUFBTyxTQUFlLG9CQUFvQixDQUFDLElBQUksRUFBRSxJQUFJOzs7O0FBQ3BELFNBQUksQ0FBQyxNQUFNLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDMUQsU0FBSSxJQUFJLENBQUMsVUFBVSxFQUFFO0FBQ3BCLFVBQUksQ0FBQyxVQUFVLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUE7TUFDakU7QUFDRCxTQUFJLE1BQUcsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO0FBQzFCLFNBQUksQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQzt5Q0FDckIsSUFBSTs7Ozs7OztFQUNYLENBQUE7Q0FDRDs7QUFFRCxTQUFTLFlBQVksQ0FBQyxNQUFNLEVBQUU7O0FBRTdCLEtBQUksTUFBTSxHQUFHLDBCQUFVLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQzs7O0FBR25DLEtBQUksV0FBVyxHQUFHLEVBQUMsT0FBTyxFQUFDLEVBQUUsRUFBQyxDQUFDO0FBQy9CLEtBQUksRUFBRSxHQUFHLElBQUksUUFBUSxDQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNuRSxHQUFFLENBQUMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7OztBQUc5QyxRQUFPLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0NBQzVFIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtqb2lufSBmcm9tICdwYXRoJztcbmltcG9ydCBwYXNjYWxDYXNlIGZyb20gJ3Bhc2NhbC1jYXNlJztcbmltcG9ydCB7dHJhbnNmb3JtfSBmcm9tICdiYWJlbC1jb3JlJztcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlUmVhY3RSZW5kZXJlckZhY3RvcnkoYXBwbGljYXRpb24pIHtcblx0Y29uc3QgY29uZmlnID0gYXBwbGljYXRpb24uY29uZmlndXJhdGlvbi50cmFuc2Zvcm1zWydyZWFjdC10by1tYXJrdXAnXSB8fCB7fTtcblxuXHRyZXR1cm4gYXN5bmMgZnVuY3Rpb24gcmVuZGVyUmVhY3RDb21wb25lbnQoZmlsZSwgZGVtbykge1xuXHRcdGZpbGUuYnVmZmVyID0gcmVuZGVyTWFya3VwKGZpbGUuYnVmZmVyLnRvU3RyaW5nKCd1dGYtOCcpKTtcblx0XHRpZiAoZmlsZS5kZW1vQnVmZmVyKSB7XG5cdFx0XHRmaWxlLmRlbW9CdWZmZXIgPSByZW5kZXJNYXJrdXAoZmlsZS5kZW1vQnVmZmVyLnRvU3RyaW5nKCd1dGYtOCcpKVxuXHRcdH1cblx0XHRmaWxlLmluID0gY29uZmlnLmluRm9ybWF0O1xuXHRcdGZpbGUub3V0ID0gY29uZmlnLm91dEZvcm1hdDtcblx0XHRyZXR1cm4gZmlsZTtcblx0fVxufVxuXG5mdW5jdGlvbiByZW5kZXJNYXJrdXAoc291cmNlKSB7XG5cdC8vIENvbnZlcnQgdG8gZXM1Li4uXG5cdGxldCByZXN1bHQgPSB0cmFuc2Zvcm0oc291cmNlLCB7fSk7XG5cblx0Ly8gLi4udGhlbiAncmVxdWlyZScgbW9kdWxlLi4uXG5cdGxldCBtb2R1bGVTY29wZSA9IHtleHBvcnRzOnt9fTtcblx0bGV0IGZuID0gbmV3IEZ1bmN0aW9uKCdtb2R1bGUnLCAnZXhwb3J0cycsICdyZXF1aXJlJywgcmVzdWx0LmNvZGUpO1xuXHRmbihtb2R1bGVTY29wZSwgbW9kdWxlU2NvcGUuZXhwb3J0cywgcmVxdWlyZSk7XG5cblx0Ly8gLi4uZmluYWxseSByZW5kZXIgbWFya3VwXG5cdHJldHVybiBSZWFjdC5yZW5kZXJUb1N0YXRpY01hcmt1cChSZWFjdC5jcmVhdGVFbGVtZW50KG1vZHVsZVNjb3BlLmV4cG9ydHMpKTtcbn1cbiJdfQ==