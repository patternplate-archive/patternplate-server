
module.exports = {
	'tasks': {
		'bundles': true,
		'patterns': true,
		'static': true,
		'cache': false
	},
	'resolveResultPath': function(id, resultName, formatName) {
		return [resultName, id, `index.${formatName}`];
	},
	'pkg': {
		'style': 'style'
	},
	'filters': {
		'formats': ['less', 'css', 'js', 'jsx', 'html']
	},
	'patterns': {
		'cache': {
			'static': false
		},
		'formats': {
			'jsx': {
				'name': 'component',
				'transforms': ['react', 'rewrite-imports']
			},
			'html': {
				'name': 'component',
				'transforms': ['react', 'rewrite-imports']
			},
			'js': {
				'name': 'script',
				'transforms': ['babel', 'rewrite-imports']
			},
			'less': {
				'name': 'style',
				'transforms': ['rewrite-includes']
			},
			'css': {
				'name': 'style',
				'transforms': ['rewrite-includes']
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
		},
		'rewrite-includes': {
			'outFormat': 'less'
		},
		'rewrite-imports': {
			'outFormat': 'js'
		}
	}
};
