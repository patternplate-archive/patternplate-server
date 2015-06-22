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
		var cwd, basePath, id, patternResults, base, resultName, type, extension, format, result, environment, file, templateData, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, environmentName, _environment, envConfig, wrapper, blueprint, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, resultType, _result, templateKey, content, uri, templateSectionData;

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

					if (application.cache && application.runtime.env === 'production') {
						patternResults = application.cache.get(id);
					}

					if (patternResults) {
						context$2$0.next = 21;
						break;
					}

					context$2$0.prev = 12;
					context$2$0.next = 15;
					return regeneratorRuntime.awrap((0, _libraryUtilitiesGetPatterns2['default'])(id, basePath, config, application.pattern.factory, application.transforms));

				case 15:
					patternResults = context$2$0.sent;
					context$2$0.next = 21;
					break;

				case 18:
					context$2$0.prev = 18;
					context$2$0.t0 = context$2$0['catch'](12);

					this['throw'](500, context$2$0.t0);

				case 21:

					if (application.cache && application.runtime.env === 'production') {
						application.cache.set(id, patternResults.results);

						patternResults.results.forEach(function cacheResponseItems(resp) {
							application.cache.set(resp.id, resp);
						});
					}

					this.set('Last-Modified', patternResults.mtime.toUTCString());
					this.set('Cache-Control', 'maxage=' + (configuration.options.maxage | 0));
					result = patternResults.results.length <= 1 ? patternResults.results[0] : patternResults.results;
					context$2$0.t1 = type;
					context$2$0.next = context$2$0.t1 === 'json' ? 28 : 29;
					break;

				case 28:
					return context$2$0.abrupt('break', 31);

				case 29:
					if (Array.isArray(result)) {
						this['throw'](404);
					}
					this.type = type;

				case 31:
					context$2$0.t2 = type;
					context$2$0.next = context$2$0.t2 === 'json' ? 34 : context$2$0.t2 === 'css' ? 36 : context$2$0.t2 === 'js' ? 36 : 42;
					break;

				case 34:
					this.body = result;
					return context$2$0.abrupt('break', 92);

				case 36:
					environment = result.results[base];

					if (!environment) {
						this['throw'](404);
					}

					file = environment[resultName];

					if (!file) {
						this['throw'](404);
					}

					this.body = file.demoBuffer || file.buffer;
					return context$2$0.abrupt('break', 92);

				case 42:
					templateData = {
						'title': id,
						'style': [],
						'script': [],
						'markup': []
					};
					_iteratorNormalCompletion = true;
					_didIteratorError = false;
					_iteratorError = undefined;
					context$2$0.prev = 46;
					_iterator = Object.keys(result.results)[Symbol.iterator]();

				case 48:
					if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
						context$2$0.next = 76;
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
					context$2$0.prev = 57;

					for (_iterator2 = Object.keys(_environment)[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						resultType = _step2.value;
						_result = _environment[resultType];
						templateKey = resultType.toLowerCase();
						content = _result.demoBuffer || _result.buffer;
						uri = '' + this.path + '/' + environmentName + '.' + _result.out;
						templateSectionData = Object.assign({}, blueprint, { content: content, uri: uri });

						templateData[templateKey] = Array.isArray(templateData[templateKey]) ? templateData[templateKey].concat([templateSectionData]) : [templateSectionData];
					}
					context$2$0.next = 65;
					break;

				case 61:
					context$2$0.prev = 61;
					context$2$0.t3 = context$2$0['catch'](57);
					_didIteratorError2 = true;
					_iteratorError2 = context$2$0.t3;

				case 65:
					context$2$0.prev = 65;
					context$2$0.prev = 66;

					if (!_iteratorNormalCompletion2 && _iterator2['return']) {
						_iterator2['return']();
					}

				case 68:
					context$2$0.prev = 68;

					if (!_didIteratorError2) {
						context$2$0.next = 71;
						break;
					}

					throw _iteratorError2;

				case 71:
					return context$2$0.finish(68);

				case 72:
					return context$2$0.finish(65);

				case 73:
					_iteratorNormalCompletion = true;
					context$2$0.next = 48;
					break;

				case 76:
					context$2$0.next = 82;
					break;

				case 78:
					context$2$0.prev = 78;
					context$2$0.t4 = context$2$0['catch'](46);
					_didIteratorError = true;
					_iteratorError = context$2$0.t4;

				case 82:
					context$2$0.prev = 82;
					context$2$0.prev = 83;

					if (!_iteratorNormalCompletion && _iterator['return']) {
						_iterator['return']();
					}

				case 85:
					context$2$0.prev = 85;

					if (!_didIteratorError) {
						context$2$0.next = 88;
						break;
					}

					throw _iteratorError;

				case 88:
					return context$2$0.finish(85);

				case 89:
					return context$2$0.finish(82);

				case 90:

					this.body = (0, _layouts2['default'])(templateData);
					return context$2$0.abrupt('break', 92);

				case 92:
				case 'end':
					return context$2$0.stop();
			}
		}, null, this, [[12, 18], [46, 78, 82, 90], [57, 61, 65, 73], [66,, 68, 72], [83,, 85, 89]]);
	};
}

module.exports = exports['default'];