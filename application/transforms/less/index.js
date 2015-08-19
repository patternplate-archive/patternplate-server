'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = lessTransformFactory;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _less = require('less');

var _less2 = _interopRequireDefault(_less);

var _lessPluginPatternImport = require('less-plugin-pattern-import');

var _lessPluginPatternImport2 = _interopRequireDefault(_lessPluginPatternImport);

var _lessPluginNpmImport = require('less-plugin-npm-import');

var _lessPluginNpmImport2 = _interopRequireDefault(_lessPluginNpmImport);

function render(source, config) {
	return regeneratorRuntime.async(function render$(context$1$0) {
		while (1) switch (context$1$0.prev = context$1$0.next) {
			case 0:
				context$1$0.prev = 0;
				context$1$0.next = 3;
				return regeneratorRuntime.awrap(_less2['default'].render(source, config));

			case 3:
				return context$1$0.abrupt('return', context$1$0.sent);

			case 6:
				context$1$0.prev = 6;
				context$1$0.t0 = context$1$0['catch'](0);
				throw context$1$0.t0;

			case 9:
			case 'end':
				return context$1$0.stop();
		}
	}, null, this, [[0, 6]]);
}

function lessTransformFactory(application) {
	return function lessTransform(file, demo, configuration) {
		var forced = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

		var config, patternPath, dependencies, plugins, pluginConfigs, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, pluginName, pluginConfig, Plugin, source, results, demoResults, injects, demoSource, demoConfig, demoDepdendencies;

		return regeneratorRuntime.async(function lessTransform$(context$2$0) {
			while (1) switch (context$2$0.prev = context$2$0.next) {
				case 0:
					config = Object.assign({}, configuration);
					patternPath = (0, _path.resolve)(application.runtime.patterncwd || application.runtime.cwd, application.configuration.patterns.path);
					dependencies = Object.keys(file.dependencies || {}).reduce(function getDependencyPaths(paths, dependencyName) {
						paths[dependencyName] = file.dependencies[dependencyName].path;
						return paths;
					}, {});
					plugins = Object.keys(config.plugins).map(function (pluginName) {
						return config.plugins[pluginName].enabled ? pluginName : false;
					}).filter(function (item) {
						return item;
					});
					pluginConfigs = plugins.reduce(function getPluginConfig(pluginResults, pluginName) {
						pluginResults[pluginName] = config.plugins[pluginName].opts || {};
						return pluginResults;
					}, {});

					config.opts.plugins = Array.isArray(config.opts.plugins) ? config.opts.plugins : [];
					config.opts.plugins = config.opts.plugins.concat([new _lessPluginNpmImport2['default'](), new _lessPluginPatternImport2['default']({ 'root': patternPath, 'patterns': dependencies })]);

					_iteratorNormalCompletion = true;
					_didIteratorError = false;
					_iteratorError = undefined;
					context$2$0.prev = 10;
					for (_iterator = plugins[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						pluginName = _step.value;
						pluginConfig = pluginConfigs[pluginName];

						if (pluginConfig) {
							Plugin = require('less-plugin-' + pluginName);

							config.opts.plugins.push(new Plugin(pluginConfig));
						}
					}

					context$2$0.next = 18;
					break;

				case 14:
					context$2$0.prev = 14;
					context$2$0.t0 = context$2$0['catch'](10);
					_didIteratorError = true;
					_iteratorError = context$2$0.t0;

				case 18:
					context$2$0.prev = 18;
					context$2$0.prev = 19;

					if (!_iteratorNormalCompletion && _iterator['return']) {
						_iterator['return']();
					}

				case 21:
					context$2$0.prev = 21;

					if (!_didIteratorError) {
						context$2$0.next = 24;
						break;
					}

					throw _iteratorError;

				case 24:
					return context$2$0.finish(21);

				case 25:
					return context$2$0.finish(18);

				case 26:
					source = file.buffer.toString('utf-8');
					results = {};
					demoResults = {};

					if (forced) {
						injects = Object.keys(dependencies).map(function (dependency) {
							return '@import \'' + dependency + '\';';
						});

						source = injects.join('\n') + '\n' + source;
					}

					context$2$0.prev = 30;
					context$2$0.next = 33;
					return regeneratorRuntime.awrap(render(source, config.opts));

				case 33:
					results = context$2$0.sent;
					context$2$0.next = 39;
					break;

				case 36:
					context$2$0.prev = 36;
					context$2$0.t1 = context$2$0['catch'](30);
					throw context$2$0.t1;

				case 39:
					if (!demo) {
						context$2$0.next = 56;
						break;
					}

					demoSource = demo.buffer.toString('utf-8');
					demoConfig = Object.assign({}, configuration);
					demoDepdendencies = Object.assign({}, dependencies, { 'Pattern': file.path });
					context$2$0.prev = 43;

					demoConfig.opts.plugins.push(new _lessPluginPatternImport2['default']({ 'root': patternPath, 'patterns': demoDepdendencies }));
					context$2$0.next = 47;
					return regeneratorRuntime.awrap(render(demoSource, demoConfig.opts));

				case 47:
					demoResults = context$2$0.sent;
					context$2$0.next = 54;
					break;

				case 50:
					context$2$0.prev = 50;
					context$2$0.t2 = context$2$0['catch'](43);

					context$2$0.t2.file = demo.path;
					throw context$2$0.t2;

				case 54:

					file.demoBuffer = new Buffer(demoResults.css || '', 'utf-8');
					file.demoSource = demo.source;

				case 56:

					file.buffer = new Buffer(results.css || '', 'utf-8');

					file['in'] = config.inFormat;
					file.out = config.outFormat;

					return context$2$0.abrupt('return', file);

				case 60:
				case 'end':
					return context$2$0.stop();
			}
		}, null, this, [[10, 14, 18, 26], [19,, 21, 25], [30, 36], [43, 50]]);
	};
}

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NvdXJjZS9hcHBsaWNhdGlvbi90cmFuc2Zvcm1zL2xlc3MvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7cUJBZXdCLG9CQUFvQjs7OztvQkFmdEIsTUFBTTs7b0JBRVgsTUFBTTs7Ozt1Q0FFVyw0QkFBNEI7Ozs7bUNBQ2hDLHdCQUF3Qjs7OztBQUV0RCxTQUFlLE1BQU0sQ0FBRSxNQUFNLEVBQUUsTUFBTTs7Ozs7O29DQUV0QixrQkFBSyxNQUFNLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O0NBSXpDOztBQUVjLFNBQVMsb0JBQW9CLENBQUUsV0FBVyxFQUFFO0FBQzFELFFBQU8sU0FBZSxhQUFhLENBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxhQUFhO01BQUUsTUFBTSx5REFBRyxLQUFLOztNQUN2RSxNQUFNLEVBRU4sV0FBVyxFQUNYLFlBQVksRUFLWixPQUFPLEVBSVAsYUFBYSxrRkFZVixVQUFVLEVBQ2QsWUFBWSxFQUdYLE1BQU0sRUFLUixNQUFNLEVBQ04sT0FBTyxFQUNQLFdBQVcsRUFHVixPQUFPLEVBV1AsVUFBVSxFQUNWLFVBQVUsRUFDVixpQkFBaUI7Ozs7O0FBbkRoQixXQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsYUFBYSxDQUFDO0FBRXpDLGdCQUFXLEdBQUcsbUJBQVEsV0FBVyxDQUFDLE9BQU8sQ0FBQyxVQUFVLElBQUksV0FBVyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsV0FBVyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO0FBQ3pILGlCQUFZLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxJQUFJLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLGtCQUFrQixDQUFFLEtBQUssRUFBRSxjQUFjLEVBQUU7QUFDcEgsV0FBSyxDQUFDLGNBQWMsQ0FBQyxHQUFHLElBQUksQ0FBQyxZQUFZLENB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QUVYLG9CQUFJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDOzs7OztBQUl0QixTQUFJLENBQUMsVUFBVSxHQUFHLElBQUksTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLElBQUksRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQzdELFNBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7OztBQUcvQixTQUFJLENBQUMsTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLElBQUksRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDOztBQUVyRCxTQUFJLE1BQUcsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO0FBQzFCLFNBQUksQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQzs7eUNBRXJCLElBQUk7Ozs7Ozs7RUFDWCxDQUFDO0NBQ0YiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge3Jlc29sdmV9IGZyb20gJ3BhdGgnO1xuXG5pbXBvcnQgbGVzcyBmcm9tICdsZXNzJztcblxuaW1wb3J0IFBhdHRlcm5JbXBvcnRlclBsdWdpbiBmcm9tICdsZXNzLXBsdWdpbi1wYXR0ZXJuLWltcG9ydCc7XG5pbXBvcnQgTlBNSW1wb3J0ZXJQbHVnaW4gZnJvbSAnbGVzcy1wbHVnaW4tbnBtLWltcG9ydCc7XG5cbmFzeW5jIGZ1bmN0aW9uIHJlbmRlciAoc291cmNlLCBjb25maWcpIHtcblx0dHJ5IHtcblx0XHRyZXR1cm4gYXdhaXQgbGVzcy5yZW5kZXIoc291cmNlLCBjb25maWcpO1xuXHR9IGNhdGNoIChsZXNzRXJyb3IpIHtcblx0XHR0aHJvdyBsZXNzRXJyb3I7XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbGVzc1RyYW5zZm9ybUZhY3RvcnkgKGFwcGxpY2F0aW9uKSB7XG5cdHJldHVybiBhc3luYyBmdW5jdGlvbiBsZXNzVHJhbnNmb3JtIChmaWxlLCBkZW1vLCBjb25maWd1cmF0aW9uLCBmb3JjZWQgPSBmYWxzZSkge1xuXHRcdGNvbnN0IGNvbmZpZyA9IE9iamVjdC5hc3NpZ24oe30sIGNvbmZpZ3VyYXRpb24pO1xuXG5cdFx0Y29uc3QgcGF0dGVyblBhdGggPSByZXNvbHZlKGFwcGxpY2F0aW9uLnJ1bnRpbWUucGF0dGVybmN3ZCB8fCBhcHBsaWNhdGlvbi5ydW50aW1lLmN3ZCwgYXBwbGljYXRpb24uY29uZmlndXJhdGlvbi5wYXR0ZXJucy5wYXRoKTtcblx0XHRjb25zdCBkZXBlbmRlbmNpZXMgPSBPYmplY3Qua2V5cyhmaWxlLmRlcGVuZGVuY2llcyB8fCB7fSkucmVkdWNlKGZ1bmN0aW9uIGdldERlcGVuZGVuY3lQYXRocyAocGF0aHMsIGRlcGVuZGVuY3lOYW1lKSB7XG5cdFx0XHRwYXRoc1tkZXBlbmRlbmN5TmFtZV0gPSBmaWxlLmRlcGVuZGVuY2llc1tkZXBlbmRlbmN5TmFtZV0ucGF0aDtcblx0XHRcdHJldHVybiBwYXRocztcblx0XHR9LCB7fSk7XG5cblx0XHRjb25zdCBwbHVnaW5zID0gT2JqZWN0LmtleXMoY29uZmlnLnBsdWdpbnMpXG5cdFx0XHQubWFwKChwbHVnaW5OYW1lKSA9PiBjb25maWcucGx1Z2luc1twbHVnaW5OYW1lXS5lbmFibGVkID8gcGx1Z2luTmFtZSA6IGZhbHNlKVxuXHRcdFx0LmZpbHRlcigoaXRlbSkgPT4gaXRlbSk7XG5cblx0XHRjb25zdCBwbHVnaW5Db25maWdzID0gcGx1Z2lucy5yZWR1Y2UoZnVuY3Rpb24gZ2V0UGx1Z2luQ29uZmlnIChwbHVnaW5SZXN1bHRzLCBwbHVnaW5OYW1lKSB7XG5cdFx0XHRwbHVnaW5SZXN1bHRzW3BsdWdpbk5hbWVdID0gY29uZmlnLnBsdWdpbnNbcGx1Z2luTmFtZV0ub3B0cyB8fCB7fTtcblx0XHRcdHJldHVybiBwbHVnaW5SZXN1bHRzO1xuXHRcdH0sIHt9KTtcblxuXHRcdGNvbmZpZy5vcHRzLnBsdWdpbnMgPSBBcnJheS5pc0FycmF5KGNvbmZpZy5vcHRzLnBsdWdpbnMpID8gY29uZmlnLm9wdHMucGx1Z2lucyA6IFtdO1xuXHRcdGNvbmZpZy5vcHRzLnBsdWdpbnMgPSBjb25maWcub3B0cy5wbHVnaW5zLmNvbmNhdChcblx0XHRcdFtcblx0XHRcdFx0bmV3IE5QTUltcG9ydGVyUGx1Z2luKCksXG5cdFx0XHRcdG5ldyBQYXR0ZXJuSW1wb3J0ZXJQbHVnaW4oeydyb290JzogcGF0dGVyblBhdGgsICdwYXR0ZXJucyc6IGRlcGVuZGVuY2llc30pXG5cdFx0XHRdKTtcblxuXHRcdGZvciAobGV0IHBsdWdpbk5hbWUgb2YgcGx1Z2lucykge1xuXHRcdFx0bGV0IHBsdWdpbkNvbmZpZyA9IHBsdWdpbkNvbmZpZ3NbcGx1Z2luTmFtZV07XG5cblx0XHRcdGlmIChwbHVnaW5Db25maWcpIHtcblx0XHRcdFx0bGV0IFBsdWdpbiA9IHJlcXVpcmUoYGxlc3MtcGx1Z2luLSR7cGx1Z2luTmFtZX1gKTtcblx0XHRcdFx0Y29uZmlnLm9wdHMucGx1Z2lucy5wdXNoKG5ldyBQbHVnaW4ocGx1Z2luQ29uZmlnKSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0bGV0IHNvdXJjZSA9IGZpbGUuYnVmZmVyLnRvU3RyaW5nKCd1dGYtOCcpO1xuXHRcdHZhciByZXN1bHRzID0ge307XG5cdFx0dmFyIGRlbW9SZXN1bHRzID0ge307XG5cblx0XHRpZiAoZm9yY2VkKSB7XG5cdFx0XHRsZXQgaW5qZWN0cyA9IE9iamVjdC5rZXlzKGRlcGVuZGVuY2llcykubWFwKChkZXBlbmRlbmN5KSA9PiBgQGltcG9ydCAnJHtkZXBlbmRlbmN5fSc7YCk7XG5cdFx0XHRzb3VyY2UgPSBgJHtpbmplY3RzLmpvaW4oJ1xcbicpfVxcbiR7c291cmNlfWA7XG5cdFx0fVxuXG5cdFx0dHJ5IHtcblx0XHRcdHJlc3VsdHMgPSBhd2FpdCByZW5kZXIoc291cmNlLCBjb25maWcub3B0cyk7XG5cdFx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0XHR0aHJvdyBlcnI7XG5cdFx0fVxuXG5cdFx0aWYgKGRlbW8pIHtcblx0XHRcdGxldCBkZW1vU291cmNlID0gZGVtby5idWZmZXIudG9TdHJpbmcoJ3V0Zi04Jyk7XG5cdFx0XHRsZXQgZGVtb0NvbmZpZyA9IE9iamVjdC5hc3NpZ24oe30sIGNvbmZpZ3VyYXRpb24pO1xuXHRcdFx0bGV0IGRlbW9EZXBkZW5kZW5jaWVzID0gT2JqZWN0LmFzc2lnbih7fSwgZGVwZW5kZW5jaWVzLCB7J1BhdHRlcm4nOiBmaWxlLnBhdGh9KTtcblxuXHRcdFx0dHJ5IHtcblx0XHRcdFx0ZGVtb0NvbmZpZy5vcHRzLnBsdWdpbnMucHVzaChuZXcgUGF0dGVybkltcG9ydGVyUGx1Z2luKHsncm9vdCc6IHBhdHRlcm5QYXRoLCAncGF0dGVybnMnOiBkZW1vRGVwZGVuZGVuY2llc30pKTtcblx0XHRcdFx0ZGVtb1Jlc3VsdHMgPSBhd2FpdCByZW5kZXIoZGVtb1NvdXJjZSwgZGVtb0NvbmZpZy5vcHRzKTtcblx0XHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0XHRlcnIuZmlsZSA9IGRlbW8ucGF0aDtcblx0XHRcdFx0dGhyb3cgZXJyO1xuXHRcdFx0fVxuXG5cdFx0XHRmaWxlLmRlbW9CdWZmZXIgPSBuZXcgQnVmZmVyKGRlbW9SZXN1bHRzLmNzcyB8fCAnJywgJ3V0Zi04Jyk7XG5cdFx0XHRmaWxlLmRlbW9Tb3VyY2UgPSBkZW1vLnNvdXJjZTtcblx0XHR9XG5cblx0XHRmaWxlLmJ1ZmZlciA9IG5ldyBCdWZmZXIocmVzdWx0cy5jc3MgfHwgJycsICd1dGYtOCcpO1xuXG5cdFx0ZmlsZS5pbiA9IGNvbmZpZy5pbkZvcm1hdDtcblx0XHRmaWxlLm91dCA9IGNvbmZpZy5vdXRGb3JtYXQ7XG5cblx0XHRyZXR1cm4gZmlsZTtcblx0fTtcbn1cbiJdfQ==