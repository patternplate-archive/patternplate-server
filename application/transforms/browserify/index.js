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
				return context$1$0.abrupt('return', new Promise(function bundlerResolver(resolver) {
					bundler.bundle(function onBundle(err, buffer) {
						if (err) {
							console.error('Error while bundling ' + meta.path);
							console.error(err);
							throw err;
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
	var registry = arguments[1] === undefined ? {} : arguments[1];
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
					context$1$0.next = 23;
					break;
				}

				expose = _step2.value;
				dependency = dependencies[expose];

				if (!(dependency.dependencies && Object.keys(dependency.dependencies).length > 0)) {
					context$1$0.next = 19;
					break;
				}

				basedir = (0, _path.dirname)(dependency.path);
				opts = { expose: expose, basedir: basedir };
				dependencyBundler = resolveDependencies(dependency, Object.assign({}, configuration.opts, opts, { 'standalone': expose }));
				context$1$0.next = 15;
				return regeneratorRuntime.awrap(runBundler(dependencyBundler, configuration, dependency));

			case 15:
				transformed = context$1$0.sent;

				dependency.buffer = transformed.buffer.toString('utf-8');
				context$1$0.next = 20;
				break;

			case 19:
				// Squashed and flat dependencies (way faster)
				dependency.buffer = dependency.source;

			case 20:
				_iteratorNormalCompletion2 = true;
				context$1$0.next = 6;
				break;

			case 23:
				context$1$0.next = 29;
				break;

			case 25:
				context$1$0.prev = 25;
				context$1$0.t0 = context$1$0['catch'](4);
				_didIteratorError2 = true;
				_iteratorError2 = context$1$0.t0;

			case 29:
				context$1$0.prev = 29;
				context$1$0.prev = 30;

				if (!_iteratorNormalCompletion2 && _iterator2['return']) {
					_iterator2['return']();
				}

			case 32:
				context$1$0.prev = 32;

				if (!_didIteratorError2) {
					context$1$0.next = 35;
					break;
				}

				throw _iteratorError2;

			case 35:
				return context$1$0.finish(32);

			case 36:
				return context$1$0.finish(29);

			case 37:
				contents = new Buffer(file.buffer);
				bundler = (0, _browserify2['default'])(new _vinyl2['default']({ contents: contents }), configuration.opts);
				_iteratorNormalCompletion3 = true;
				_didIteratorError3 = false;
				_iteratorError3 = undefined;
				context$1$0.prev = 42;

				for (_iterator3 = Object.keys(dependencies)[Symbol.iterator](); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					expose = _step3.value;
					dependency = dependencies[expose];
					basedir = (0, _path.dirname)(dependency.path);
					opts = { expose: expose, basedir: basedir };

					bundler.exclude(expose);
					bundler.require(new _vinyl2['default']({ 'contents': new Buffer(dependency.buffer) }), Object.assign({}, configuration.opts, opts));
				}

				context$1$0.next = 50;
				break;

			case 46:
				context$1$0.prev = 46;
				context$1$0.t1 = context$1$0['catch'](42);
				_didIteratorError3 = true;
				_iteratorError3 = context$1$0.t1;

			case 50:
				context$1$0.prev = 50;
				context$1$0.prev = 51;

				if (!_iteratorNormalCompletion3 && _iterator3['return']) {
					_iterator3['return']();
				}

			case 53:
				context$1$0.prev = 53;

				if (!_didIteratorError3) {
					context$1$0.next = 56;
					break;
				}

				throw _iteratorError3;

			case 56:
				return context$1$0.finish(53);

			case 57:
				return context$1$0.finish(50);

			case 58:
				return context$1$0.abrupt('return', bundler);

			case 59:
			case 'end':
				return context$1$0.stop();
		}
	}, null, this, [[4, 25, 29, 37], [30,, 32, 36], [42, 46, 50, 58], [51,, 53, 57]]);
}

function browserifyTransformFactory(application) {
	return function browserifyTransform(file, demo, configuration) {
		var transformNames, transforms, bundler, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, transformName, mtime, transformed, bundled, demoBundler, demoTransformed;

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

					console.log(context$2$0.t0);

				case 13:
					_iteratorNormalCompletion4 = true;
					_didIteratorError4 = false;
					_iteratorError4 = undefined;
					context$2$0.prev = 16;

					for (_iterator4 = Object.keys(transforms)[Symbol.iterator](); !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
						transformName = _step4.value;

						bundler.transform.apply(bundler, _toConsumableArray(transforms[transformName]));
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

					transformed = bundled.buffer;
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
						context$2$0.next = 72;
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

					console.log(context$2$0.t3);

				case 60:
					demoTransformed = undefined;
					context$2$0.prev = 61;
					context$2$0.next = 64;
					return regeneratorRuntime.awrap(runBundler(demoBundler, configuration, demo));

				case 64:
					demoTransformed = context$2$0.sent;
					context$2$0.next = 71;
					break;

				case 67:
					context$2$0.prev = 67;
					context$2$0.t4 = context$2$0['catch'](61);

					context$2$0.t4.file = demo.path || context$2$0.t4.fileName;
					throw context$2$0.t4;

				case 71:

					Object.assign(file, {
						'demoSource': demo.source,
						'demoBuffer': demoTransformed.buffer,
						'in': configuration.inFormat,
						'out': configuration.outFormat
					});

				case 72:
					return context$2$0.abrupt('return', file);

				case 73:
				case 'end':
					return context$2$0.stop();
			}
		}, null, this, [[4, 10], [16, 20, 24, 32], [25,, 27, 31], [35, 43], [51, 57], [61, 67]]);
	};
}

exports['default'] = browserifyTransformFactory;
module.exports = exports['default'];

// Nested dependencies