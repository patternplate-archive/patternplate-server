'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _vinyl = require('vinyl');

var _vinyl2 = _interopRequireDefault(_vinyl);

var _path = require('path');

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
			var expose = _step.value;

			var dependency = file.dependencies[expose];
			var basedir = (0, _path.dirname)(dependency.path);
			var opts = { expose: expose, basedir: basedir };

			var contents = Buffer.isBuffer(dependency.source) ? dependency.source : new Buffer(dependency.source);
			var stream = new _vinyl2['default']({ contents: contents });

			if (dependency) {
				data = data.concat(resolveDependencies(dependency)).concat({ stream: stream, opts: opts, contents: contents });
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
	return function browserifyTransform(file, demo, configuration) {
		var contents, stream, transformNames, transforms, bundler, dependencies, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, transformName, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, transformed;

		return regeneratorRuntime.async(function browserifyTransform$(context$2$0) {
			var _this = this;

			while (1) switch (context$2$0.prev = context$2$0.next) {
				case 0:
					contents = new Buffer(file.source);
					stream = new _vinyl2['default']({ contents: contents });
					transformNames = Object.keys(configuration.transforms).map(function (transformName) {
						return configuration.transforms[transformName].enabled ? transformName : false;
					}).filter(function (item) {
						return item;
					});
					transforms = transformNames.reduce(function getTransformConfig(results, transformName) {
						var transformFn = undefined;
						var transformConfig = configuration.transforms[transformName].opts || {};

						try {
							transformFn = require(transformName);
						} catch (error) {
							application.log.warn('Unable to load browserify transform ' + transformName + '.');
							application.log.error(error.stack);
						}

						results[transformName] = [transformFn, transformConfig];
						return results;
					}, {});
					bundler = (0, _browserify2['default'])(stream, configuration.opts);
					dependencies = resolveDependencies(file);

					dependencies.forEach(function requireDependency(dependency) {
						bundler.exclude(dependency.opts.expose);
						bundler.require(dependency.stream, dependency.opts);
					});

					_iteratorNormalCompletion2 = true;
					_didIteratorError2 = false;
					_iteratorError2 = undefined;
					context$2$0.prev = 10;
					for (_iterator2 = Object.keys(transforms)[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						transformName = _step2.value;

						bundler.transform.apply(bundler, _toConsumableArray(transforms[transformName]));
					}

					context$2$0.next = 18;
					break;

				case 14:
					context$2$0.prev = 14;
					context$2$0.t0 = context$2$0['catch'](10);
					_didIteratorError2 = true;
					_iteratorError2 = context$2$0.t0;

				case 18:
					context$2$0.prev = 18;
					context$2$0.prev = 19;

					if (!_iteratorNormalCompletion2 && _iterator2['return']) {
						_iterator2['return']();
					}

				case 21:
					context$2$0.prev = 21;

					if (!_didIteratorError2) {
						context$2$0.next = 24;
						break;
					}

					throw _iteratorError2;

				case 24:
					return context$2$0.finish(21);

				case 25:
					return context$2$0.finish(18);

				case 26:
					if (!demo) {
						context$2$0.next = 29;
						break;
					}

					context$2$0.next = 29;
					return regeneratorRuntime.awrap((function callee$2$0() {
						var demoStream, demoBundler, Pattern, demoDependencies, transformName, demoTransformed;
						return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
							while (1) switch (context$3$0.prev = context$3$0.next) {
								case 0:
									demoStream = new _vinyl2['default']({ 'contents': new Buffer(demo.source) });
									demoBundler = (0, _browserify2['default'])(demoStream, configuration.opts);
									Pattern = Object.assign({}, file);
									demoDependencies = resolveDependencies({ 'dependencies': { Pattern: Pattern } });

									demoDependencies.forEach(function requireDependency(dependency) {
										demoBundler.exclude(dependency.opts.expose);
										demoBundler.require(dependency.stream, Object.assign(dependency.opts));
									});

									_iteratorNormalCompletion3 = true;
									_didIteratorError3 = false;
									_iteratorError3 = undefined;
									context$3$0.prev = 8;
									for (_iterator3 = Object.keys(transforms)[Symbol.iterator](); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
										transformName = _step3.value;

										demoBundler.transform.apply(demoBundler, _toConsumableArray(transforms[transformName]));
									}

									context$3$0.next = 16;
									break;

								case 12:
									context$3$0.prev = 12;
									context$3$0.t0 = context$3$0['catch'](8);
									_didIteratorError3 = true;
									_iteratorError3 = context$3$0.t0;

								case 16:
									context$3$0.prev = 16;
									context$3$0.prev = 17;

									if (!_iteratorNormalCompletion3 && _iterator3['return']) {
										_iterator3['return']();
									}

								case 19:
									context$3$0.prev = 19;

									if (!_didIteratorError3) {
										context$3$0.next = 22;
										break;
									}

									throw _iteratorError3;

								case 22:
									return context$3$0.finish(19);

								case 23:
									return context$3$0.finish(16);

								case 24:
									demoTransformed = undefined;
									context$3$0.prev = 25;
									context$3$0.next = 28;
									return regeneratorRuntime.awrap(runBundler(demoBundler, configuration));

								case 28:
									demoTransformed = context$3$0.sent;
									context$3$0.next = 35;
									break;

								case 31:
									context$3$0.prev = 31;
									context$3$0.t1 = context$3$0['catch'](25);

									context$3$0.t1.file = demo.path || context$3$0.t1.fileName;
									throw context$3$0.t1;

								case 35:

									Object.assign(file, {
										'demoSource': demo.source,
										'demoBuffer': demoTransformed.buffer
									});

								case 36:
								case 'end':
									return context$3$0.stop();
							}
						}, null, _this, [[8, 12, 16, 24], [17,, 19, 23], [25, 31]]);
					})());

				case 29:
					transformed = undefined;
					context$2$0.prev = 30;
					context$2$0.next = 33;
					return regeneratorRuntime.awrap(runBundler(bundler, configuration));

				case 33:
					transformed = context$2$0.sent;
					context$2$0.next = 40;
					break;

				case 36:
					context$2$0.prev = 36;
					context$2$0.t1 = context$2$0['catch'](30);

					context$2$0.t1.file = file.path || context$2$0.t1.fileName;
					throw context$2$0.t1;

				case 40:

					Object.assign(file, transformed);
					file['in'] = configuration.inFormat;
					file.out = configuration.outFormat;

					return context$2$0.abrupt('return', file);

				case 44:
				case 'end':
					return context$2$0.stop();
			}
		}, null, this, [[10, 14, 18, 26], [19,, 21, 25], [30, 36]]);
	};
}

exports['default'] = browserifyTransformFactory;
module.exports = exports['default'];