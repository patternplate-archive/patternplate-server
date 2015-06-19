'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = {
	'formats': {
		'js': {
			'name': 'Script',
			'transforms': ['browserify', 'uglify']
		}
	},
	'cache': {
		'max': 250000
	}
};
module.exports = exports['default'];