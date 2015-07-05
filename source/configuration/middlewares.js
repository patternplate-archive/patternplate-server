const middlewares = {
	'path': [
		'application/middlewares',
		'application/patternplate-server/middlewares'
	],
	'enabled': {
		'cors': true,
		'basicauth': {
			'enabled': false,
			'credentials': {
				'name': process.env.PATTERNPLATE_SERVER_BASIC_AUTH_LOGIN ||
					process.env.BOILERPLATE_SERVER_BASIC_AUTH_LOGIN ||
					process.env.NODE_BASIC_AUTH_LOGIN || 'patternplate-server',
				'pass': process.env.PATTERNPLATE_SERVER_BASIC_AUTH_PASS ||
					process.env.BOILERPLATE_SERVER_BASIC_AUTH_PASS ||
					process.env.NODE_BASIC_AUTH_PASS || 'patternplate-server'
			}
		}
	}
};

export default middlewares;
