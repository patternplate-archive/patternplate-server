'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = {
	'patterns': {
		'formats': {
			'js': {
				'name': 'Script',
				'transforms': ['browserify', 'uglify'],
				'build': true
			}
		}
	},
	'transforms': {
		'uglify': {
			'enabled': true
		},
		'browserify': {
			'transforms': {
				'uglifyify': {
					'enabled': true
				}
			}
		},
		'less': {
			'opts': {
				'ieCompat': true,
				'compress': true,
				'sourceMap': false
			},
			'plugins': {
				'clean-css': {
					'enabled': true
				}
			}
		}
	}
};
module.exports = exports['default'];