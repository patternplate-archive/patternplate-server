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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NvdXJjZS9hcHBsaWNhdGlvbi9yb3V0ZXMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7cUJBUXdCLGlCQUFpQjs7OzsrQkFSdkIsa0JBQWtCOzs7O29CQUVnQixNQUFNOztxQkFDM0MsU0FBUzs7OztzQkFDTCxRQUFROzs7O3dCQUNILFVBQVU7O29CQUNqQixNQUFNOzs7O0FBRVIsU0FBUyxpQkFBaUIsQ0FBRSxXQUFXLEVBQUUsYUFBYSxFQUFFO0FBQ3RFLEtBQU0sUUFBUSxHQUFHLDZDQUFpQixDQUFDOztBQUVuQyxRQUFPLFNBQWUsVUFBVTtNQUMzQixXQUFXLEVBQ1gsWUFBWSxFQUNaLElBQUksRUFFSixNQUFNLEVBTU4sYUFBYSxFQUNiLGVBQWUsRUFHZCxvQkFBb0IsRUFJckIsT0FBTyxFQUtQLFFBQVEsRUFDUixJQUFJLEVBRUosVUFBVSxFQUNWLE1BQU0sRUFHTCxZQUFZLEVBS2IsU0FBUyxFQUNULGNBQWMsRUFDZCxNQUFNLEVBR0wsSUFBSTs7OztBQXhDTCxnQkFBVyxHQUFHLFdBQVcsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLE9BQU87QUFDdEQsaUJBQVksR0FBRyxXQUFXLENBQUMsYUFBYSxDQUFDLE1BQU07QUFDL0MsU0FBSSxlQUFhLFlBQVksQ0FBQyxJQUFJLFNBQUksWUFBWSxDQUFDLElBQUk7QUFFdkQsV0FBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQ25DLE1BQU0sQ0FBQyxVQUFDLFNBQVM7YUFBSyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxLQUFLLElBQUk7TUFBQSxDQUFDLENBQzlELEdBQUcsQ0FBQyxTQUFTLFNBQVMsQ0FBRSxTQUFTLEVBQUU7QUFDbkMsYUFBTyxFQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxPQUFLLElBQUksR0FBRyxXQUFXLENBQUMsTUFB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QUFFLFlBQVksQ0FBQyxJQUFJO0FBQ3pCLGNBQVEsRUFBRSxNQUFNO0FBQ2hCLFlBQU0sRUFBRSxJQUFJO0FBQ1osY0FBUSxFQUFFLE1BQU07QUFDaEIsY0FBUSxFQUFFLE1BQU07TUFDaEIsQ0FBQyxDQUFDOzs7Ozs7O0VBQ0gsQ0FBQztDQUNGIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZldGNoIGZyb20gJ2lzb21vcnBoaWMtZmV0Y2gnO1xuXG5pbXBvcnQge3Jlc29sdmUsIG5vcm1hbGl6ZSwgYmFzZW5hbWUsIGV4dG5hbWV9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IGZzIGZyb20gJ3EtaW8vZnMnO1xuaW1wb3J0IG1hcmtlZCBmcm9tICdtYXJrZWQnO1xuaW1wb3J0IHtwcm9taXNpZnl9IGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCBidG9hIGZyb20gJ2J0b2EnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpbmRleFJvdXRlRmFjdG9yeSAoYXBwbGljYXRpb24sIGNvbmZpZ3VyYXRpb24pIHtcblx0Y29uc3QgbWFya2Rvd24gPSBwcm9taXNpZnkobWFya2VkKTtcblxuXHRyZXR1cm4gYXN5bmMgZnVuY3Rpb24gaW5kZXhSb3V0ZSAoKSB7XG5cdFx0bGV0IHJvdXRlQ29uZmlnID0gYXBwbGljYXRpb24uY29uZmlndXJhdGlvbi5yb3V0ZXMuZW5hYmxlZDtcblx0XHRsZXQgc2VydmVyQ29uZmlnID0gYXBwbGljYXRpb24uY29uZmlndXJhdGlvbi5zZXJ2ZXI7XG5cdFx0bGV0IGJhc2UgPSBgaHR0cDovLyR7c2VydmVyQ29uZmlnLmhvc3R9OiR7c2VydmVyQ29uZmlnLnBvcnR9YDtcblxuXHRcdGxldCByb3V0ZXMgPSBPYmplY3Qua2V5cyhyb3V0ZUNvbmZpZylcblx0XHRcdC5maWx0ZXIoKHJvdXRlTmFtZSkgPT4gcm91dGVDb25maWdbcm91dGVOYW1lXS5lbmFibGVkID09PSB0cnVlKVxuXHRcdFx0Lm1hcChmdW5jdGlvbiBnZXRSb3V0ZXMgKHJvdXRlTmFtZSkge1xuXHRcdFx0XHRyZXR1cm4geyduYW1lJzogcm91dGVOYW1lLCAncGF0aCc6IHJvdXRlQ29uZmlnW3JvdXRlTmFtZV0ucGF0aCwgJ3VyaSc6IGAke2Jhc2V9JHthcHBsaWNhdGlvbi5yb3V0ZXIudXJsKHJvdXRlTmFtZSl9YH07XG5cdFx0XHR9KTtcblxuXHRcdGxldCBhdXRob3JpemF0aW9uID0gdGhpcy5oZWFkZXJzLmF1dGhvcml6YXRpb247XG5cdFx0bGV0IGJhc2ljQXV0aENvbmZpZyA9IGFwcGxpY2F0aW9uLmNvbmZpZ3VyYXRpb24ubWlkZGxld2FyZXMuYmFzaWNhdXRoO1xuXG5cdFx0aWYgKGJhc2ljQXV0aENvbmZpZyAmJiBiYXNpY0F1dGhDb25maWcuY3JlZGVudGlhbHMpIHtcblx0XHRcdGxldCBiYXNpY0F1dGhDcmVkZW50aWFscyA9IGJhc2ljQXV0aENvbmZpZy5jcmVkZW50aWFscztcblx0XHRcdGF1dGhvcml6YXRpb24gPSBgQmFzaWMgJHtidG9hKGAke2Jhc2ljQXV0aENyZWRlbnRpYWxzLm5hbWV9OiR7YmFzaWNBdXRoQ3JlZGVudGlhbHMucGFzc31gKX1gO1xuXHRcdH1cblxuXHRcdGxldCBoZWFkZXJzID0gT2JqZWN0LmFzc2lnbih7fSwge1xuXHRcdFx0J2FjY2VwdC10eXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuXHRcdFx0J2F1dGhvcml6YXRpb24nOiBhdXRob3JpemF0aW9uXG5cdFx0fSk7XG5cblx0XHRsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHtiYXNlfSR7YXBwbGljYXRpb24ucm91dGVyLnVybCgnbWV0YScpfWAsIHsnaGVhZGVycyc6IGhlYWRlcnN9KTtcblx0XHRsZXQgbWV0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcblxuXHRcdGxldCByZWFkbWVQYXRoID0gcmVzb2x2ZShhcHBsaWNhdGlvbi5ydW50aW1lLnBhdHRlcm5jd2QgfHwgYXBwbGljYXRpb24ucnVudGltZS5jd2QsICdwYXR0ZXJucycsICdSRUFETUUubWQnKTtcblx0XHR2YXIgcmVhZG1lID0gJyc7XG5cblx0XHRpZiAoYXdhaXQgZnMuZXhpc3RzKHJlYWRtZVBhdGgpKSB7XG5cdFx0XHRsZXQgcmVhZE1lU291cmNlID0gYXdhaXQgZnMucmVhZChyZWFkbWVQYXRoKTtcblx0XHRcdHJlYWRNZVNvdXJjZSA9IHJlYWRNZVNvdXJjZS50b1N0cmluZygndXRmLTgnKTtcblx0XHRcdHJlYWRtZSA9IGF3YWl0IG1hcmtkb3duKHJlYWRNZVNvdXJjZSk7XG5cdFx0fVxuXG5cdFx0bGV0IGJ1aWxkUGF0aCA9IHJlc29sdmUoYXBwbGljYXRpb24ucnVudGltZS5wYXR0ZXJuY3dkIHx8IGFwcGxpY2F0aW9uLnJ1bnRpbWUuY3dkLCAnYnVpbGQnKTtcblx0XHRsZXQgYnVpbGRBdmFpbGFibGUgPSBhd2FpdCBmcy5leGlzdHMoYnVpbGRQYXRoKTtcblx0XHRsZXQgYnVpbGRzID0gW107XG5cblx0XHRpZiAoYnVpbGRBdmFpbGFibGUpIHtcblx0XHRcdGxldCBsaXN0ID0gYXdhaXQgZnMubGlzdFRyZWUoYnVpbGRQYXRoKTtcblxuXHRcdFx0bGlzdCA9IGxpc3QuZmlsdGVyKChpdGVtKSA9PiBleHRuYW1lKGl0ZW0pID09PSAnLnppcCcpO1xuXG5cdFx0XHRidWlsZHMgPSBsaXN0Lm1hcCgoYnVpbGRJdGVtUGF0aCkgPT4ge1xuXHRcdFx0XHRsZXQgZnJhZ21lbnRzID0gYmFzZW5hbWUoYnVpbGRJdGVtUGF0aCwgZXh0bmFtZShidWlsZEl0ZW1QYXRoKSkuc3BsaXQoJy0nKTtcblxuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdCdwYXRoJzogZnMucmVsYXRpdmVGcm9tRGlyZWN0b3J5KGJ1aWxkUGF0aCwgYnVpbGRJdGVtUGF0aCksXG5cdFx0XHRcdFx0J2Vudmlyb25tZW50JzogZnJhZ21lbnRzWzJdLFxuXHRcdFx0XHRcdCdyZXZpc2lvbic6IGZyYWdtZW50c1szXSxcblx0XHRcdFx0XHQndmVyc2lvbic6IGZyYWdtZW50c1sxXVxuXHRcdFx0XHR9O1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0dGhpcy50eXBlID0gJ2pzb24nO1xuXHRcdHRoaXMuYm9keSA9IE9iamVjdC5hc3NpZ24oe30sIHtcblx0XHRcdCduYW1lJzogYXBwbGljYXRpb24uY29uZmlndXJhdGlvbi5wa2cubmFtZSxcblx0XHRcdCd2ZXJzaW9uJzogYXBwbGljYXRpb24uY29uZmlndXJhdGlvbi5wa2cudmVyc2lvbixcblx0XHRcdCdlbnZpcm9ubWVudCc6IGFwcGxpY2F0aW9uLmNvbmZpZ3VyYXRpb24uZW52aXJvbm1lbnQsXG5cdFx0XHQnaG9zdCc6IHNlcnZlckNvbmZpZy5ob3N0LFxuXHRcdFx0J3BvcnQnOiBzZXJ2ZXJDb25maWcucG9ydCxcblx0XHRcdCdyb3V0ZXMnOiByb3V0ZXMsXG5cdFx0XHQnbWV0YSc6IG1ldGEsXG5cdFx0XHQncmVhZG1lJzogcmVhZG1lLFxuXHRcdFx0J2J1aWxkcyc6IGJ1aWxkc1xuXHRcdH0pO1xuXHR9O1xufVxuIl19