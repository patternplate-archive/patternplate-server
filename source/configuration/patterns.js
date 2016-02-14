export default {
	'path': './patterns',
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
	}
};
