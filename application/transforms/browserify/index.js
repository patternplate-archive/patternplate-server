'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _path = require('path');

var _vinyl = require('vinyl');

var _vinyl2 = _interopRequireDefault(_vinyl);

var _browserify = require('browserify');

var _browserify2 = _interopRequireDefault(_browserify);

var _resolve = require('resolve');

var _resolve2 = _interopRequireDefault(_resolve);

function runBundler(bundler, config) {
	return regeneratorRuntime.async(function runBundler$(context$1$0) {
		while (1) switch (context$1$0.prev = context$1$0.next) {
			case 0:
				return context$1$0.abrupt('return', new Promise(function bundlerResolver(resolve, reject) {
					bundler.bundle(function onBundle(err, buffer) {
						if (err) {
							throw err;
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

function resolveDependencies(file, bundler, configuration) {
	var dependencies, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, expose, dependency, basedir, opts, contents, dependencyStream, dependencyBundler, subDependencies, results;

	return regeneratorRuntime.async(function resolveDependencies$(context$1$0) {
		while (1) switch (context$1$0.prev = context$1$0.next) {
			case 0:
				dependencies = [];
				_iteratorNormalCompletion = true;
				_didIteratorError = false;
				_iteratorError = undefined;
				context$1$0.prev = 4;
				_iterator = Object.keys(file.dependencies || {})[Symbol.iterator]();

			case 6:
				if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
					context$1$0.next = 33;
					break;
				}

				expose = _step.value;

				dependencies.push(expose);

				dependency = file.dependencies[expose];
				basedir = (0, _path.dirname)(dependency.path);
				opts = { expose: expose, basedir: basedir };
				contents = Buffer.isBuffer(dependency.source) ? dependency.source : new Buffer(dependency.source);
				dependencyStream = new _vinyl2['default']({ contents: contents });
				dependencyBundler = (0, _browserify2['default'])(dependencyStream, Object.assign({}, configuration.opts));
				context$1$0.next = 17;
				return regeneratorRuntime.awrap(resolveDependencies(dependency, dependencyBundler, configuration));

			case 17:
				subDependencies = context$1$0.sent;

				dependencies = dependencies.concat(subDependencies);

				context$1$0.prev = 19;
				context$1$0.next = 22;
				return regeneratorRuntime.awrap(runBundler(dependencyBundler, configuration));

			case 22:
				results = context$1$0.sent;

				dependencies.forEach(function (dependency) {
					bundler.exclude(dependency);
				});
				bundler.require(new _vinyl2['default']({ 'contents': results.buffer }), opts);
				context$1$0.next = 30;
				break;

			case 27:
				context$1$0.prev = 27;
				context$1$0.t0 = context$1$0['catch'](19);
				throw context$1$0.t0;

			case 30:
				_iteratorNormalCompletion = true;
				context$1$0.next = 6;
				break;

			case 33:
				context$1$0.next = 39;
				break;

			case 35:
				context$1$0.prev = 35;
				context$1$0.t1 = context$1$0['catch'](4);
				_didIteratorError = true;
				_iteratorError = context$1$0.t1;

			case 39:
				context$1$0.prev = 39;
				context$1$0.prev = 40;

				if (!_iteratorNormalCompletion && _iterator['return']) {
					_iterator['return']();
				}

			case 42:
				context$1$0.prev = 42;

				if (!_didIteratorError) {
					context$1$0.next = 45;
					break;
				}

				throw _iteratorError;

			case 45:
				return context$1$0.finish(42);

			case 46:
				return context$1$0.finish(39);

			case 47:
				return context$1$0.abrupt('return', dependencies);

			case 48:
			case 'end':
				return context$1$0.stop();
		}
	}, null, this, [[4, 35, 39, 47], [19, 27], [40,, 42, 46]]);
}

function browserifyTransformFactory(application) {
	return function browserifyTransform(file, demo, configuration) {
		var contents, stream, transformNames, transforms, bundler, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, transformName, demoStream, demoBundler, Pattern, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, demoTransformed, transformed;

		return regeneratorRuntime.async(function browserifyTransform$(context$2$0) {
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

					if (configuration.opts && configuration.opts.noParse) {
						configuration.opts.noParse = configuration.opts.noParse.map(function (item) {
							var basedir = (0, _path.resolve)(application.runtime.patterncwd || application.runtime.cwd);
							try {
								return _resolve2['default'].sync(item, { basedir: basedir });
							} catch (err) {
								console.log(err);
							}
							return null;
						}).filter(function (item) {
							return item;
						});
					}

					configuration.opts.debug = false;

					bundler = (0, _browserify2['default'])(stream, configuration.opts);
					context$2$0.prev = 7;
					context$2$0.next = 10;
					return regeneratorRuntime.awrap(resolveDependencies(file, bundler, configuration));

				case 10:
					context$2$0.next = 15;
					break;

				case 12:
					context$2$0.prev = 12;
					context$2$0.t0 = context$2$0['catch'](7);

					console.log(context$2$0.t0);

				case 15:
					_iteratorNormalCompletion2 = true;
					_didIteratorError2 = false;
					_iteratorError2 = undefined;
					context$2$0.prev = 18;

					for (_iterator2 = Object.keys(transforms)[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						transformName = _step2.value;

						bundler.transform.apply(bundler, _toConsumableArray(transforms[transformName]));
					}

					context$2$0.next = 26;
					break;

				case 22:
					context$2$0.prev = 22;
					context$2$0.t1 = context$2$0['catch'](18);
					_didIteratorError2 = true;
					_iteratorError2 = context$2$0.t1;

				case 26:
					context$2$0.prev = 26;
					context$2$0.prev = 27;

					if (!_iteratorNormalCompletion2 && _iterator2['return']) {
						_iterator2['return']();
					}

				case 29:
					context$2$0.prev = 29;

					if (!_didIteratorError2) {
						context$2$0.next = 32;
						break;
					}

					throw _iteratorError2;

				case 32:
					return context$2$0.finish(29);

				case 33:
					return context$2$0.finish(26);

				case 34:
					if (!demo) {
						context$2$0.next = 77;
						break;
					}

					demoStream = new _vinyl2['default']({ 'contents': new Buffer(demo.source) });
					demoBundler = (0, _browserify2['default'])(demoStream, configuration.opts);
					Pattern = Object.assign({}, file);
					context$2$0.prev = 38;
					context$2$0.next = 41;
					return regeneratorRuntime.awrap(resolveDependencies({ 'dependencies': { Pattern: Pattern }, 'path': demo.path }, demoBundler, configuration));

				case 41:
					context$2$0.next = 46;
					break;

				case 43:
					context$2$0.prev = 43;
					context$2$0.t2 = context$2$0['catch'](38);

					console.log(context$2$0.t2);

				case 46:
					_iteratorNormalCompletion3 = true;
					_didIteratorError3 = false;
					_iteratorError3 = undefined;
					context$2$0.prev = 49;

					for (_iterator3 = Object.keys(transforms)[Symbol.iterator](); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
						transformName = _step3.value;

						demoBundler.transform.apply(demoBundler, _toConsumableArray(transforms[transformName]));
					}

					context$2$0.next = 57;
					break;

				case 53:
					context$2$0.prev = 53;
					context$2$0.t3 = context$2$0['catch'](49);
					_didIteratorError3 = true;
					_iteratorError3 = context$2$0.t3;

				case 57:
					context$2$0.prev = 57;
					context$2$0.prev = 58;

					if (!_iteratorNormalCompletion3 && _iterator3['return']) {
						_iterator3['return']();
					}

				case 60:
					context$2$0.prev = 60;

					if (!_didIteratorError3) {
						context$2$0.next = 63;
						break;
					}

					throw _iteratorError3;

				case 63:
					return context$2$0.finish(60);

				case 64:
					return context$2$0.finish(57);

				case 65:
					demoTransformed = undefined;
					context$2$0.prev = 66;
					context$2$0.next = 69;
					return regeneratorRuntime.awrap(runBundler(demoBundler, configuration));

				case 69:
					demoTransformed = context$2$0.sent;
					context$2$0.next = 76;
					break;

				case 72:
					context$2$0.prev = 72;
					context$2$0.t4 = context$2$0['catch'](66);

					context$2$0.t4.file = demo.path || context$2$0.t4.fileName;
					throw context$2$0.t4;

				case 76:

					Object.assign(file, {
						'demoSource': demo.source,
						'demoBuffer': demoTransformed.buffer
					});

				case 77:
					transformed = undefined;
					context$2$0.prev = 78;
					context$2$0.next = 81;
					return regeneratorRuntime.awrap(runBundler(bundler, configuration));

				case 81:
					transformed = context$2$0.sent;
					context$2$0.next = 88;
					break;

				case 84:
					context$2$0.prev = 84;
					context$2$0.t5 = context$2$0['catch'](78);

					context$2$0.t5.file = file.path || context$2$0.t5.fileName;
					throw context$2$0.t5;

				case 88:

					Object.assign(file, transformed);
					file['in'] = configuration.inFormat;
					file.out = configuration.outFormat;

					return context$2$0.abrupt('return', file);

				case 92:
				case 'end':
					return context$2$0.stop();
			}
		}, null, this, [[7, 12], [18, 22, 26, 34], [27,, 29, 33], [38, 43], [49, 53, 57, 65], [58,, 60, 64], [66, 72], [78, 84]]);
	};
}

exports['default'] = browserifyTransformFactory;
module.exports = exports['default'];