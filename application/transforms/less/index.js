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
				return _less2['default'].render(source, config);

			case 3:
				return context$1$0.abrupt('return', context$1$0.sent);

			case 6:
				context$1$0.prev = 6;
				context$1$0.t26 = context$1$0['catch'](0);
				throw context$1$0.t26;

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

			var Plugin = require('less-plugin-' + pluginName);
			configuration.plugins.push(new Plugin(pluginConfigs[pluginName]));
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
		var source, fileConfig, results, demoResults, dependencies, demoSource, demoConfig, demoDepdendencies;
		return regeneratorRuntime.async(function lessTransform$(context$2$0) {
			while (1) switch (context$2$0.prev = context$2$0.next) {
				case 0:
					source = file.buffer.toString('utf-8');
					fileConfig = Object.assign({}, configuration);
					results = {};
					demoResults = {};
					dependencies = Object.keys(file.dependencies).reduce(function getDependencyPaths(paths, dependencyName) {
						paths[dependencyName] = file.dependencies[dependencyName].path;
						return paths;
					}, {});
					context$2$0.prev = 5;

					fileConfig.plugins.push(new _lessPluginPatternImport2['default']({ 'root': patternPath, 'patterns': dependencies }));
					context$2$0.next = 9;
					return render(source, fileConfig);

				case 9:
					results = context$2$0.sent;
					context$2$0.next = 15;
					break;

				case 12:
					context$2$0.prev = 12;
					context$2$0.t27 = context$2$0['catch'](5);
					throw context$2$0.t27;

				case 15:
					if (!demo) {
						context$2$0.next = 32;
						break;
					}

					demoSource = demo.buffer.toString('utf-8');
					demoConfig = Object.assign({}, configuration);
					demoDepdendencies = Object.assign({}, dependencies, { 'Pattern': file.path });
					context$2$0.prev = 19;

					demoConfig.plugins.push(new _lessPluginPatternImport2['default']({ 'root': patternPath, 'patterns': demoDepdendencies }));
					context$2$0.next = 23;
					return render(demoSource, demoConfig);

				case 23:
					demoResults = context$2$0.sent;
					context$2$0.next = 30;
					break;

				case 26:
					context$2$0.prev = 26;
					context$2$0.t28 = context$2$0['catch'](19);

					context$2$0.t28.file = demo.path;
					throw context$2$0.t28;

				case 30:

					file.demoBuffer = new Buffer(demoResults.css || '', 'utf-8');
					file.demoSource = demo.source;

				case 32:

					file.buffer = new Buffer(results.css || '', 'utf-8');

					file['in'] = config.inFormat;
					file.out = config.outFormat;

					return context$2$0.abrupt('return', file);

				case 36:
				case 'end':
					return context$2$0.stop();
			}
		}, null, this, [[5, 12], [19, 26]]);
	};
}

module.exports = exports['default'];