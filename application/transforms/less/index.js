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

						source = '' + injects.join('\n') + '\n' + source;
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