'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _vinyl = require('vinyl');

var _vinyl2 = _interopRequireDefault(_vinyl);

var _path = require('path');

var _browserify = require('browserify');

var _browserify2 = _interopRequireDefault(_browserify);

var _lodashOmit = require('lodash.omit');

var _lodashOmit2 = _interopRequireDefault(_lodashOmit);

function getLatestMTime(file) {
	var mtimes = Object.keys(file.dependencies || {}).reduce(function (results, dependencyName) {
		var dependency = file.dependencies[dependencyName];
		results.push(dependency.fs.node.mtime);
		return results;
	}, [file.fs.node.mtime]);

	return mtimes.sort(function (a, b) {
		return b - a;
	})[0];
}

function runBundler(bundler, config, meta) {
	return regeneratorRuntime.async(function runBundler$(context$1$0) {
		while (1) switch (context$1$0.prev = context$1$0.next) {
			case 0:
				return context$1$0.abrupt('return', new Promise(function bundlerResolver(resolver, rejecter) {
					bundler.bundle(function onBundle(err, buffer) {
						if (err) {
							console.error('Error while bundling ' + meta.path);
							console.error(err);
							rejecter(err);
						}

						resolver({
							'buffer': buffer || new Buffer(''),
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

function squashDependencies(file) {
	var registry = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = Object.keys(file.dependencies)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var dependencyName = _step.value;

			var dependency = file.dependencies[dependencyName];

			if (!(dependencyName in registry) || registry[dependencyName].path === dependency.path) {
				registry[dependencyName] = {
					'path': dependency.path,
					'source': dependency.source,
					'buffer': dependency.buffer,
					'dependencies': dependency.dependencies
				};
				//copy.dependencies = omit(copy.dependencies, dependencyName);
				file.dependencies = (0, _lodashOmit2['default'])(file.dependencies, dependencyName);
				dependency = registry[dependencyName];
			}

			squashDependencies(dependency, registry);
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

	return registry;
}

function resolveDependencies(file, configuration) {
	var dependencies, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, expose, dependency, basedir, opts, dependencyBundler, transformed, contents, bundler, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3;

	return regeneratorRuntime.async(function resolveDependencies$(context$1$0) {
		while (1) switch (context$1$0.prev = context$1$0.next) {
			case 0:
				dependencies = squashDependencies(file);
				_iteratorNormalCompletion2 = true;
				_didIteratorError2 = false;
				_iteratorError2 = undefined;
				context$1$0.prev = 4;
				_iterator2 = Object.keys(dependencies)[Symbol.iterator]();

			case 6:
				if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
					context$1$0.next = 30;
					break;
				}

				expose = _step2.value;
				dependency = dependencies[expose];

				if (!(dependency.dependencies && Object.keys(dependency.dependencies).length > 0)) {
					context$1$0.next = 26;
					break;
				}

				basedir = (0, _path.dirname)(dependency.path);
				opts = { expose: expose, basedir: basedir };
				dependencyBundler = resolveDependencies(dependency, Object.assign({}, configuration.opts, opts, { 'standalone': expose }));
				transformed = undefined;
				context$1$0.prev = 14;
				context$1$0.next = 17;
				return regeneratorRuntime.awrap(runBundler(dependencyBundler, configuration, dependency));

			case 17:
				transformed = context$1$0.sent;
				context$1$0.next = 23;
				break;

			case 20:
				context$1$0.prev = 20;
				context$1$0.t0 = context$1$0['catch'](14);
				throw context$1$0.t0;

			case 23:

				dependency.buffer = transformed.buffer.toString('utf-8');
				context$1$0.next = 27;
				break;

			case 26:
				// Squashed and flat dependencies (way faster)
				dependency.buffer = dependency.source;

			case 27:
				_iteratorNormalCompletion2 = true;
				context$1$0.next = 6;
				break;

			case 30:
				context$1$0.next = 36;
				break;

			case 32:
				context$1$0.prev = 32;
				context$1$0.t1 = context$1$0['catch'](4);
				_didIteratorError2 = true;
				_iteratorError2 = context$1$0.t1;

			case 36:
				context$1$0.prev = 36;
				context$1$0.prev = 37;

				if (!_iteratorNormalCompletion2 && _iterator2['return']) {
					_iterator2['return']();
				}

			case 39:
				context$1$0.prev = 39;

				if (!_didIteratorError2) {
					context$1$0.next = 42;
					break;
				}

				throw _iteratorError2;

			case 42:
				return context$1$0.finish(39);

			case 43:
				return context$1$0.finish(36);

			case 44:
				contents = new Buffer(file.buffer);
				bundler = (0, _browserify2['default'])(new _vinyl2['default']({ contents: contents }), configuration.opts);
				_iteratorNormalCompletion3 = true;
				_didIteratorError3 = false;
				_iteratorError3 = undefined;
				context$1$0.prev = 49;

				for (_iterator3 = Object.keys(dependencies)[Symbol.iterator](); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					expose = _step3.value;
					dependency = dependencies[expose];
					basedir = (0, _path.dirname)(dependency.path);
					opts = { expose: expose, basedir: basedir };

					bundler.exclude(expose);
					bundler.require(new _vinyl2['default']({ 'contents': new Buffer(dependency.buffer) }), Object.assign({}, configuration.opts, opts));
				}

				context$1$0.next = 57;
				break;

			case 53:
				context$1$0.prev = 53;
				context$1$0.t2 = context$1$0['catch'](49);
				_didIteratorError3 = true;
				_iteratorError3 = context$1$0.t2;

			case 57:
				context$1$0.prev = 57;
				context$1$0.prev = 58;

				if (!_iteratorNormalCompletion3 && _iterator3['return']) {
					_iterator3['return']();
				}

			case 60:
				context$1$0.prev = 60;

				if (!_didIteratorError3) {
					context$1$0.next = 63;
					break;
				}

				throw _iteratorError3;

			case 63:
				return context$1$0.finish(60);

			case 64:
				return context$1$0.finish(57);

			case 65:
				return context$1$0.abrupt('return', bundler);

			case 66:
			case 'end':
				return context$1$0.stop();
		}
	}, null, this, [[4, 32, 36, 44], [14, 20], [37,, 39, 43], [49, 53, 57, 65], [58,, 60, 64]]);
}

function browserifyTransformFactory(application) {
	return function browserifyTransform(file, demo, configuration) {
		var transformNames, transforms, bundler, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, transformName, _transforms$transformName, transformFn, transformConfig, _bundler, mtime, transformed, bundled, demoBundler, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, _transforms$transformName2, _demoBundler, demoTransformed;

		return regeneratorRuntime.async(function browserifyTransform$(context$2$0) {
			while (1) switch (context$2$0.prev = context$2$0.next) {
				case 0:
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

					if (demo) {
						context$2$0.next = 48;
						break;
					}

					bundler = undefined;
					context$2$0.prev = 4;
					context$2$0.next = 7;
					return regeneratorRuntime.awrap(resolveDependencies(file, configuration, application.cache));

				case 7:
					bundler = context$2$0.sent;
					context$2$0.next = 13;
					break;

				case 10:
					context$2$0.prev = 10;
					context$2$0.t0 = context$2$0['catch'](4);
					throw context$2$0.t0;

				case 13:
					_iteratorNormalCompletion4 = true;
					_didIteratorError4 = false;
					_iteratorError4 = undefined;
					context$2$0.prev = 16;

					for (_iterator4 = Object.keys(transforms)[Symbol.iterator](); !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
						transformName = _step4.value;
						_transforms$transformName = _slicedToArray(transforms[transformName], 2);
						transformFn = _transforms$transformName[0];
						transformConfig = _transforms$transformName[1];

						if (typeof transformFn.configure === 'function') {
							bundler.transform(transformFn.configure(transformConfig));
						} else {
							(_bundler = bundler).transform.apply(_bundler, _toConsumableArray(transforms[transformName]));
						}
					}

					context$2$0.next = 24;
					break;

				case 20:
					context$2$0.prev = 20;
					context$2$0.t1 = context$2$0['catch'](16);
					_didIteratorError4 = true;
					_iteratorError4 = context$2$0.t1;

				case 24:
					context$2$0.prev = 24;
					context$2$0.prev = 25;

					if (!_iteratorNormalCompletion4 && _iterator4['return']) {
						_iterator4['return']();
					}

				case 27:
					context$2$0.prev = 27;

					if (!_didIteratorError4) {
						context$2$0.next = 30;
						break;
					}

					throw _iteratorError4;

				case 30:
					return context$2$0.finish(27);

				case 31:
					return context$2$0.finish(24);

				case 32:
					mtime = getLatestMTime(file);
					transformed = application.cache && application.cache.get('browserify:' + file.path, mtime);

					if (transformed) {
						context$2$0.next = 47;
						break;
					}

					context$2$0.prev = 35;
					context$2$0.next = 38;
					return regeneratorRuntime.awrap(runBundler(bundler, configuration, file));

				case 38:
					bundled = context$2$0.sent;

					transformed = bundled ? bundled.buffer : file.buffer;
					if (application.cache) {
						application.cache.set('browserify:' + file.path, mtime, transformed.buffer);
					}
					context$2$0.next = 47;
					break;

				case 43:
					context$2$0.prev = 43;
					context$2$0.t2 = context$2$0['catch'](35);

					context$2$0.t2.file = file.path || context$2$0.t2.fileName;
					throw context$2$0.t2;

				case 47:

					Object.assign(file, {
						'buffer': transformed,
						'in': configuration.inFormat,
						'out': configuration.outFormat
					});

				case 48:
					if (!demo) {
						context$2$0.next = 91;
						break;
					}

					demo.dependencies = { 'Pattern': file };
					demoBundler = undefined;
					context$2$0.prev = 51;
					context$2$0.next = 54;
					return regeneratorRuntime.awrap(resolveDependencies(demo, configuration, application.cache));

				case 54:
					demoBundler = context$2$0.sent;
					context$2$0.next = 60;
					break;

				case 57:
					context$2$0.prev = 57;
					context$2$0.t3 = context$2$0['catch'](51);
					throw context$2$0.t3;

				case 60:
					_iteratorNormalCompletion5 = true;
					_didIteratorError5 = false;
					_iteratorError5 = undefined;
					context$2$0.prev = 63;

					for (_iterator5 = Object.keys(transforms)[Symbol.iterator](); !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
						transformName = _step5.value;
						_transforms$transformName2 = _slicedToArray(transforms[transformName], 2);
						transformFn = _transforms$transformName2[0];
						transformConfig = _transforms$transformName2[1];

						if (typeof transformFn.configure === 'function') {
							demoBundler.transform(transformFn.configure(transformConfig));
						} else {
							(_demoBundler = demoBundler).transform.apply(_demoBundler, _toConsumableArray(transforms[transformName]));
						}
					}

					context$2$0.next = 71;
					break;

				case 67:
					context$2$0.prev = 67;
					context$2$0.t4 = context$2$0['catch'](63);
					_didIteratorError5 = true;
					_iteratorError5 = context$2$0.t4;

				case 71:
					context$2$0.prev = 71;
					context$2$0.prev = 72;

					if (!_iteratorNormalCompletion5 && _iterator5['return']) {
						_iterator5['return']();
					}

				case 74:
					context$2$0.prev = 74;

					if (!_didIteratorError5) {
						context$2$0.next = 77;
						break;
					}

					throw _iteratorError5;

				case 77:
					return context$2$0.finish(74);

				case 78:
					return context$2$0.finish(71);

				case 79:
					demoTransformed = undefined;
					context$2$0.prev = 80;
					context$2$0.next = 83;
					return regeneratorRuntime.awrap(runBundler(demoBundler, configuration, demo));

				case 83:
					demoTransformed = context$2$0.sent;
					context$2$0.next = 90;
					break;

				case 86:
					context$2$0.prev = 86;
					context$2$0.t5 = context$2$0['catch'](80);

					context$2$0.t5.file = context$2$0.t5.file || demo.path || context$2$0.t5.fileName;
					throw context$2$0.t5;

				case 90:

					Object.assign(file, {
						'demoSource': demo.source,
						'demoBuffer': demoTransformed ? demoTransformed.buffer : demo.buffer,
						'in': configuration.inFormat,
						'out': configuration.outFormat
					});

				case 91:
					return context$2$0.abrupt('return', file);

				case 92:
				case 'end':
					return context$2$0.stop();
			}
		}, null, this, [[4, 10], [16, 20, 24, 32], [25,, 27, 31], [35, 43], [51, 57], [63, 67, 71, 79], [72,, 74, 78], [80, 86]]);
	};
}

exports['default'] = browserifyTransformFactory;
module.exports = exports['default'];

// Nested dependencies