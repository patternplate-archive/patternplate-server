const routes = {
	'enabled': {
		'pattern': {
			'enabled': true,
			'path': '/pattern/:id+',
			'options': {
				'key': 'patterns',
				'maxage': 3600000
			}
		},
		'meta': {
			'enabled': true,
			'method': 'GET',
			'path': '/meta/',
			'options': {
				'key': 'patterns'
			}
		},
		'build': {
			'enabled': true,
			'method': 'GET',
			'path': '/build/:path?'
		},
		'static': {
			'enabled': true,
			'method': 'GET',
			'path': '/static/:path?'
		}
	}
};

export default routes;
