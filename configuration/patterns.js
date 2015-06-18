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
			'transforms': ['browserify'],
			'build': true
		},
		'less': {
			'name': 'Style',
			'transforms': ['less'],
			'build': true
		},
		'html': {
			'name': 'Markup',
			'transforms': ['react-jsx']
		},
		'jsx': {
			'name': 'Markup',
			'transforms': ['react-jsx']
		},
		'md': {
			'name': 'Documentation',
			'transforms': ['markdown']
		}
	},
	'cache': true
};
module.exports = exports['default'];