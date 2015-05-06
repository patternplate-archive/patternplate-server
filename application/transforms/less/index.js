'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = lessTransformFactory;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _less = require('less');

var _less2 = _interopRequireDefault(_less);

var _qIoFs = require('q-io/fs');

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
		'paths': [_path.resolve(application.runtime.cwd, 'node_modules')]
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

	return function lessTransform(file, dependencies, demo) {
		var source, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, dependencyName, dependency, search, results, demoResults;

		return regeneratorRuntime.async(function lessTransform$(context$2$0) {
			while (1) switch (context$2$0.prev = context$2$0.next) {
				case 0:
					source = file.buffer.toString('utf-8');

					configuration.paths.push(_qIoFs.directory(file.path));

					_iteratorNormalCompletion2 = true;
					_didIteratorError2 = false;
					_iteratorError2 = undefined;
					context$2$0.prev = 5;
					for (_iterator2 = Object.keys(dependencies)[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						dependencyName = _step2.value;
						dependency = dependencies[dependencyName];
						search = new RegExp('@import(.*)\'' + dependencyName + '\';');

						source = source.replace(search, '@import \'' + dependency.path + '\';');
					}

					context$2$0.next = 13;
					break;

				case 9:
					context$2$0.prev = 9;
					context$2$0.t27 = context$2$0['catch'](5);
					_didIteratorError2 = true;
					_iteratorError2 = context$2$0.t27;

				case 13:
					context$2$0.prev = 13;
					context$2$0.prev = 14;

					if (!_iteratorNormalCompletion2 && _iterator2['return']) {
						_iterator2['return']();
					}

				case 16:
					context$2$0.prev = 16;

					if (!_didIteratorError2) {
						context$2$0.next = 19;
						break;
					}

					throw _iteratorError2;

				case 19:
					return context$2$0.finish(16);

				case 20:
					return context$2$0.finish(13);

				case 21:
					context$2$0.prev = 21;
					context$2$0.next = 24;
					return _less2['default'].render(source, configuration);

				case 24:
					results = context$2$0.sent;

					file.buffer = new Buffer(results.css, 'utf-8');
					context$2$0.next = 32;
					break;

				case 28:
					context$2$0.prev = 28;
					context$2$0.t28 = context$2$0['catch'](21);

					application.log.error(context$2$0.t28);
					throw new Error(context$2$0.t28);

				case 32:
					if (!demo) {
						context$2$0.next = 45;
						break;
					}

					context$2$0.prev = 33;
					context$2$0.next = 36;
					return _less2['default'].render(demo.buffer.toString('utf-8'), configuration);

				case 36:
					demoResults = context$2$0.sent;

					file.demoSource = demo.source;
					file.demoBuffer = new Buffer(demoResults.css, 'utf-8');
					context$2$0.next = 45;
					break;

				case 41:
					context$2$0.prev = 41;
					context$2$0.t29 = context$2$0['catch'](33);

					application.log.error(context$2$0.t29);
					throw context$2$0.t29;

				case 45:

					file['in'] = config.inFormat;
					file.out = config.outFormat;

					return context$2$0.abrupt('return', file);

				case 48:
				case 'end':
					return context$2$0.stop();
			}
		}, null, this, [[5, 9, 13, 21], [14,, 16, 20], [21, 28], [33, 41]]);
	};
}

module.exports = exports['default'];