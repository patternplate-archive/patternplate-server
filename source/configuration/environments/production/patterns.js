export default {
	'formats': {
		'js': {
			'name': 'Script',
			'transforms': ['browserify', 'uglify']
		}
	},
	'cache': {
		'max': 250000
	}
};
