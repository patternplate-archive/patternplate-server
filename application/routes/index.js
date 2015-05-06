'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = indexRouteFactory;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _qIoFs = require('q-io/fs');

var _qIoHttp = require('q-io/http');

var _marked = require('marked');

var _marked2 = _interopRequireDefault(_marked);

var _bluebird = require('bluebird');

function indexRouteFactory(application, configuration) {
	var markdown = _bluebird.promisify(_marked2['default']);

	return function indexRoute() {
		var routeConfig, serverConfig, baseURI, routes, metaRoute, response, meta, readmePath, readme, readMeSource;
		return regeneratorRuntime.async(function indexRoute$(context$2$0) {
			while (1) switch (context$2$0.prev = context$2$0.next) {
				case 0:
					routeConfig = application.configuration.routes.enabled;
					serverConfig = application.configuration.server;
					baseURI = 'http://' + serverConfig.host + ':' + serverConfig.port;
					routes = Object.keys(routeConfig).filter(function (routeName) {
						return routeConfig[routeName].enabled === true;
					}).map(function (routeName) {
						return { 'name': routeName, 'path': routeConfig[routeName].path, 'uri': ('' + baseURI + '' + routeConfig[routeName].path).replace('*', '') };
					});
					metaRoute = routes.filter(function (item) {
						return item.name === 'meta';
					})[0];
					context$2$0.next = 7;
					return _qIoHttp.request(metaRoute.uri);

				case 7:
					response = context$2$0.sent;
					context$2$0.next = 10;
					return response.body.read();

				case 10:
					meta = context$2$0.sent;
					readmePath = _path.resolve(application.runtime.patterncwd || application.runtime.cwd, 'patterns', 'README.md');
					readme = '';
					context$2$0.next = 15;
					return _qIoFs.exists(readmePath);

				case 15:
					if (!context$2$0.sent) {
						context$2$0.next = 23;
						break;
					}

					context$2$0.next = 18;
					return _qIoFs.read(readmePath);

				case 18:
					readMeSource = context$2$0.sent;

					readMeSource = readMeSource.toString('utf-8');
					context$2$0.next = 22;
					return markdown(readMeSource);

				case 22:
					readme = context$2$0.sent;

				case 23:

					meta = JSON.parse(meta.toString('utf-8'));

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

				case 26:
				case 'end':
					return context$2$0.stop();
			}
		}, null, this);
	};
}

module.exports = exports['default'];