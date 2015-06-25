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
		var cwd, basePath, id, host, port, patternResults, base, resultName, type, extension, format, filters, result, environment, file, templateData, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, environmentName, _environment, envConfig, wrapper, blueprint, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, resultType, _result, templateKey, content, uri, templateSectionData;

		return regeneratorRuntime.async(function patternRoute$(context$2$0) {
			while (1) switch (context$2$0.prev = context$2$0.next) {
				case 0:
					cwd = application.runtime.patterncwd || application.runtime.cwd;
					basePath = (0, _path.resolve)(cwd, config.patterns.path);
					id = this.params.id;
					host = application.configuration.server.host;
					port = application.configuration.server.port;
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
					context$2$0.next = context$2$0.t0 === 'json' ? 16 : context$2$0.t0 === 'css' ? 18 : context$2$0.t0 === 'js' ? 21 : 24;
					break;

				case 16:
					filters.environments.push('index');
					return context$2$0.abrupt('break', 25);

				case 18:
					filters.environments.push(base);
					filters.formats.push(type);
					return context$2$0.abrupt('break', 25);

				case 21:
					filters.environments.push(base);
					filters.formats.push(type);
					return context$2$0.abrupt('break', 25);

				case 24:
					// html/text
					filters.formats.push('html');

				case 25:

					if (application.cache && application.runtime.env === 'production') {
						patternResults = application.cache.get('' + id + '@' + filters.environments.join(','));
					}

					if (patternResults) {
						context$2$0.next = 36;
						break;
					}

					context$2$0.prev = 27;
					context$2$0.next = 30;
					return regeneratorRuntime.awrap((0, _libraryUtilitiesGetPatterns2['default'])(id, basePath, config, application.pattern.factory, application.transforms, filters));

				case 30:
					patternResults = context$2$0.sent;
					context$2$0.next = 36;
					break;

				case 33:
					context$2$0.prev = 33;
					context$2$0.t1 = context$2$0['catch'](27);

					this['throw'](500, context$2$0.t1);

				case 36:

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
					context$2$0.next = context$2$0.t2 === 'json' ? 43 : 44;
					break;

				case 43:
					return context$2$0.abrupt('break', 46);

				case 44:
					if (Array.isArray(result)) {
						this['throw'](404);
					}
					this.type = type;

				case 46:
					context$2$0.t3 = type;
					context$2$0.next = context$2$0.t3 === 'json' ? 49 : context$2$0.t3 === 'css' ? 51 : context$2$0.t3 === 'js' ? 51 : 57;
					break;

				case 49:
					this.body = result;
					return context$2$0.abrupt('break', 107);

				case 51:
					environment = result.results[base];

					if (!environment) {
						this['throw'](404);
					}

					file = environment[resultName];

					if (!file) {
						this['throw'](404);
					}

					this.body = file.demoBuffer || file.buffer;
					return context$2$0.abrupt('break', 107);

				case 57:
					templateData = {
						'title': id,
						'style': [],
						'script': [],
						'markup': []
					};
					_iteratorNormalCompletion = true;
					_didIteratorError = false;
					_iteratorError = undefined;
					context$2$0.prev = 61;
					_iterator = Object.keys(result.results)[Symbol.iterator]();

				case 63:
					if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
						context$2$0.next = 91;
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
					context$2$0.prev = 72;

					for (_iterator2 = Object.keys(_environment)[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						resultType = _step2.value;
						_result = _environment[resultType];
						templateKey = resultType.toLowerCase();
						content = _result.demoBuffer || _result.buffer;
						uri = '//' + host + ':' + port + '' + this.path + '/' + environmentName + '.' + _result.out;
						templateSectionData = Object.assign({}, blueprint, { content: content, uri: uri });

						templateData[templateKey] = Array.isArray(templateData[templateKey]) ? templateData[templateKey].concat([templateSectionData]) : [templateSectionData];
					}
					context$2$0.next = 80;
					break;

				case 76:
					context$2$0.prev = 76;
					context$2$0.t4 = context$2$0['catch'](72);
					_didIteratorError2 = true;
					_iteratorError2 = context$2$0.t4;

				case 80:
					context$2$0.prev = 80;
					context$2$0.prev = 81;

					if (!_iteratorNormalCompletion2 && _iterator2['return']) {
						_iterator2['return']();
					}

				case 83:
					context$2$0.prev = 83;

					if (!_didIteratorError2) {
						context$2$0.next = 86;
						break;
					}

					throw _iteratorError2;

				case 86:
					return context$2$0.finish(83);

				case 87:
					return context$2$0.finish(80);

				case 88:
					_iteratorNormalCompletion = true;
					context$2$0.next = 63;
					break;

				case 91:
					context$2$0.next = 97;
					break;

				case 93:
					context$2$0.prev = 93;
					context$2$0.t5 = context$2$0['catch'](61);
					_didIteratorError = true;
					_iteratorError = context$2$0.t5;

				case 97:
					context$2$0.prev = 97;
					context$2$0.prev = 98;

					if (!_iteratorNormalCompletion && _iterator['return']) {
						_iterator['return']();
					}

				case 100:
					context$2$0.prev = 100;

					if (!_didIteratorError) {
						context$2$0.next = 103;
						break;
					}

					throw _iteratorError;

				case 103:
					return context$2$0.finish(100);

				case 104:
					return context$2$0.finish(97);

				case 105:

					this.body = (0, _layouts2['default'])(templateData);
					return context$2$0.abrupt('break', 107);

				case 107:
				case 'end':
					return context$2$0.stop();
			}
		}, null, this, [[27, 33], [61, 93, 97, 105], [72, 76, 80, 88], [81,, 83, 87], [98,, 100, 104]]);
	};
}

module.exports = exports['default'];
// html/text