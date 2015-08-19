'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
function getWrapper(expression) {
	if (!expression) {
		return function faithfulWrapper(input) {
			return input;
		};
	}

	if (expression === '!IE') {
		return function noIEWrapper(input) {
			return '<!--[if !IE]> -->\n' + input + '\n<!-- <![endif]-->';
		};
	}

	return function IEWrapper(input) {
		return '<!--[if ' + expression + ']>\n' + input + '\n<![endif]-->';
	};
};

exports['default'] = getWrapper;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NvdXJjZS9saWJyYXJ5L3V0aWxpdGllcy9nZXQtd3JhcHBlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLFNBQVMsVUFBVSxDQUFFLFVBQVUsRUFBRTtBQUNoQyxLQUFJLENBQUMsVUFBVSxFQUFFO0FBQ2hCLFNBQU8sU0FBUyxlQUFlLENBQUUsS0FBSyxFQUFFO0FBQ3ZDLFVBQU8sS0FBSyxDQUFDO0dBQ2IsQ0FBQztFQUNGOztBQUVELEtBQUksVUFBVSxLQUFLLEtBQUssRUFBRTtBQUN6QixTQUFPLFNBQVMsV0FBVyxDQUFFLEtBQUssRUFBRTtBQUNuQyxrQ0FBNkIsS0FBSyx5QkFBc0I7R0FDeEQsQ0FBQztFQUNGOztBQUVELFFBQU8sU0FBUyxTQUFTLENBQUUsS0FBSyxFQUFFO0FBQ2pDLHNCQUFrQixVQUFVLFlBQU8sS0FBSyxvQkFBaUI7RUFDekQsQ0FBQztDQUNGLENBQUM7O3FCQUVhLFVBQVUiLCJmaWxlIjoiZ2V0LXdyYXBwZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBnZXRXcmFwcGVyIChleHByZXNzaW9uKSB7XG5cdGlmICghZXhwcmVzc2lvbikge1xuXHRcdHJldHVybiBmdW5jdGlvbiBmYWl0aGZ1bFdyYXBwZXIgKGlucHV0KSB7XG5cdFx0XHRyZXR1cm4gaW5wdXQ7XG5cdFx0fTtcblx0fVxuXG5cdGlmIChleHByZXNzaW9uID09PSAnIUlFJykge1xuXHRcdHJldHVybiBmdW5jdGlvbiBub0lFV3JhcHBlciAoaW5wdXQpIHtcblx0XHRcdHJldHVybiBgPCEtLVtpZiAhSUVdPiAtLT5cXG4ke2lucHV0fVxcbjwhLS0gPCFbZW5kaWZdLS0+YDtcblx0XHR9O1xuXHR9XG5cblx0cmV0dXJuIGZ1bmN0aW9uIElFV3JhcHBlciAoaW5wdXQpIHtcblx0XHRyZXR1cm4gYDwhLS1baWYgJHtleHByZXNzaW9ufV0+XFxuJHtpbnB1dH1cXG48IVtlbmRpZl0tLT5gO1xuXHR9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0V3JhcHBlcjtcbiJdfQ==