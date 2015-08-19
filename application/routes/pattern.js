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

					if (type === 'text' && !extension) {
						type = 'html';
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
					return context$2$0.abrupt('break', 24);

				case 16:
					filters.environments.push(base);
					filters.formats.push(type);
					return context$2$0.abrupt('break', 24);

				case 19:
					filters.environments.push(base);
					filters.formats.push(type);
					return context$2$0.abrupt('break', 24);

				case 22:
					// html/text
					filters.formats.push(type);
					return context$2$0.abrupt('break', 24);

				case 24:
					patternResults = undefined;
					context$2$0.prev = 25;
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

							(_application$log = application.log).debug.apply(_application$log, ['[routes:pattern:getpattern]'].concat(args));
						}
					};
					context$2$0.next = 29;
					return regeneratorRuntime.awrap((0, _libraryUtilitiesGetPatterns2['default'])(patternConfig, application.cache, true));

				case 29:
					patternResults = context$2$0.sent;
					context$2$0.next = 35;
					break;

				case 32:
					context$2$0.prev = 32;
					context$2$0.t1 = context$2$0['catch'](25);

					this['throw'](500, context$2$0.t1);

				case 35:

					patternResults = patternResults || [];
					result = patternResults.length === 1 ? patternResults[0] : patternResults;

					this.type = type;

					context$2$0.t2 = type;
					context$2$0.next = context$2$0.t2 === 'json' ? 41 : context$2$0.t2 === 'css' ? 43 : context$2$0.t2 === 'js' ? 43 : 49;
					break;

				case 41:
					this.body = result;
					return context$2$0.abrupt('break', 103);

				case 43:
					environment = result.results[base];

					if (!environment) {
						this['throw'](404);
					}

					file = environment[resultName];

					if (!file) {
						this['throw'](404);
					}

					this.body = file.demoBuffer || file.buffer;
					return context$2$0.abrupt('break', 103);

				case 49:
					hostName = application.configuration.server.host;
					port = application.configuration.server.port;
					host = hostName + ':' + port;
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
								if (route.indexOf('/api') < 0) {
									prefix = '/api';
								}
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
					context$2$0.prev = 57;
					_iterator = Object.keys(result.results || {})[Symbol.iterator]();

				case 59:
					if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
						context$2$0.next = 87;
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
					context$2$0.prev = 68;

					for (_iterator2 = Object.keys(_environment)[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						resultType = _step2.value;
						_result = _environment[resultType];
						templateKey = resultType.toLowerCase();
						content = _result.demoBuffer || _result.buffer;
						uri = this.params.id + '/' + environmentName + '.' + _result.out;
						templateSectionData = Object.assign({}, blueprint, { content: content, uri: uri });

						templateData[templateKey] = Array.isArray(templateData[templateKey]) ? templateData[templateKey].concat([templateSectionData]) : [templateSectionData];
					}
					context$2$0.next = 76;
					break;

				case 72:
					context$2$0.prev = 72;
					context$2$0.t3 = context$2$0['catch'](68);
					_didIteratorError2 = true;
					_iteratorError2 = context$2$0.t3;

				case 76:
					context$2$0.prev = 76;
					context$2$0.prev = 77;

					if (!_iteratorNormalCompletion2 && _iterator2['return']) {
						_iterator2['return']();
					}

				case 79:
					context$2$0.prev = 79;

					if (!_didIteratorError2) {
						context$2$0.next = 82;
						break;
					}

					throw _iteratorError2;

				case 82:
					return context$2$0.finish(79);

				case 83:
					return context$2$0.finish(76);

				case 84:
					_iteratorNormalCompletion = true;
					context$2$0.next = 59;
					break;

				case 87:
					context$2$0.next = 93;
					break;

				case 89:
					context$2$0.prev = 89;
					context$2$0.t4 = context$2$0['catch'](57);
					_didIteratorError = true;
					_iteratorError = context$2$0.t4;

				case 93:
					context$2$0.prev = 93;
					context$2$0.prev = 94;

					if (!_iteratorNormalCompletion && _iterator['return']) {
						_iterator['return']();
					}

				case 96:
					context$2$0.prev = 96;

					if (!_didIteratorError) {
						context$2$0.next = 99;
						break;
					}

					throw _iteratorError;

				case 99:
					return context$2$0.finish(96);

				case 100:
					return context$2$0.finish(93);

				case 101:

					this.body = (0, _layouts2['default'])(templateData);
					return context$2$0.abrupt('break', 103);

				case 103:
				case 'end':
					return context$2$0.stop();
			}
		}, null, this, [[25, 32], [57, 89, 93, 101], [68, 72, 76, 84], [77,, 79, 83], [94,, 96, 100]]);
	};
}

