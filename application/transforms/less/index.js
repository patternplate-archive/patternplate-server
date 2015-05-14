'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = lessTransformFactory;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _less = require('less');

var _less2 = _interopRequireDefault(_less);

function replaceImports(file) {
	var deps = arguments[1] === undefined ? {} : arguments[1];

	var transformed = file.source.toString('utf-8');
	file.dependencies = Object.assign({}, file.dependencies, deps);

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = Object.keys(file.dependencies)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var dependencyName = _step.value;

			var search = new RegExp('@import(.*)\'' + dependencyName + '\';');
			var dependency = file.dependencies[dependencyName];

			if (dependency) {
				transformed = transformed.replace(search, dependency.source.toString('utf-8'));
			}
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

	file.source = new Buffer(transformed, 'utf-8');
	return transformed;
}

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
				context$1$0.t29 = context$1$0['catch'](0);
				throw context$1$0.t29;

			case 9:
			case 'end':
				return context$1$0.stop();
		}
	}, null, this, [[0, 6]]);
}

function lessTransformFactory(application) {
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
		'plugins': [],
		'paths': ['node_modules']
	};

	var _iteratorNormalCompletion2 = true;
	var _didIteratorError2 = false;
	var _iteratorError2 = undefined;

	try {
		for (var _iterator2 = plugins[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
			var pluginName = _step2.value;

			var Plugin = require('less-plugin-' + pluginName);

			configuration.plugins.push(new Plugin(pluginConfigs[pluginName]));
		}
	} catch (err) {
		_didIteratorError2 = true;
		_iteratorError2 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion2 && _iterator2['return']) {
				_iterator2['return']();
			}
		} finally {
			if (_didIteratorError2) {
				throw _iteratorError2;
			}
		}
	}

	return function lessTransform(file, demo) {
		var source, fileConfig, results, demoResults, demoSource, demoConfig;
		return regeneratorRuntime.async(function lessTransform$(context$2$0) {
			while (1) switch (context$2$0.prev = context$2$0.next) {
				case 0:
					source = replaceImports(file);
					fileConfig = Object.assign({}, configuration);
					results = {};
					demoResults = {};
					context$2$0.prev = 4;
					context$2$0.next = 7;
					return render(source, fileConfig);

				case 7:
					results = context$2$0.sent;
					context$2$0.next = 13;
					break;

				case 10:
					context$2$0.prev = 10;
					context$2$0.t30 = context$2$0['catch'](4);
					throw context$2$0.t30;

				case 13:
					if (!demo) {
						context$2$0.next = 27;
						break;
					}

					demoSource = replaceImports(demo, { 'Pattern': file });
					demoConfig = Object.assign({}, configuration);
					context$2$0.prev = 16;
					context$2$0.next = 19;
					return render(demoSource, demoConfig);

				case 19:
					demoResults = context$2$0.sent;
					context$2$0.next = 25;
					break;

				case 22:
					context$2$0.prev = 22;
					context$2$0.t31 = context$2$0['catch'](16);
					throw context$2$0.t31;

				case 25:

					file.demoBuffer = new Buffer(demoResults.css || '', 'utf-8');
					file.demoSource = demo.source;

				case 27:

					file.buffer = new Buffer(results.css || '', 'utf-8');

					file['in'] = config.inFormat;
					file.out = config.outFormat;

					return context$2$0.abrupt('return', file);

				case 31:
				case 'end':
					return context$2$0.stop();
			}
		}, null, this, [[4, 10], [16, 22]]);
	};
}

module.exports = exports['default'];