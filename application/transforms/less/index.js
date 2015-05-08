'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = lessTransformFactory;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _less = require('less');

var _less2 = _interopRequireDefault(_less);

var _qIoFs = require('q-io/fs');

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

			var dependency = file.dependencies[dependencyName];
			var search = new RegExp('@import(.*)\'' + dependencyName + '\';');
			transformed = transformed.replace(search, dependency.source.toString('utf-8'));
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
		var source, fileConfig, results, demoSource, demoConfig, demoResults;
		return regeneratorRuntime.async(function lessTransform$(context$2$0) {
			while (1) switch (context$2$0.prev = context$2$0.next) {
				case 0:
					source = replaceImports(file);
					fileConfig = Object.assign({}, configuration);

					fileConfig.paths.push(_qIoFs.directory(file.path));

					context$2$0.prev = 3;
					context$2$0.next = 6;
					return _less2['default'].render(source, fileConfig);

				case 6:
					results = context$2$0.sent;

					file.buffer = new Buffer(results.css, 'utf-8');
					context$2$0.next = 14;
					break;

				case 10:
					context$2$0.prev = 10;
					context$2$0.t26 = context$2$0['catch'](3);

					application.log.error(context$2$0.t26);
					throw new Error(context$2$0.t26);

				case 14:
					if (!demo) {
						context$2$0.next = 30;
						break;
					}

					context$2$0.prev = 15;
					demoSource = replaceImports(demo, { 'Pattern': file });
					demoConfig = Object.assign({}, configuration);

					demoConfig.paths.push(_qIoFs.directory(file.path));

					context$2$0.next = 21;
					return _less2['default'].render(demoSource, demoConfig);

				case 21:
					demoResults = context$2$0.sent;

					file.demoSource = demo.source;
					file.demoBuffer = new Buffer(demoResults.css, 'utf-8');
					context$2$0.next = 30;
					break;

				case 26:
					context$2$0.prev = 26;
					context$2$0.t27 = context$2$0['catch'](15);

					application.log.error(context$2$0.t27);
					throw context$2$0.t27;

				case 30:

					file['in'] = config.inFormat;
					file.out = config.outFormat;

					return context$2$0.abrupt('return', file);

				case 33:
				case 'end':
					return context$2$0.stop();
			}
		}, null, this, [[3, 10], [15, 26]]);
	};
}

module.exports = exports['default'];