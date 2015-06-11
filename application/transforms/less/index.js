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
	var patternPath = (0, _path.resolve)(application.runtime.patterncwd || application.runtime.cwd, application.configuration.patterns.path);
	var config = application.configuration.transforms.less || {};
	var plugins = Object.keys(config.plugins).map(function (pluginName) {
		return config.plugins[pluginName].enabled ? pluginName : false;
	}).filter(function (item) {
		return item;
	});

	var pluginConfigs = plugins.reduce(function getPluginConfig(results, pluginName) {
		results[pluginName] = config.plugins[pluginName].opts || {};
		return results;
	}, {});

	var configuration = {
		'plugins': [new _lessPluginNpmImport2['default']()]
	};

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = plugins[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var pluginName = _step.value;

			var pluginConfig = pluginConfigs[pluginName];

			if (!pluginConfig) {
				continue;
			}

			var Plugin = require('less-plugin-' + pluginName);
			configuration.plugins.push(new Plugin(pluginConfig));
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator['return']) {
				_iterator['return']();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	return function lessTransform(file, demo) {
		var forced = arguments[2] === undefined ? false : arguments[2];
		var source, fileConfig, results, demoResults, dependencies, injects, demoSource, demoConfig, demoDepdendencies;
		return regeneratorRuntime.async(function lessTransform$(context$2$0) {
			while (1) switch (context$2$0.prev = context$2$0.next) {
				case 0:
					source = file.buffer.toString('utf-8');
					fileConfig = Object.assign({}, configuration);
					results = {};
					demoResults = {};
					dependencies = Object.keys(file.dependencies || {}).reduce(function getDependencyPaths(paths, dependencyName) {
						paths[dependencyName] = file.dependencies[dependencyName].path;
						return paths;
					}, {});

					if (forced) {
						injects = Object.keys(dependencies).map(function (dependency) {
							return '@import \'' + dependency + '\';';
						});

						source = '' + injects.join('\n') + '\n' + source;
					}

					context$2$0.prev = 6;

					fileConfig.plugins.push(new _lessPluginPatternImport2['default']({ 'root': patternPath, 'patterns': dependencies }));
					context$2$0.next = 10;
					return regeneratorRuntime.awrap(render(source, fileConfig));

				case 10:
					results = context$2$0.sent;
					context$2$0.next = 16;
					break;

				case 13:
					context$2$0.prev = 13;
					context$2$0.t0 = context$2$0['catch'](6);
					throw context$2$0.t0;

				case 16:
					if (!demo) {
						context$2$0.next = 33;
						break;
					}

					demoSource = demo.buffer.toString('utf-8');
					demoConfig = Object.assign({}, fileConfig);
					demoDepdendencies = Object.assign({}, dependencies, { 'Pattern': file.path });
					context$2$0.prev = 20;

					demoConfig.plugins.push(new _lessPluginPatternImport2['default']({ 'root': patternPath, 'patterns': demoDepdendencies }));
					context$2$0.next = 24;
					return regeneratorRuntime.awrap(render(demoSource, demoConfig));

				case 24:
					demoResults = context$2$0.sent;
					context$2$0.next = 31;
					break;

				case 27:
					context$2$0.prev = 27;
					context$2$0.t1 = context$2$0['catch'](20);

					context$2$0.t1.file = demo.path;
					throw context$2$0.t1;

				case 31:

					file.demoBuffer = new Buffer(demoResults.css || '', 'utf-8');
					file.demoSource = demo.source;

				case 33:

					file.buffer = new Buffer(results.css || '', 'utf-8');

					file['in'] = config.inFormat;
					file.out = config.outFormat;

					return context$2$0.abrupt('return', file);

				case 37:
				case 'end':
					return context$2$0.stop();
			}
		}, null, this, [[6, 13], [20, 27]]);
	};
}

module.exports = exports['default'];