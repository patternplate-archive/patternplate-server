export default {
	'path': [
		'./application/transforms',
		'./application/patternplate-server/transforms'
	],
	'markdown': {
		'inFormat': 'md',
		'outFormat': 'html'
	},
	'react': {
		'inFormat': 'jsx',
		'outFormat': 'jsx',
		'resolveDependencies': true,
		'opts': {}
	},
	'react-to-markup': {
		'inFormat': 'jsx',
		'outFormat': 'html',
		'opts': {}
	},
	'babel': {
		'inFormat': 'js',
		'outFormat': 'js',
		'opts': {}
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
				'opts': {}
			},
			'uglifyify': {
				'enabled': false,
				'opts': {
					'global': true
				}
			},
			'envify': {
				'enabled': true,
				'opts': {
					'global': true,
					'_': 'purge'
				}
			},
			'unreachable-branch-transform': {
				'enabled': false,
				'opts': {
					'global': true
				}
			}
		}
	},
	'uglify': {
		'inFormat': 'js',
		'outFormat': 'js',
		'opts': {
			'sequences': true,
			'properties': true,
			'dead_code': true,
			'drop_debugger': true,
			'unsafe': true,
			'conditionals': true,
			'comparisons': true,
			'evaluate': true,
			'booleans': true,
			'loops': true,
			'unused': true,
			'hoist_funs': true,
			'if_return': true,
			'join_vars': true,
			'cascade': true,
			'warnings': false,
			'negate_iife': true,
			'pure_getters': true,
			'drop_console': true
		}
	},
	'less': {
		'inFormat': 'less',
		'outFormat': 'css',
		'opts': {
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
					'compatibility': '*',
					'mediaMerging': true,
					'processImport': false,
					'restructuring': true,
					'shorthandCompacting': true
				}
			},
			'autoprefix': {
				'enabled': true,
				'opts': {
					'browsers': ['last 2 versions']
				}
			}
		}
	},
	'rewrite-includes': {
		'outFormat': 'less',
		'resolve': '%(outputName)s/%(patternId)s/index.%(extension)s'
	},
	'rewrite-imports': {
		'outFormat': 'js',
		'resolve': '%(outputName)s/%(patternId)s/index.%(extension)s'
	}
};
