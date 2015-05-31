'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _browserify = require('browserify');

var _browserify2 = _interopRequireDefault(_browserify);

function runBundler(bundler, config) {
	return regeneratorRuntime.async(function runBundler$(context$1$0) {
		while (1) switch (context$1$0.prev = context$1$0.next) {
			case 0:
				return context$1$0.abrupt('return', new Promise(function bundlerResolver(resolve, reject) {
					bundler.bundle(function onBundle(err, buffer) {

						if (err) {
							return reject(err);
						}

						resolve({
							'buffer': buffer,
							'in': config.inFormat,
							'out': config.outFormat
						});
					});
				}));

			case 1:
			case 'end':
				return context$1$0.stop();
		}
	}, null, this);
}

function resolveDependencies(file) {
	var data = [];

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = Object.keys(file.dependencies || {})[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var dependencyName = _step.value;

			if (file.dependencies[dependencyName]) {
				data = data.concat(resolveDependencies(file.dependencies[dependencyName])).concat([{
					'file': file.dependencies[dependencyName].path,
					'expose': dependencyName
				}]);
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

	return data;
}

function browserifyTransformFactory(application) {
	var config = application.configuration.transforms.browserify || {};

	var transformNames = Object.keys(config.transforms).map(function (transformName) {
		return config.transforms[transformName].enabled ? transformName : false;
	}).filter(function (item) {
		return item;
	});

	var transforms = transformNames.reduce(function getTransformConfig(results, transformName) {
		var transformFn = undefined;
		var transformConfig = config.transforms[transformName].opts || {};

		try {
			transformFn = require(transformName);
		} catch (error) {
			application.log.warn('Unable to load browserify transform ' + transformName + '.');
			application.log.error(error.stack);
		}

		results[transformName] = [transformFn, transformConfig];
		return results;
	}, {});

	return function browserifyTransform(file, demo) {
		var bundler, dependencies, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, transformName, demoBundler, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, demoTransformed, transformed;

		return regeneratorRuntime.async(function browserifyTransform$(context$2$0) {
			while (1) switch (context$2$0.prev = context$2$0.next) {
				case 0:
					bundler = (0, _browserify2['default'])(Object.assign(config.opts, {
						'entries': file.path
					}));
					dependencies = resolveDependencies(file);

					bundler.require(dependencies);

					_iteratorNormalCompletion2 = true;
					_didIteratorError2 = false;
					_iteratorError2 = undefined;
					context$2$0.prev = 6;
					for (_iterator2 = Object.keys(transforms)[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						transformName = _step2.value;

						bundler.transform(transforms[transformName]);
					}

					context$2$0.next = 14;
					break;

				case 10:
					context$2$0.prev = 10;
					context$2$0.t21 = context$2$0['catch'](6);
					_didIteratorError2 = true;
					_iteratorError2 = context$2$0.t21;

				case 14:
					context$2$0.prev = 14;
					context$2$0.prev = 15;

					if (!_iteratorNormalCompletion2 && _iterator2['return']) {
						_iterator2['return']();
					}

				case 17:
					context$2$0.prev = 17;

					if (!_didIteratorError2) {
						context$2$0.next = 20;
						break;
					}

					throw _iteratorError2;

				case 20:
					return context$2$0.finish(17);

				case 21:
					return context$2$0.finish(14);

				case 22:
					if (!demo) {
						context$2$0.next = 48;
						break;
					}

					demoBundler = (0, _browserify2['default'])(Object.assign(config.opts, {
						'entries': demo.path
					}));

					demoBundler.require(resolveDependencies({
						'dependencies': {
							'Pattern': file
						}
					}));

					_iteratorNormalCompletion3 = true;
					_didIteratorError3 = false;
					_iteratorError3 = undefined;
					context$2$0.prev = 28;
					for (_iterator3 = Object.keys(transforms)[Symbol.iterator](); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
						transformName = _step3.value;

						demoBundler.transform(transforms[transformName]);
					}

					context$2$0.next = 36;
					break;

				case 32:
					context$2$0.prev = 32;
					context$2$0.t22 = context$2$0['catch'](28);
					_didIteratorError3 = true;
					_iteratorError3 = context$2$0.t22;

				case 36:
					context$2$0.prev = 36;
					context$2$0.prev = 37;

					if (!_iteratorNormalCompletion3 && _iterator3['return']) {
						_iterator3['return']();
					}

				case 39:
					context$2$0.prev = 39;

					if (!_didIteratorError3) {
						context$2$0.next = 42;
						break;
					}

					throw _iteratorError3;

				case 42:
					return context$2$0.finish(39);

				case 43:
					return context$2$0.finish(36);

				case 44:
					context$2$0.next = 46;
					return runBundler(demoBundler, config);

				case 46:
					demoTransformed = context$2$0.sent;

					Object.assign(file, {
						'demoSource': demo.source,
						'demoBuffer': demoTransformed.buffer
					});

				case 48:
					transformed = undefined;
					context$2$0.prev = 49;
					context$2$0.next = 52;
					return runBundler(bundler, config);

				case 52:
					context$2$0.next = 58;
					break;

				case 54:
					context$2$0.prev = 54;
					context$2$0.t23 = context$2$0['catch'](49);

					context$2$0.t23.file = context$2$0.t23.fileName;
					throw context$2$0.t23;

				case 58:

					Object.assign(file, transformed);
					return context$2$0.abrupt('return', file);

				case 60:
				case 'end':
					return context$2$0.stop();
			}
		}, null, this, [[6, 10, 14, 22], [15,, 17, 21], [28, 32, 36, 44], [37,, 39, 43], [49, 54]]);
	};
}

exports['default'] = browserifyTransformFactory;
module.exports = exports['default'];