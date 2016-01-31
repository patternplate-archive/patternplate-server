module.exports = {
	'tasks': {
		'bundles': true,
		'patterns': true,
		'static': true,
		'cache': false
	},
	'resolve': '%(outputName)s/%(patternId)s/index.%(extension)s',
	'pkg': {
		'style': 'style'
	},
	'filters': {
		'inFormats': ['less', 'css', 'js', 'jsx', 'html', 'md'],
		'baseNames': ['index']
	},
	'patterns': {
		'cache': {
			'static': false
		},
		'formats': {
			'jsx': {
				'name': 'component',
				'transforms': ['react', 'rewrite-imports'],
				'dependencies': ['react']
			},
			'html': {
				'name': 'component',
				'transforms': ['react', 'rewrite-imports'],
				'dependencies': ['react']
			},
			'js': {
				'name': 'script',
				'transforms': ['babel', 'rewrite-imports']
			},
			'less': {
				'name': 'style',
				'transforms': ['rewrite-includes'],
				'dependencies': [
					'less',
					'less-plugin-npm-import'
				]
			},
			'css': {
				'name': 'style',
				'transforms': ['rewrite-includes'],
				'dependencies': [
					'less',
					'less-plugin-npm-import'
				]
			},
			'md': {
				'name': 'documentation',
				'transforms': []
			}
		}
	},
	'transforms': {
		'react': {
			'outFormat': 'js',
			'resolveDependencies': false
		}
	}
};
