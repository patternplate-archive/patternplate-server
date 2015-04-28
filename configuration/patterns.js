export default {
	'path': './patterns',
	'transformPath': './application/transforms',
	'formats': {
		'js': {
			'name': 'Script',
			'transforms': ['browserify'],
			'display': 'raw'
		},
		'less': {
			'name': 'Style',
			'transforms': ['less'],
			'display': 'transform'
		},
		'html': {
			'name': 'Markup',
			'transforms': ['react-jsx'],
			'display': 'transform'
		},
		'md': {
			'name': 'Documentation',
			'transforms': ['markdown'],
			'display': 'transform'
		},
		'json': {
			'name': 'Data',
			'display': false
		}
	},
	'types': {
		'demo': {
			'visible': false,
			'build': false,
			'expose': true
		},
		'include': {
			'visible': false,
			'build': true,
			'expose': true
		},
		'index': {
			'visible': true,
			'build': true,
			'expose': false
		}
	}
};
