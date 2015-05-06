'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _browserify = require('browserify');

var _browserify2 = _interopRequireDefault(_browserify);

var _qIoFs = require('q-io/fs');

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

function browserifyTransformFactory(application) {
	var config = application.configuration.transforms.browserify || {};

	var transforms = Object.keys(config.transforms).map(function (transformName) {
		return config.transforms[transformName].enabled ? transformName : false;
	}).filter(function (item) {
		return item;
	});

	var transformConfigs = transforms.reduce(function getTransformConfig(results, transformName) {
		results[transformName] = config.transforms[transformName].opts || {};
		return results;
	}, {});

	return function browserifyTransform(file, dependencies, demo) {
		var bundler, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, dependencyName, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, transformName, demoBundler, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, demoTransformed, transformed;

		return regeneratorRuntime.async(function browserifyTransform$(context$2$0) {
			while (1) switch (context$2$0.prev = context$2$0.next) {
				case 0:
					bundler = _browserify2['default'](Object.assign(config.opts, {
						'entries': file.path,
						'basedir': _qIoFs.directory(file.path)
					}));
					_iteratorNormalCompletion = true;
					_didIteratorError = false;
					_iteratorError = undefined;
					context$2$0.prev = 4;

					for (_iterator = Object.keys(dependencies)[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						dependencyName = _step.value;

						bundler.require(dependencies[dependencyName].path, {
							'expose': dependencyName,
							'basedir': _qIoFs.directory(dependencies[dependencyName].path)
						});
					}

					context$2$0.next = 12;
					break;

				case 8:
					context$2$0.prev = 8;
					context$2$0.t24 = context$2$0['catch'](4);
					_didIteratorError = true;
					_iteratorError = context$2$0.t24;

				case 12:
					context$2$0.prev = 12;
					context$2$0.prev = 13;

					if (!_iteratorNormalCompletion && _iterator['return']) {
						_iterator['return']();
					}

				case 15:
					context$2$0.prev = 15;

					if (!_didIteratorError) {
						context$2$0.next = 18;
						break;
					}

					throw _iteratorError;

				case 18:
					return context$2$0.finish(15);

				case 19:
					return context$2$0.finish(12);

				case 20:
					_iteratorNormalCompletion2 = true;
					_didIteratorError2 = false;
					_iteratorError2 = undefined;
					context$2$0.prev = 23;
					for (_iterator2 = transforms[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						transformName = _step2.value;

						bundler.transform(transformName, transformConfigs[transformName]);
					}

					context$2$0.next = 31;
					break;

				case 27:
					context$2$0.prev = 27;
					context$2$0.t25 = context$2$0['catch'](23);
					_didIteratorError2 = true;
					_iteratorError2 = context$2$0.t25;

				case 31:
					context$2$0.prev = 31;
					context$2$0.prev = 32;

					if (!_iteratorNormalCompletion2 && _iterator2['return']) {
						_iterator2['return']();
					}

				case 34:
					context$2$0.prev = 34;

					if (!_didIteratorError2) {
						context$2$0.next = 37;
						break;
					}

					throw _iteratorError2;

				case 37:
					return context$2$0.finish(34);

				case 38:
					return context$2$0.finish(31);

				case 39:
					if (!demo) {
						context$2$0.next = 64;
						break;
					}

					demoBundler = _browserify2['default'](Object.assign(config.opts, {
						'entries': demo.path,
						'basedir': _qIoFs.directory(demo.path)
					}));
					_iteratorNormalCompletion3 = true;
					_didIteratorError3 = false;
					_iteratorError3 = undefined;
					context$2$0.prev = 44;

					for (_iterator3 = transforms[Symbol.iterator](); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
						transformName = _step3.value;

						demoBundler.transform(transformName, transformConfigs[transformName]);
					}

					context$2$0.next = 52;
					break;

				case 48:
					context$2$0.prev = 48;
					context$2$0.t26 = context$2$0['catch'](44);
					_didIteratorError3 = true;
					_iteratorError3 = context$2$0.t26;

				case 52:
					context$2$0.prev = 52;
					context$2$0.prev = 53;

					if (!_iteratorNormalCompletion3 && _iterator3['return']) {
						_iterator3['return']();
					}

				case 55:
					context$2$0.prev = 55;

					if (!_didIteratorError3) {
						context$2$0.next = 58;
						break;
					}

					throw _iteratorError3;

				case 58:
					return context$2$0.finish(55);

				case 59:
					return context$2$0.finish(52);

				case 60:
					context$2$0.next = 62;
					return runBundler(demoBundler, config);

				case 62:
					demoTransformed = context$2$0.sent;

					Object.assign(file, {
						'demoSource': demo.source,
						'demoBuffer': demoTransformed.buffer
					});

				case 64:
					context$2$0.next = 66;
					return runBundler(bundler, config);

				case 66:
					transformed = context$2$0.sent;

					Object.assign(file, transformed);

					return context$2$0.abrupt('return', file);

				case 69:
				case 'end':
					return context$2$0.stop();
			}
		}, null, this, [[4, 8, 12, 20], [13,, 15, 19], [23, 27, 31, 39], [32,, 34, 38], [44, 48, 52, 60], [53,, 55, 59]]);
	};
}

exports['default'] = browserifyTransformFactory;
module.exports = exports['default'];