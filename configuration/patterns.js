'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = {
	'path': './patterns',
	'transformPath': './application/transforms',
	'formats': {
		'js': {
			'name': 'Script',
			'transforms': ['browserify']
		},
		'less': {
			'name': 'Style',
			'transforms': ['less']
		},
		'html': {
			'name': 'Markup',
			'transforms': ['react-jsx']
		},
		'md': {
			'name': 'Documentation',
			'transforms': ['markdown']
		},
		'json': {
			'name': 'Data'
		}
	},
	'cache': true
};
module.exports = exports['default'];