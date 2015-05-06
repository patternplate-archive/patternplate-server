const routes = {
	'enabled': {
		'pattern': {
			'enabled': true,
			'method': 'GET',
			'path': '/pattern/*',
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
		}
	}
};

export default routes;
