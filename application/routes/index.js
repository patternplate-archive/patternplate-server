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

var _btoa = require('btoa');

var _btoa2 = _interopRequireDefault(_btoa);

function indexRouteFactory(application, configuration) {
	var markdown = (0, _bluebird.promisify)(_marked2['default']);

	return function indexRoute() {
		var routeConfig, serverConfig, base, routes, authorization, basicAuthConfig, basicAuthCredentials, headers, response, meta, readmePath, readme, readMeSource, buildPath, buildAvailable, builds, list;
		return regeneratorRuntime.async(function indexRoute$(context$2$0) {
			while (1) switch (context$2$0.prev = context$2$0.next) {
				case 0:
					routeConfig = application.configuration.routes.enabled;
					serverConfig = application.configuration.server;
					base = 'http://' + serverConfig.host + ':' + serverConfig.port;
					routes = Object.keys(routeConfig).filter(function (routeName) {
						return routeConfig[routeName].enabled === true;
					}).map(function getRoutes(routeName) {
						return { 'name': routeName, 'path': routeConfig[routeName].path, 'uri': '' + base + application.router.url(routeName) };
					});
					authorization = this.headers.authorization;
					basicAuthConfig = application.configuration.middlewares.basicauth;

					if (basicAuthConfig && basicAuthConfig.credentials) {
						basicAuthCredentials = basicAuthConfig.credentials;

						authorization = 'Basic ' + (0, _btoa2['default'])(basicAuthCredentials.name + ':' + basicAuthCredentials.pass);
					}

					headers = Object.assign({}, {
						'accept-type': 'application/json',
						'authorization': authorization
					});
					context$2$0.next = 10;
					return regeneratorRuntime.awrap((0, _isomorphicFetch2['default'])('' + base + application.router.url('meta'), { 'headers': headers }));

				case 10:
					response = context$2$0.sent;
					context$2$0.next = 13;
					return regeneratorRuntime.awrap(response.json());

				case 13:
					meta = context$2$0.sent;
					readmePath = (0, _path.resolve)(application.runtime.patterncwd || application.runtime.cwd, 'patterns', 'README.md');
					readme = '';
					context$2$0.next = 18;
					return regeneratorRuntime.awrap(_qIoFs2['default'].exists(readmePath));

				case 18:
					if (!context$2$0.sent) {
						context$2$0.next = 26;
						break;
					}

					context$2$0.next = 21;
					return regeneratorRuntime.awrap(_qIoFs2['default'].read(readmePath));

				case 21:
					readMeSource = context$2$0.sent;

					readMeSource = readMeSource.toString('utf-8');
					context$2$0.next = 25;
					return regeneratorRuntime.awrap(markdown(readMeSource));

				case 25:
					readme = context$2$0.sent;

				case 26:
					buildPath = (0, _path.resolve)(application.runtime.patterncwd || application.runtime.cwd, 'build');
					context$2$0.next = 29;
					return regeneratorRuntime.awrap(_qIoFs2['default'].exists(buildPath));

				case 29:
					buildAvailable = context$2$0.sent;
					builds = [];

					if (!buildAvailable) {
						context$2$0.next = 37;
						break;
					}

					context$2$0.next = 34;
					return regeneratorRuntime.awrap(_qIoFs2['default'].listTree(buildPath));

				case 34:
					list = context$2$0.sent;

					list = list.filter(function (item) {
						return (0, _path.extname)(item) === '.zip';
					});

					builds = list.map(function (buildItemPath) {
						var fragments = (0, _path.basename)(buildItemPath, (0, _path.extname)(buildItemPath)).split('-');

						return {
							'path': _qIoFs2['default'].relativeFromDirectory(buildPath, buildItemPath),
							'environment': fragments[2],
							'revision': fragments[3],
							'version': fragments[1]
						};
					});

				case 37:

					this.type = 'json';
					this.body = Object.assign({}, {
						'name': application.configuration.pkg.name,
						'version': application.configuration.pkg.version,
						'environment': application.configuration.environment,
						'host': serverConfig.host,
						'port': serverConfig.port,
						'routes': routes,
						'meta': meta,
						'readme': readme,
						'builds': builds
					});

				case 39:
				case 'end':
					return context$2$0.stop();
			}
		}, null, this);
	};
}

module.exports = exports['default'];