'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = {
	'path': './patterns',
	'transformPath': ['application/transforms', 'application/patternplate-server/transforms'],
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
		'css': {
			'name': 'Style',
			'transforms': ['less'],
			'build': true
		},
		'html': {
			'name': 'Markup',
			'transforms': ['react', 'react-to-markup']
		},
		'jsx': {
			'name': 'Markup',
			'transforms': ['react', 'react-to-markup']
		},
		'md': {
			'name': 'Documentation',
			'transforms': ['markdown']
		}
	},
	'cache': {
		'populate': false,
		'read': false,
		'files': true,
		'transform': true,
		'static': false,
		'options': {
			'max': Infinity
		}
	}
};
module.exports = exports['default'];