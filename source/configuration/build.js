export default {
	'tasks': {
		'bundles': true,
		'patterns': true,
		'commonjs': false,
		'static': true,
		'cache': false,
		'archive': true
	},
	'patterns': {
		'cache': {
			'static': false
		}
	},
	transforms: {
		less: {
			opts: {
				sourceMap: {
					outputSourceFiles: false,
					sourceMapFileInline: false
				}
			}
		},
		browserify: {
			opts: {
				debug: false
			}
		}
	}
};
