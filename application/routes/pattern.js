'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = patternRouteFactory;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _libraryUtilitiesGetPatterns = require('../../library/utilities/get-patterns');

var _libraryUtilitiesGetPatterns2 = _interopRequireDefault(_libraryUtilitiesGetPatterns);

var _libraryUtilitiesGetWrapper = require('../../library/utilities/get-wrapper');

var _libraryUtilitiesGetWrapper2 = _interopRequireDefault(_libraryUtilitiesGetWrapper);

var _layouts = require('../layouts');

var _layouts2 = _interopRequireDefault(_layouts);

function patternRouteFactory(application, configuration) {
	var patterns = application.configuration[configuration.options.key] || {};
	var transforms = application.configuration.transforms || {};
	var config = { patterns: patterns, transforms: transforms };

	return function patternRoute() {
		var cwd, basePath, id, patternResults, base, resultName, type, extension, format, filters, result, environment, file, hostName, port, host, templateData, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, environmentName, _environment, envConfig, wrapper, blueprint, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, resultType, _result, templateKey, content, uri, templateSectionData;

		return regeneratorRuntime.async(function patternRoute$(context$2$0) {
			while (1) switch (context$2$0.prev = context$2$0.next) {
				case 0:
					cwd = application.runtime.patterncwd || application.runtime.cwd;
					basePath = (0, _path.resolve)(cwd, config.patterns.path);
					id = this.params.id;
					patternResults = undefined;
					base = undefined;
					resultName = undefined;
					type = this.accepts('text', 'json', 'html');
					extension = (0, _path.extname)(this.path);

					if (extension) {
						type = extension.slice(1);
					}

					if (extension) {
						base = (0, _path.basename)(this.path, extension);
						format = config.patterns.formats[type] || {};

						resultName = format.name || '';

						if (!resultName) {
							this['throw'](404);
						}

						id = (0, _path.dirname)(id);
					}

					filters = {
						'environments': [],
						'formats': []
					};
					context$2$0.t0 = type;
					context$2$0.next = context$2$0.t0 === 'json' ? 14 : context$2$0.t0 === 'css' ? 16 : context$2$0.t0 === 'js' ? 19 : 22;
					break;

				case 14:
					filters.environments.push('index');
					return context$2$0.abrupt('break', 23);

				case 16:
					filters.environments.push(base);
					filters.formats.push(type);
					return context$2$0.abrupt('break', 23);

				case 19:
					filters.environments.push(base);
					filters.formats.push(type);
					return context$2$0.abrupt('break', 23);

				case 22:
					// html/text
					filters.formats.push('html');

				case 23:

					if (application.cache && application.runtime.env === 'production') {
						patternResults = application.cache.get('' + id + '@' + filters.environments.join(','));
					}

					if (patternResults) {
						context$2$0.next = 34;
						break;
					}

					context$2$0.prev = 25;
					context$2$0.next = 28;
					return regeneratorRuntime.awrap((0, _libraryUtilitiesGetPatterns2['default'])(id, basePath, config, application.pattern.factory, application.transforms, filters));

				case 28:
					patternResults = context$2$0.sent;
					context$2$0.next = 34;
					break;

				case 31:
					context$2$0.prev = 31;
					context$2$0.t1 = context$2$0['catch'](25);

					this['throw'](500, context$2$0.t1);

				case 34:

					if (application.cache && application.runtime.env === 'production' && !patternResults.cached) {
						application.cache.set('' + id + '@' + filters.environments.join(','), Object.assign({}, patternResults, { 'cached': true }));

						patternResults.results.forEach(function cacheResponseItems(resp) {
							application.cache.set('' + id + '@' + filters.environments.join(','), {
								'mtime': patternResults.mtime,
								'results': [resp],
								'cached': true
							});
						});
					}

					this.set('Last-Modified', patternResults.mtime.toUTCString());
					this.set('Cache-Control', 'maxage=' + (configuration.options.maxage | 0));
					result = patternResults.results.length <= 1 ? patternResults.results[0] : patternResults.results;
					context$2$0.t2 = type;
					context$2$0.next = context$2$0.t2 === 'json' ? 41 : 42;
					break;

				case 41:
					return context$2$0.abrupt('break', 44);

				case 42:
					if (Array.isArray(result)) {
						this['throw'](404);
					}
					this.type = type;

				case 44:
					context$2$0.t3 = type;
					context$2$0.next = context$2$0.t3 === 'json' ? 47 : context$2$0.t3 === 'css' ? 49 : context$2$0.t3 === 'js' ? 49 : 55;
					break;

				case 47:
					this.body = result;
					return context$2$0.abrupt('break', 108);

				case 49:
					environment = result.results[base];

					if (!environment) {
						this['throw'](404);
					}

					file = environment[resultName];

					if (!file) {
						this['throw'](404);
					}

					this.body = file.demoBuffer || file.buffer;
					return context$2$0.abrupt('break', 108);

				case 55:
					hostName = application.configuration.server.host;
					port = application.configuration.server.port;
					host = '' + hostName + ':' + port;
					templateData = {
						'title': id,
						'style': [],
						'script': [],
						'markup': [],
						'route': function route(name, params) {
							name = name || 'pattern';

							return encodeURI(decodeURI('//' + host + '' + application.router.url(name, params)).replace(/\*|\%2B|\?/g, ''));
						}
					};
					_iteratorNormalCompletion = true;
					_didIteratorError = false;
					_iteratorError = undefined;
					context$2$0.prev = 62;
					_iterator = Object.keys(result.results)[Symbol.iterator]();

				case 64:
					if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
						context$2$0.next = 92;
						break;
					}

					environmentName = _step.value;
					_environment = result.results[environmentName];
					envConfig = result.environments[environmentName].manifest || {};
					wrapper = (0, _libraryUtilitiesGetWrapper2['default'])(envConfig['conditional-comment']);
					blueprint = { 'environment': environmentName, 'content': '', wrapper: wrapper };
					_iteratorNormalCompletion2 = true;
					_didIteratorError2 = false;
					_iteratorError2 = undefined;
					context$2$0.prev = 73;

					for (_iterator2 = Object.keys(_environment)[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						resultType = _step2.value;
						_result = _environment[resultType];
						templateKey = resultType.toLowerCase();
						content = _result.demoBuffer || _result.buffer;
						uri = '' + this.params.id + '/' + environmentName + '.' + _result.out;
						templateSectionData = Object.assign({}, blueprint, { content: content, uri: uri });

						templateData[templateKey] = Array.isArray(templateData[templateKey]) ? templateData[templateKey].concat([templateSectionData]) : [templateSectionData];
					}
					context$2$0.next = 81;
					break;

				case 77:
					context$2$0.prev = 77;
					context$2$0.t4 = context$2$0['catch'](73);
					_didIteratorError2 = true;
					_iteratorError2 = context$2$0.t4;

				case 81:
					context$2$0.prev = 81;
					context$2$0.prev = 82;

					if (!_iteratorNormalCompletion2 && _iterator2['return']) {
						_iterator2['return']();
					}

				case 84:
					context$2$0.prev = 84;

					if (!_didIteratorError2) {
						context$2$0.next = 87;
						break;
					}

					throw _iteratorError2;

				case 87:
					return context$2$0.finish(84);

				case 88:
					return context$2$0.finish(81);

				case 89:
					_iteratorNormalCompletion = true;
					context$2$0.next = 64;
					break;

				case 92:
					context$2$0.next = 98;
					break;

				case 94:
					context$2$0.prev = 94;
					context$2$0.t5 = context$2$0['catch'](62);
					_didIteratorError = true;
					_iteratorError = context$2$0.t5;

				case 98:
					context$2$0.prev = 98;
					context$2$0.prev = 99;

					if (!_iteratorNormalCompletion && _iterator['return']) {
						_iterator['return']();
					}

				case 101:
					context$2$0.prev = 101;

					if (!_didIteratorError) {
						context$2$0.next = 104;
						break;
					}

					throw _iteratorError;

				case 104:
					return context$2$0.finish(101);

				case 105:
					return context$2$0.finish(98);

				case 106:

					this.body = (0, _layouts2['default'])(templateData);
					return context$2$0.abrupt('break', 108);

				case 108:
				case 'end':
					return context$2$0.stop();
			}
		}, null, this, [[25, 31], [62, 94, 98, 106], [73, 77, 81, 89], [82,, 84, 88], [99,, 101, 105]]);
	};
}

module.exports = exports['default'];
// html/text