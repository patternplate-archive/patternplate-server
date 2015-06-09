'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = indexRouteFactory;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _path = require('path');

var _qIoFs = require('q-io/fs');

var _qIoFs2 = _interopRequireDefault(_qIoFs);

var _marked = require('marked');

var _marked2 = _interopRequireDefault(_marked);

var _bluebird = require('bluebird');

function indexRouteFactory(application, configuration) {
	var markdown = (0, _bluebird.promisify)(_marked2['default']);

	return function indexRoute() {
		var routeConfig, serverConfig, base, routes, response, meta, readmePath, readme, readMeSource;
		return regeneratorRuntime.async(function indexRoute$(context$2$0) {
			while (1) switch (context$2$0.prev = context$2$0.next) {
				case 0:
					routeConfig = application.configuration.routes.enabled;
					serverConfig = application.configuration.server;
					base = 'http://' + serverConfig.host + ':' + serverConfig.port;
					routes = Object.keys(routeConfig).filter(function (routeName) {
						return routeConfig[routeName].enabled === true;
					}).map(function getRoutes(routeName) {
						return { 'name': routeName, 'path': routeConfig[routeName].path, 'uri': '' + base + '' + application.router.url(routeName) };
					});
					context$2$0.next = 6;
					return regeneratorRuntime.awrap((0, _isomorphicFetch2['default'])('' + base + '' + application.router.url('meta'), { 'headers': { 'accepty-type': 'application/json' } }));

				case 6:
					response = context$2$0.sent;
					context$2$0.next = 9;
					return regeneratorRuntime.awrap(response.json());

				case 9:
					meta = context$2$0.sent;
					readmePath = (0, _path.resolve)(application.runtime.patterncwd || application.runtime.cwd, 'patterns', 'README.md');
					readme = '';
					context$2$0.next = 14;
					return regeneratorRuntime.awrap(_qIoFs2['default'].exists(readmePath));

				case 14:
					if (!context$2$0.sent) {
						context$2$0.next = 22;
						break;
					}

					context$2$0.next = 17;
					return regeneratorRuntime.awrap(_qIoFs2['default'].read(readmePath));

				case 17:
					readMeSource = context$2$0.sent;

					readMeSource = readMeSource.toString('utf-8');
					context$2$0.next = 21;
					return regeneratorRuntime.awrap(markdown(readMeSource));

				case 21:
					readme = context$2$0.sent;

				case 22:

					this.type = 'json';
					this.body = Object.assign({}, {
						'name': application.configuration.pkg.name,
						'version': application.configuration.pkg.version,
						'environment': application.configuration.environment,
						'host': serverConfig.host,
						'port': serverConfig.port,
						'routes': routes,
						'meta': meta,
						'readme': readme
					});

				case 24:
				case 'end':
					return context$2$0.stop();
			}
		}, null, this);
	};
}

module.exports = exports['default'];