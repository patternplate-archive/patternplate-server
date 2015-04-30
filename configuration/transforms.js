export default {
	'path': './application/transforms',

	'browserify': {
		'opts': {
			'debug': true,
			'noParse': [require.resolve('jquery')]
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
