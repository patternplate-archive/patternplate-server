'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = {
	'opts': {
		'debug': false
	},
	'browserify': {
		'opts': {
			'debug': false
		},
		'transforms': {
			'uglifyify': {
				//'enabled': true
			}
		}
	},
	'less': {
		'opts': {
			'compress': true,
			'sourceMap': false
		},
		'plugins': {
			'clean-css': {
				'enabled': true
			}
		}
	}
};
module.exports = exports['default'];