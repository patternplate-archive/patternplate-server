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
		var forced = arguments[3] === undefined ? false : arguments[3];

		var patternPath, dependencies, plugins, pluginConfigs, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, pluginName, pluginConfig, Plugin, source, results, demoResults, injects, demoSource, demoConfig, demoDepdendencies;

		return regeneratorRuntime.async(function lessTransform$(context$2$0) {
			while (1) switch (context$2$0.prev = context$2$0.next) {
				case 0:
					patternPath = (0, _path.resolve)(application.runtime.patterncwd || application.runtime.cwd, application.configuration.patterns.path);
					dependencies = Object.keys(file.dependencies || {}).reduce(function getDependencyPaths(paths, dependencyName) {
						paths[dependencyName] = file.dependencies[dependencyName].path;
						return paths;
					}, {});
					plugins = Object.keys(configuration.plugins).map(function (pluginName) {
						return configuration.plugins[pluginName].enabled ? pluginName : false;
					}).filter(function (item) {
						return item;
					});
					pluginConfigs = plugins.reduce(function getPluginConfig(pluginResults, pluginName) {
						pluginResults[pluginName] = configuration.plugins[pluginName].opts || {};
						return pluginResults;
					}, {});

					configuration.plugins = Array.isArray(configuration.plugins) ? configuration.plugins : [];
					configuration.plugins = configuration.plugins.concat([new _lessPluginNpmImport2['default'](), new _lessPluginPatternImport2['default']({ 'root': patternPath, 'patterns': dependencies })]);

					_iteratorNormalCompletion = true;
					_didIteratorError = false;
					_iteratorError = undefined;
					context$2$0.prev = 9;
					for (_iterator = plugins[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						pluginName = _step.value;
						pluginConfig = pluginConfigs[pluginName];

						if (pluginConfig) {
							Plugin = require('less-plugin-' + pluginName);

							configuration.plugins.push(new Plugin(pluginConfig));
						}
					}

					context$2$0.next = 17;
					break;

				case 13:
					context$2$0.prev = 13;
					context$2$0.t0 = context$2$0['catch'](9);
					_didIteratorError = true;
					_iteratorError = context$2$0.t0;

				case 17:
					context$2$0.prev = 17;
					context$2$0.prev = 18;

					if (!_iteratorNormalCompletion && _iterator['return']) {
						_iterator['return']();
					}

				case 20:
					context$2$0.prev = 20;

					if (!_didIteratorError) {
						context$2$0.next = 23;
						break;
					}

					throw _iteratorError;

				case 23:
					return context$2$0.finish(20);

				case 24:
					return context$2$0.finish(17);

				case 25:
					source = file.buffer.toString('utf-8');
					results = {};
					demoResults = {};

					if (forced) {
						injects = Object.keys(dependencies).map(function (dependency) {
							return '@import \'' + dependency + '\';';
						});

						source = '' + injects.join('\n') + '\n' + source;
					}

					context$2$0.prev = 29;
					context$2$0.next = 32;
					return regeneratorRuntime.awrap(render(source, configuration));

				case 32:
					results = context$2$0.sent;
					context$2$0.next = 38;
					break;

				case 35:
					context$2$0.prev = 35;
					context$2$0.t1 = context$2$0['catch'](29);
					throw context$2$0.t1;

				case 38:
					if (!demo) {
						context$2$0.next = 55;
						break;
					}

					demoSource = demo.buffer.toString('utf-8');
					demoConfig = Object.assign({}, configuration);
					demoDepdendencies = Object.assign({}, dependencies, { 'Pattern': file.path });
					context$2$0.prev = 42;

					demoConfig.plugins.push(new _lessPluginPatternImport2['default']({ 'root': patternPath, 'patterns': demoDepdendencies }));
					context$2$0.next = 46;
					return regeneratorRuntime.awrap(render(demoSource, demoConfig));

				case 46:
					demoResults = context$2$0.sent;
					context$2$0.next = 53;
					break;

				case 49:
					context$2$0.prev = 49;
					context$2$0.t2 = context$2$0['catch'](42);

					context$2$0.t2.file = demo.path;
					throw context$2$0.t2;

				case 53:

					file.demoBuffer = new Buffer(demoResults.css || '', 'utf-8');
					file.demoSource = demo.source;

				case 55:

					file.buffer = new Buffer(results.css || '', 'utf-8');

					file['in'] = configuration.inFormat;
					file.out = configuration.outFormat;

					return context$2$0.abrupt('return', file);

				case 59:
				case 'end':
					return context$2$0.stop();
			}
		}, null, this, [[9, 13, 17, 25], [18,, 20, 24], [29, 35], [42, 49]]);
	};
}

module.exports = exports['default'];