
module.exports = {
	'tasks': {
		'bundles': true,
		'patterns': true,
		'static': true,
		'cache': false
	},
  'patterns': {
		'cache': {
			'static': false
		},
    'formats': {
      'jsx': {
        'name': 'Script',
        'transforms': ['react']
      }
    }
  },
  'transforms': {
    'react': {
      'outFormat': 'js'
    }
  }
};
