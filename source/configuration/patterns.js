export default {
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
