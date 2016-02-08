export default {
	'tasks': {
		'bundles': true,
		'patterns': true,
		'static': true,
		'cache': false
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
