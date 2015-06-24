'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _path = require('path');

var routes = {
	'enabled': {
		'index': {
			'enabled': true,
			'path': '/'
		},
		'meta': {
			'enabled': true,
			'path': '/meta/',
			'options': {
				'key': 'patterns'
			}
		},
		'pattern': {
			'enabled': true,
			'path': '/pattern/:id+',
			'options': {
				'key': 'patterns',
				'maxage': 3600000
			}
		},
		'demo': {
			'enabled': true,
			'path': '/demo/:id+'
		},
		'build': {
			'enabled': true,
			'path': '/build/:path+'
		},
		'static': {
			'options': {
				'root': [(0, _path.resolve)(__dirname, '../', 'static'), (0, _path.resolve)(process.cwd(), 'static')]
			}
		}
	}
};

exports['default'] = routes;
module.exports = exports['default'];