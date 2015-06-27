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
		var cwd, basePath, id, base, resultName, type, extension, format, filters, patternResults, patternConfig, result, environment, file, hostName, port, host, prefix, templateData, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, environmentName, _environment, envConfig, wrapper, blueprint, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, resultType, _result, templateKey, content, uri, templateSectionData;

		return regeneratorRuntime.async(function patternRoute$(context$2$0) {
			var _this = this;

			while (1) switch (context$2$0.prev = context$2$0.next) {
				case 0:
					cwd = application.runtime.patterncwd || application.runtime.cwd;
					basePath = (0, _path.resolve)(cwd, config.patterns.path);
					id = this.params.id;
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
					context$2$0.next = context$2$0.t0 === 'json' ? 13 : context$2$0.t0 === 'css' ? 15 : context$2$0.t0 === 'js' ? 18 : 21;
					break;

				case 13:
					filters.environments.push('index');
					return context$2$0.abrupt('break', 23);

				case 15:
					filters.environments.push(base);
					filters.formats.push(type);
					return context$2$0.abrupt('break', 23);

				case 18:
					filters.environments.push(base);
					filters.formats.push(type);
					return context$2$0.abrupt('break', 23);

				case 21:
					// html/text
					filters.formats.push(type);
					return context$2$0.abrupt('break', 23);

				case 23:
					patternResults = undefined;
					context$2$0.prev = 24;
					patternConfig = {
						id: id, config: config, filters: filters,
						'base': basePath,
						'factory': application.pattern.factory,
						'transforms': application.transforms,
						'log': function log() {
							var _application$log;

							for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
								args[_key] = arguments[_key];
							}

							(_application$log = application.log).silly.apply(_application$log, ['[routes:pattern:getpattern]'].concat(args));
						}
					};
					context$2$0.next = 28;
					return regeneratorRuntime.awrap((0, _libraryUtilitiesGetPatterns2['default'])(patternConfig, application.cache));

				case 28:
					patternResults = context$2$0.sent;
					context$2$0.next = 34;
					break;

				case 31:
					context$2$0.prev = 31;
					context$2$0.t1 = context$2$0['catch'](24);

					this['throw'](500, context$2$0.t1);

				case 34:

					patternResults = patternResults || [];
					result = patternResults.length === 1 ? patternResults[0] : patternResults;

					this.type = type;

					context$2$0.t2 = type;
					context$2$0.next = context$2$0.t2 === 'json' ? 40 : context$2$0.t2 === 'css' ? 42 : context$2$0.t2 === 'js' ? 42 : 48;
					break;

				case 40:
					this.body = result;
					return context$2$0.abrupt('break', 102);

				case 42:
					environment = result.results[base];

					if (!environment) {
						this['throw'](404);
					}

					file = environment[resultName];

					if (!file) {
						this['throw'](404);
					}

					this.body = file.demoBuffer || file.buffer;
					return context$2$0.abrupt('break', 102);

				case 48:
					hostName = application.configuration.server.host;
					port = application.configuration.server.port;
					host = '' + hostName + ':' + port;
					prefix = '';
					templateData = {
						'title': id,
						'style': [],
						'script': [],
						'markup': [],
						'route': function route(name, params) {
							name = name || 'pattern';
							var route = application.router.url(name, params);

							if (_this.host !== host) {
								host = '' + _this.host;
							}

							if (route.indexOf('/api') < 0) {
								prefix = '/api';
							}

							var url = [host, prefix, route].filter(function (item) {
								return item;
							}).map(function (item) {
								return decodeURI(item).replace(/\*|\%2B|\?/g, '');
							});
							return encodeURI('//' + url.join(''));
						}
					};
					_iteratorNormalCompletion = true;
					_didIteratorError = false;
					_iteratorError = undefined;
					context$2$0.prev = 56;
					_iterator = Object.keys(result.results)[Symbol.iterator]();

				case 58:
					if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
						context$2$0.next = 86;
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
					context$2$0.prev = 67;

					for (_iterator2 = Object.keys(_environment)[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						resultType = _step2.value;
						_result = _environment[resultType];
						templateKey = resultType.toLowerCase();
						content = _result.demoBuffer || _result.buffer;
						uri = '' + this.params.id + '/' + environmentName + '.' + _result.out;
						templateSectionData = Object.assign({}, blueprint, { content: content, uri: uri });

						templateData[templateKey] = Array.isArray(templateData[templateKey]) ? templateData[templateKey].concat([templateSectionData]) : [templateSectionData];
					}
					context$2$0.next = 75;
					break;

				case 71:
					context$2$0.prev = 71;
					context$2$0.t3 = context$2$0['catch'](67);
					_didIteratorError2 = true;
					_iteratorError2 = context$2$0.t3;

				case 75:
					context$2$0.prev = 75;
					context$2$0.prev = 76;

					if (!_iteratorNormalCompletion2 && _iterator2['return']) {
						_iterator2['return']();
					}

				case 78:
					context$2$0.prev = 78;

					if (!_didIteratorError2) {
						context$2$0.next = 81;
						break;
					}

					throw _iteratorError2;

				case 81:
					return context$2$0.finish(78);

				case 82:
					return context$2$0.finish(75);

				case 83:
					_iteratorNormalCompletion = true;
					context$2$0.next = 58;
					break;

				case 86:
					context$2$0.next = 92;
					break;

				case 88:
					context$2$0.prev = 88;
					context$2$0.t4 = context$2$0['catch'](56);
					_didIteratorError = true;
					_iteratorError = context$2$0.t4;

				case 92:
					context$2$0.prev = 92;
					context$2$0.prev = 93;

					if (!_iteratorNormalCompletion && _iterator['return']) {
						_iterator['return']();
					}

				case 95:
					context$2$0.prev = 95;

					if (!_didIteratorError) {
						context$2$0.next = 98;
						break;
					}

					throw _iteratorError;

				case 98:
					return context$2$0.finish(95);

				case 99:
					return context$2$0.finish(92);

				case 100:

					this.body = (0, _layouts2['default'])(templateData);
					return context$2$0.abrupt('break', 102);

				case 102:
				case 'end':
					return context$2$0.stop();
			}
		}, null, this, [[24, 31], [56, 88, 92, 100], [67, 71, 75, 83], [76,, 78, 82], [93,, 95, 99]]);
	};
}

module.exports = exports['default'];
// html/text