module.exports = exports['default'];
// html/text
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NvdXJjZS9hcHBsaWNhdGlvbi9yb3V0ZXMvcGF0dGVybi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztxQkFPd0IsbUJBQW1COzs7O29CQVBPLE1BQU07OzJDQUVoQyxzQ0FBc0M7Ozs7MENBQ3ZDLHFDQUFxQzs7Ozt1QkFFekMsWUFBWTs7OztBQUVoQixTQUFTLG1CQUFtQixDQUFFLFdBQVcsRUFBRSxhQUFhLEVBQUU7QUFDeEUsS0FBSSxRQUFRLEdBQUcsV0FBVyxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUMxRSxLQUFJLFVBQVUsR0FBRyxXQUFXLENBQUMsYUFBYSxDQUFDLFVBQVUsSUFBSSxFQUFFLENBQUM7QUFDNUQsS0FBTSxNQUFNLEdBQUcsRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFFLFVBQVUsRUFBVixVQUFVLEVBQUUsQ0FBQzs7QUFFeEMsUUFBTyxTQUFlLFlBQVk7TUFDN0IsR0FBRyxFQUNILFFBQVEsRUFDUixFQUFFLEVBRUYsSUFBSSxFQUNKLFVBQVUsRUFDVixJQUFJLEVBQ0osU0FBUyxFQVFSLE1BQU0sRUFjUCxPQUFPLEVBc0JQLGNBQWMsRUFHYixhQUFhLEVBZ0JkLE1BQU0sRUFVSixXQUFXLEVBTVgsSUFBSSxFQVNKLFFBQVEsRUFDUixJQUFJLEVBQ0osSUFBSSxFQUNKLE1BQU0sRUFFTixZQUFZLGtGQXVCUCxlQUFlLEVBQ25CLFlBQVcsRUFDWCxTQUFTLEVBQ1QsT0FBTyxFQUNQLFNBQVMsdUZBRUosVUFBVSxFQUNkLE9BQU0sRUFDTixXQUFXLEVBQ1gsT0FBTyxFQUNQLEdBQUcsRUFDSCxtQkFBbUI7Ozs7Ozs7QUF0SXZCLFFBQUcsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLFVBQVUsSUFBSSxXQUFXLENBQUMsT0FBTyxDQUFDLEdBQUc7QUFDL0QsYUFBUSxHQUFHLG1CQUFRLEdBQUcsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLElB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LENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQ25FLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLEdBQ3ZELENBQUMsbUJBQW1CLENBQUMsQ0FBQztNQUN2Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBR0YsU0FBSSxDQUFDLElBQUksR0FBRywwQkFBTyxZQUFZLENBQUMsQ0FBQzs7Ozs7Ozs7RUFHbkMsQ0FBQztDQUNGIiwiZmlsZSI6InBhdHRlcm4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge3Jlc29sdmUsIGRpcm5hbWUsIGJhc2VuYW1lLCBleHRuYW1lfSBmcm9tICdwYXRoJztcblxuaW1wb3J0IGdldFBhdHRlcm5zIGZyb20gJy4uLy4uL2xpYnJhcnkvdXRpbGl0aWVzL2dldC1wYXR0ZXJucyc7XG5pbXBvcnQgZ2V0V3JhcHBlciBmcm9tICcuLi8uLi9saWJyYXJ5L3V0aWxpdGllcy9nZXQtd3JhcHBlcic7XG5cbmltcG9ydCBsYXlvdXQgZnJvbSAnLi4vbGF5b3V0cyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHBhdHRlcm5Sb3V0ZUZhY3RvcnkgKGFwcGxpY2F0aW9uLCBjb25maWd1cmF0aW9uKSB7XG5cdGxldCBwYXR0ZXJucyA9IGFwcGxpY2F0aW9uLmNvbmZpZ3VyYXRpb25bY29uZmlndXJhdGlvbi5vcHRpb25zLmtleV0gfHwge307XG5cdGxldCB0cmFuc2Zvcm1zID0gYXBwbGljYXRpb24uY29uZmlndXJhdGlvbi50cmFuc2Zvcm1zIHx8IHt9O1xuXHRjb25zdCBjb25maWcgPSB7IHBhdHRlcm5zLCB0cmFuc2Zvcm1zIH07XG5cblx0cmV0dXJuIGFzeW5jIGZ1bmN0aW9uIHBhdHRlcm5Sb3V0ZSAoKSB7XG5cdFx0bGV0IGN3ZCA9IGFwcGxpY2F0aW9uLnJ1bnRpbWUucGF0dGVybmN3ZCB8fCBhcHBsaWNhdGlvbi5ydW50aW1lLmN3ZDtcblx0XHRsZXQgYmFzZVBhdGggPSByZXNvbHZlKGN3ZCwgY29uZmlnLnBhdHRlcm5zLnBhdGgpO1xuXHRcdGxldCBpZCA9IHRoaXMucGFyYW1zLmlkO1xuXG5cdFx0bGV0IGJhc2U7XG5cdFx0bGV0IHJlc3VsdE5hbWU7XG5cdFx0bGV0IHR5cGUgPSB0aGlzLmFjY2VwdHMoJ3RleHQnLCAnanNvbicsICdodG1sJyk7XG5cdFx0bGV0IGV4dGVuc2lvbiA9IGV4dG5hbWUodGhpcy5wYXRoKTtcblxuXHRcdGlmIChleHRlbnNpb24pIHtcblx0XHRcdHR5cGUgPSBleHRlbnNpb24uc2xpY2UoMSk7XG5cdFx0fVxuXG5cdFx0aWYgKGV4dGVuc2lvbikge1xuXHRcdFx0YmFzZSA9IGJhc2VuYW1lKHRoaXMucGF0aCwgZXh0ZW5zaW9uKTtcblx0XHRcdGxldCBmb3JtYXQgPSBjb25maWcucGF0dGVybnMuZm9ybWF0c1t0eXBlXSB8fCB7fTtcblx0XHRcdHJlc3VsdE5hbWUgPSBmb3JtYXQubmFtZSB8fCAnJztcblxuXHRcdFx0aWYgKCFyZXN1bHROYW1lKSB7XG5cdFx0XHRcdHRoaXMudGhyb3coNDA0KTtcblx0XHRcdH1cblxuXHRcdFx0aWQgPSBkaXJuYW1lKGlkKTtcblx0XHR9XG5cblx0XHRpZiAodHlwZSA9PT0gJ3RleHQnICYmICFleHRlbnNpb24pIHtcblx0XHRcdHR5cGUgPSAnaHRtbCc7XG5cdFx0fVxuXG5cdFx0bGV0IGZpbHRlcnMgPSB7XG5cdFx0XHQnZW52aXJvbm1lbnRzJzogW10sXG5cdFx0XHQnZm9ybWF0cyc6IFtdXG5cdFx0fTtcblxuXHRcdHN3aXRjaCh0eXBlKSB7XG5cdFx0XHRjYXNlICdqc29uJzpcblx0XHRcdFx0ZmlsdGVycy5lbnZpcm9ubWVudHMucHVzaCgnaW5kZXgnKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlICdjc3MnOlxuXHRcdFx0XHRmaWx0ZXJzLmVudmlyb25tZW50cy5wdXNoKGJhc2UpO1xuXHRcdFx0XHRmaWx0ZXJzLmZvcm1hdHMucHVzaCh0eXBlKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlICdqcyc6XG5cdFx0XHRcdGZpbHRlcnMuZW52aXJvbm1lbnRzLnB1c2goYmFzZSk7XG5cdFx0XHRcdGZpbHRlcnMuZm9ybWF0cy5wdXNoKHR5cGUpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGRlZmF1bHQ6IC8vIGh0bWwvdGV4dFxuXHRcdFx0XHRmaWx0ZXJzLmZvcm1hdHMucHVzaCh0eXBlKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXG5cdFx0bGV0IHBhdHRlcm5SZXN1bHRzO1xuXG5cdFx0dHJ5IHtcblx0XHRcdGxldCBwYXR0ZXJuQ29uZmlnID0ge1xuXHRcdFx0XHRpZCwgY29uZmlnLCBmaWx0ZXJzLFxuXHRcdFx0XHQnYmFzZSc6IGJhc2VQYXRoLFxuXHRcdFx0XHQnZmFjdG9yeSc6IGFwcGxpY2F0aW9uLnBhdHRlcm4uZmFjdG9yeSxcblx0XHRcdFx0J3RyYW5zZm9ybXMnOiBhcHBsaWNhdGlvbi50cmFuc2Zvcm1zLFxuXHRcdFx0XHQnbG9nJzogZnVuY3Rpb24oLi4uYXJncykge1xuXHRcdFx0XHRcdGFwcGxpY2F0aW9uLmxvZy5kZWJ1ZyguLi5bJ1tyb3V0ZXM6cGF0dGVybjpnZXRwYXR0ZXJuXScsIC4uLmFyZ3NdKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0cGF0dGVyblJlc3VsdHMgPSBhd2FpdCBnZXRQYXR0ZXJucyhwYXR0ZXJuQ29uZmlnLCBhcHBsaWNhdGlvbi5jYWNoZSwgdHJ1ZSk7XG5cdFx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0XHR0aGlzLnRocm93KDUwMCwgZXJyKTtcblx0XHR9XG5cblx0XHRwYXR0ZXJuUmVzdWx0cyA9IHBhdHRlcm5SZXN1bHRzIHx8IFtdO1xuXHRcdGxldCByZXN1bHQgPSBwYXR0ZXJuUmVzdWx0cy5sZW5ndGggPT09IDEgPyBwYXR0ZXJuUmVzdWx0c1swXSA6IHBhdHRlcm5SZXN1bHRzO1xuXG5cdFx0dGhpcy50eXBlID0gdHlwZTtcblxuXHRcdHN3aXRjaCh0eXBlKSB7XG5cdFx0XHRjYXNlICdqc29uJzpcblx0XHRcdFx0dGhpcy5ib2R5ID0gcmVzdWx0O1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgJ2Nzcyc6XG5cdFx0XHRjYXNlICdqcyc6XG5cdFx0XHRcdGxldCBlbnZpcm9ubWVudCA9IHJlc3VsdC5yZXN1bHRzW2Jhc2VdO1xuXG5cdFx0XHRcdGlmICghZW52aXJvbm1lbnQpIHtcblx0XHRcdFx0XHR0aGlzLnRocm93KDQwNCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRsZXQgZmlsZSA9IGVudmlyb25tZW50W3Jlc3VsdE5hbWVdO1xuXG5cdFx0XHRcdGlmICghZmlsZSkge1xuXHRcdFx0XHRcdHRoaXMudGhyb3coNDA0KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRoaXMuYm9keSA9IGZpbGUuZGVtb0J1ZmZlciB8fCBmaWxlLmJ1ZmZlcjtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRkZWZhdWx0OiAvLyBodG1sL3RleHRcblx0XHRcdFx0bGV0IGhvc3ROYW1lID0gYXBwbGljYXRpb24uY29uZmlndXJhdGlvbi5zZXJ2ZXIuaG9zdDtcblx0XHRcdFx0bGV0IHBvcnQgPSBhcHBsaWNhdGlvbi5jb25maWd1cmF0aW9uLnNlcnZlci5wb3J0O1xuXHRcdFx0XHRsZXQgaG9zdCA9IGAke2hvc3ROYW1lfToke3BvcnR9YDtcblx0XHRcdFx0bGV0IHByZWZpeCA9ICcnO1xuXG5cdFx0XHRcdGxldCB0ZW1wbGF0ZURhdGEgPSB7XG5cdFx0XHRcdFx0J3RpdGxlJzogaWQsXG5cdFx0XHRcdFx0J3N0eWxlJzogW10sXG5cdFx0XHRcdFx0J3NjcmlwdCc6IFtdLFxuXHRcdFx0XHRcdCdtYXJrdXAnOiBbXSxcblx0XHRcdFx0XHQncm91dGUnOiAobmFtZSwgcGFyYW1zKSA9PiB7XG5cdFx0XHRcdFx0XHRuYW1lID0gbmFtZSB8fCAncGF0dGVybic7XG5cdFx0XHRcdFx0XHRsZXQgcm91dGUgPSBhcHBsaWNhdGlvbi5yb3V0ZXIudXJsKG5hbWUsIHBhcmFtcyk7XG5cblx0XHRcdFx0XHRcdGlmICh0aGlzLmhvc3QgIT09IGhvc3QpIHtcblx0XHRcdFx0XHRcdFx0aG9zdCA9IGAke3RoaXMuaG9zdH1gO1xuXHRcdFx0XHRcdFx0XHRpZiAocm91dGUuaW5kZXhPZignL2FwaScpIDwgMCkge1xuXHRcdFx0XHRcdFx0XHRcdHByZWZpeCA9ICcvYXBpJztcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRsZXQgdXJsID0gW2hvc3QsIHByZWZpeCwgcm91dGVdXG5cdFx0XHRcdFx0XHRcdC5maWx0ZXIoKGl0ZW0pID0+IGl0ZW0pXG5cdFx0XHRcdFx0XHRcdC5tYXAoKGl0ZW0pID0+IGRlY29kZVVSSShpdGVtKS5yZXBsYWNlKC9cXCp8XFwlMkJ8XFw/L2csICcnKSk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZW5jb2RlVVJJKGAvLyR7dXJsLmpvaW4oJycpfWApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblxuXHRcdFx0XHRmb3IgKGxldCBlbnZpcm9ubWVudE5hbWUgb2YgT2JqZWN0LmtleXMocmVzdWx0LnJlc3VsdHMgfHwge30pKSB7XG5cdFx0XHRcdFx0bGV0IGVudmlyb25tZW50ID0gcmVzdWx0LnJlc3VsdHNbZW52aXJvbm1lbnROYW1lXTtcblx0XHRcdFx0XHRsZXQgZW52Q29uZmlnID0gcmVzdWx0LmVudmlyb25tZW50c1tlbnZpcm9ubWVudE5hbWVdLm1hbmlmZXN0IHx8IHt9O1xuXHRcdFx0XHRcdGxldCB3cmFwcGVyID0gZ2V0V3JhcHBlcihlbnZDb25maWdbJ2NvbmRpdGlvbmFsLWNvbW1lbnQnXSk7XG5cdFx0XHRcdFx0bGV0IGJsdWVwcmludCA9IHsnZW52aXJvbm1lbnQnOiBlbnZpcm9ubWVudE5hbWUsICdjb250ZW50JzogJycsIHdyYXBwZXJ9O1xuXG5cdFx0XHRcdFx0Zm9yIChsZXQgcmVzdWx0VHlwZSBvZiBPYmplY3Qua2V5cyhlbnZpcm9ubWVudCkpIHtcblx0XHRcdFx0XHRcdGxldCByZXN1bHQgPSBlbnZpcm9ubWVudFtyZXN1bHRUeXBlXTtcblx0XHRcdFx0XHRcdGxldCB0ZW1wbGF0ZUtleSA9IHJlc3VsdFR5cGUudG9Mb3dlckNhc2UoKTtcblx0XHRcdFx0XHRcdGxldCBjb250ZW50ID0gcmVzdWx0LmRlbW9CdWZmZXIgfHwgcmVzdWx0LmJ1ZmZlcjtcblx0XHRcdFx0XHRcdGxldCB1cmkgPSBgJHt0aGlzLnBhcmFtcy5pZH0vJHtlbnZpcm9ubWVudE5hbWV9LiR7cmVzdWx0Lm91dH1gO1xuXHRcdFx0XHRcdFx0bGV0IHRlbXBsYXRlU2VjdGlvbkRhdGEgPSBPYmplY3QuYXNzaWduKHt9LCBibHVlcHJpbnQsIHtjb250ZW50LCB1cml9KTtcblxuXHRcdFx0XHRcdFx0dGVtcGxhdGVEYXRhW3RlbXBsYXRlS2V5XSA9IEFycmF5LmlzQXJyYXkodGVtcGxhdGVEYXRhW3RlbXBsYXRlS2V5XSkgP1xuXHRcdFx0XHRcdFx0XHR0ZW1wbGF0ZURhdGFbdGVtcGxhdGVLZXldLmNvbmNhdChbdGVtcGxhdGVTZWN0aW9uRGF0YV0pIDpcblx0XHRcdFx0XHRcdFx0W3RlbXBsYXRlU2VjdGlvbkRhdGFdO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRoaXMuYm9keSA9IGxheW91dCh0ZW1wbGF0ZURhdGEpO1xuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cdH07XG59XG4iXX0=