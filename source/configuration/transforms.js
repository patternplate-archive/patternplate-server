export default {
	'path': './application/transforms',
	'markdown': {
		'inFormat': 'md',
		'outFormat': 'html'
	},
	'react-jsx': {
		'inFormat': 'jsx',
		'outFormat': 'html'
	},
	'browserify': {
		'inFormat': 'js',
		'outFormat': 'js',
		'opts': {
			'debug': true
		},
		'transforms': {
			'babelify': {
				'enabled': true,
				'opts': {
					'optional': [],
					'blacklist': [],
					'whitelist': [],
					'extensions': 'js'
				}
			},
			'uglifyify': {
				'enabled': false
			}
		}
	},
	'less': {
		'inFormat': 'less',
		'outFormat': 'css',
		'opts': {
			'ieCompat': true,
			'compress': false,
			'sourceMap': {
				'outputSourceFiles': true,
				'sourceMapFileInline': true
			}
		},
		'plugins': {
			'clean-css': {
				'enabled': false,
				'opts': {
					'advanced': true,
					'aggressiveMerging': true,
					'compatibility': 'ie8',
					'mediaMerging': true,
					'processImport': false,
					'restructuring': true,
					'shorthandCompacting': true
				}
			},
			'autoprefix': {
				'enabled': true,
				'opts': {
					'browsers': ['IE 8', 'last 2 versions']
				}
			}
		}
	}
};
