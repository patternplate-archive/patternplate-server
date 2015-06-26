'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _path = require('path');

var _browserify = require('browserify');

var _browserify2 = _interopRequireDefault(_browserify);

var _qIoFs = require('q-io/fs');

var _qIoFs2 = _interopRequireDefault(_qIoFs);

function scriptRouteFactory(application) {
	var browserifyConfig = application.configuration.assets.browserify || {};

	return function scriptRoute() {
		var suffix, ext, filename, relative, path, bundler;
		return regeneratorRuntime.async(function scriptRoute$(context$2$0) {
			while (1) switch (context$2$0.prev = context$2$0.next) {
				case 0:
					suffix = application.runtime.env === 'development' ? '' : 'bundle';
					ext = (0, _path.extname)(this.params.path).slice(1);
					filename = [(0, _path.basename)(this.params.path, '.' + ext), suffix, ext].filter(function (fragment) {
						return fragment;
					}).join('.');
					relative = (0, _path.dirname)(this.params.path);
					path = (0, _path.resolve)(application.runtime.cwd, 'assets', 'script', relative, filename);
					context$2$0.next = 7;
					return regeneratorRuntime.awrap(_qIoFs2['default'].exists(path));

				case 7:
					if (context$2$0.sent) {
						context$2$0.next = 9;
						break;
					}

					return context$2$0.abrupt('return');

				case 9:

					this.type = 'js';

					try {
						if (application.runtime.env === 'development') {
							bundler = (0, _browserify2['default'])(path, browserifyConfig);

							this.body = bundler.bundle();
						} else {
							this.body = (0, _fs.createReadStream)(path);
						}
					} catch (err) {
						application.log.error(err);
						this['throw'](err, 500);
					}

				case 11:
				case 'end':
					return context$2$0.stop();
			}
		}, null, this);
	};
}

exports['default'] = scriptRouteFactory;
module.exports = exports['default'];