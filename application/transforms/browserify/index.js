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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NvdXJjZS9hcHBsaWNhdGlvbi90cmFuc2Zvcm1zL2Jyb3dzZXJpZnkvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O3FCQUFrQixPQUFPOzs7O29CQUNILE1BQU07OzBCQUNMLFlBQVk7Ozs7MEJBQ2xCLGFBQWE7Ozs7QUFFOUIsU0FBUyxjQUFjLENBQUMsSUFBSSxFQUFFO0FBQzdCLEtBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksSUFBSSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBUyxPQUFPLEVBQUUsY0FBYyxFQUFDO0FBQ3pGLE1BQUksVUFBVSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDbkQsU0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN2QyxTQUFPLE9BQU8sQ0FBQztFQUNmLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOztBQUV6QixRQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQztTQUFLLENBQUMsR0FBRyxDQUFDO0VBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQ3ZDOztBQUVELFNBQWUsVUFBVSxDQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSTs7Ozt3Q0FDeEMsSUFBSSxPQUFPLENBQUMsU0FBUyxlQUFlLENBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRTtBQUNoRSxZQUFPLENBQUMsTUFBTSxDQUFDLFNBQVMsUUFBUSxDQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUU7QUFDOUMsVUFBSSxHQUFHLEVBQUU7QUFDUixjQUFPLENBQUMsS0FBSyxDQUFDLHVCQUF1QixHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNuRCxjQUFP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O0FBS1osdUJBQTBCLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLDJIQUFFO0FBQTFDLG1CQUFhO2tEQUNnQixVQUFVLENBQUMsYUFBYSxDQUFDO0FBQXpELGlCQUFXO0FBQUUscUJBQWU7O0FBRWpDLFVBQUksT0FBTyxXQUFXLENBQUMsU0FBUyxLQUFLLFVBQVUsRUFBRTtBQUNoRCxrQkFBVyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7T0FDOUQsTUFBTTtBQUNOLHVCQUFBLFdBQVcsRUFBQyxTQUFTLE1BQUEsa0NBQUksVUFBVSxDQUFDLGFBQWEsQ0FBQyxFQUFDLENBQUM7T0FDcEQ7TUFDRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUcsb0JBQWU7OztxQ0FHTSxVQUFVLENBQUMsV0FBVyxFQUFFLGFBQWEsRUFBRSxJQUFJLENBQUM7OztBQUFwRSxvQkFBZTs7Ozs7Ozs7QUFFZixvQkFBSSxJQUFJLEdBQUcsZUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxlQUFJLFFBQVEsQ0FBQzs7Ozs7QUFJbEQsV0FBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUU7QUFDbkIsa0JBQVksRUFBRSxJQUFJLENBQUMsTUFBTTtBQUN6QixrQkFBWSxFQUFFLGVBQWUsR0FBRyxlQUFlLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNO0FBQ3BFLFVBQUksRUFBRSxhQUFhLENBQUMsUUFBUTtBQUM1QixXQUFLLEVBQUUsYUFBYSxDQUFDLFNBQVM7TUFDOUIsQ0FBQyxDQUFDOzs7eUNBR0csSUFBSTs7Ozs7OztFQUNYLENBQUM7Q0FDRjs7cUJBRWMsMEJBQTBCIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFZpbnlsIGZyb20gJ3ZpbnlsJztcbmltcG9ydCB7ZGlybmFtZX0gZnJvbSAncGF0aCc7XG5pbXBvcnQgYnJvd3NlcmlmeSBmcm9tICdicm93c2VyaWZ5JztcbmltcG9ydCBvbWl0IGZyb20gJ2xvZGFzaC5vbWl0JztcblxuZnVuY3Rpb24gZ2V0TGF0ZXN0TVRpbWUoZmlsZSkge1xuXHRsZXQgbXRpbWVzID0gT2JqZWN0LmtleXMoZmlsZS5kZXBlbmRlbmNpZXMgfHwge30pLnJlZHVjZShmdW5jdGlvbihyZXN1bHRzLCBkZXBlbmRlbmN5TmFtZSl7XG5cdFx0bGV0IGRlcGVuZGVuY3kgPSBmaWxlLmRlcGVuZGVuY2llc1tkZXBlbmRlbmN5TmFtZV07XG5cdFx0cmVzdWx0cy5wdXNoKGRlcGVuZGVuY3kuZnMubm9kZS5tdGltZSk7XG5cdFx0cmV0dXJuIHJlc3VsdHM7XG5cdH0sIFtmaWxlLmZzLm5vZGUubXRpbWVdKTtcblxuXHRyZXR1cm4gbXRpbWVzLnNvcnQoKGEsIGIpID0+IGIgLSBhKVswXTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcnVuQnVuZGxlciAoYnVuZGxlciwgY29uZmlnLCBtZXRhKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiBidW5kbGVyUmVzb2x2ZXIgKHJlc29sdmVyLCByZWplY3Rlcikge1xuXHRcdGJ1bmRsZXIuYnVuZGxlKGZ1bmN0aW9uIG9uQnVuZGxlIChlcnIsIGJ1ZmZlcikge1xuXHRcdFx0aWYgKGVycikge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKCdFcnJvciB3aGlsZSBidW5kbGluZyAnICsgbWV0YS5wYXRoKTtcblx0XHRcdFx0Y29uc29sZS5lcnJvcihlcnIpO1xuXHRcdFx0XHRyZWplY3RlcihlcnIpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXNvbHZlcih7XG5cdFx0XHRcdCdidWZmZXInOiBidWZmZXIgfHwgbmV3IEJ1ZmZlcignJyksXG5cdFx0XHRcdCdpbic6IGNvbmZpZy5pbkZvcm1hdCxcblx0XHRcdFx0J291dCc6IGNvbmZpZy5vdXRGb3JtYXRcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gc3F1YXNoRGVwZW5kZW5jaWVzKGZpbGUsIHJlZ2lzdHJ5ID0ge30pIHtcblx0Zm9yIChsZXQgZGVwZW5kZW5jeU5hbWUgb2YgT2JqZWN0LmtleXMoZmlsZS5kZXBlbmRlbmNpZXMpKSB7XG5cdFx0bGV0IGRlcGVuZGVuY3kgPSBmaWxlLmRlcGVuZGVuY2llc1tkZXBlbmRlbmN5TmFtZV07XG5cblx0XHRpZiAoIShkZXBlbmRlbmN5TmFtZSBpbiByZWdpc3RyeSkgfHwgcmVnaXN0cnlbZGVwZW5kZW5jeU5hbWVdLnBhdGggPT09IGRlcGVuZGVuY3kucGF0aCkge1xuXHRcdFx0cmVnaXN0cnlbZGVwZW5kZW5jeU5hbWVdID0ge1xuXHRcdFx0XHQncGF0aCc6IGRlcGVuZGVuY3kucGF0aCxcblx0XHRcdFx0J3NvdXJjZSc6IGRlcGVuZGVuY3kuc291cmNlLFxuXHRcdFx0XHQnYnVmZmVyJzogZGVwZW5kZW5jeS5idWZmZXIsXG5cdFx0XHRcdCdkZXBlbmRlbmNpZXMnOiBkZXBlbmRlbmN5LmRlcGVuZGVuY2llc1xuXHRcdFx0fTtcblx0XHRcdC8vY29weS5kZXBlbmRlbmNpZXMgPSBvbWl0KGNvcHkuZGVwZW5kZW5jaWVzLCBkZXBlbmRlbmN5TmFtZSk7XG5cdFx0XHRmaWxlLmRlcGVuZGVuY2llcyA9IG9taXQoZmlsZS5kZXBlbmRlbmNpZXMsIGRlcGVuZGVuY3lOYW1lKTtcblx0XHRcdGRlcGVuZGVuY3kgPSByZWdpc3RyeVtkZXBlbmRlbmN5TmFtZV07XG5cdFx0fVxuXG5cdFx0c3F1YXNoRGVwZW5kZW5jaWVzKGRlcGVuZGVuY3ksIHJlZ2lzdHJ5KTtcblx0fVxuXG5cdHJldHVybiByZWdpc3RyeTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcmVzb2x2ZURlcGVuZGVuY2llcyAoZmlsZSwgY29uZmlndXJhdGlvbikge1xuXHRsZXQgZGVwZW5kZW5jaWVzID0gc3F1YXNoRGVwZW5kZW5jaWVzKGZpbGUpO1xuXG5cdGZvciAobGV0IGV4cG9zZSBvZiBPYmplY3Qua2V5cyhkZXBlbmRlbmNpZXMpKSB7XG5cdFx0bGV0IGRlcGVuZGVuY3kgPSBkZXBlbmRlbmNpZXNbZXhwb3NlXTtcblxuXHRcdC8vIE5lc3RlZCBkZXBlbmRlbmNpZXNcblx0XHRpZiAoZGVwZW5kZW5jeS5kZXBlbmRlbmNpZXMgJiYgT2JqZWN0LmtleXMoZGVwZW5kZW5jeS5kZXBlbmRlbmNpZXMpLmxlbmd0aCA+IDApIHtcblx0XHRcdGxldCBiYXNlZGlyID0gZGlybmFtZShkZXBlbmRlbmN5LnBhdGgpO1xuXHRcdFx0bGV0IG9wdHMgPSB7ZXhwb3NlLCBiYXNlZGlyfTtcblx0XHRcdGxldCBkZXBlbmRlbmN5QnVuZGxlciA9IHJlc29sdmVEZXBlbmRlbmNpZXMoZGVwZW5kZW5jeSwgT2JqZWN0LmFzc2lnbihcblx0XHRcdFx0e30sIGNvbmZpZ3VyYXRpb24ub3B0cywgb3B0cyxcblx0XHRcdFx0eyAnc3RhbmRhbG9uZSc6IGV4cG9zZSB9XG5cdFx0XHQpKTtcblx0XHRcdGxldCB0cmFuc2Zvcm1lZDtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdHRyYW5zZm9ybWVkID0gYXdhaXQgcnVuQnVuZGxlcihkZXBlbmRlbmN5QnVuZGxlciwgY29uZmlndXJhdGlvbiwgZGVwZW5kZW5jeSk7XG5cdFx0XHR9IGNhdGNoIChlcnIpIHtcblx0XHRcdFx0dGhyb3cgKGVycik7XG5cdFx0XHR9XG5cblx0XHRcdGRlcGVuZGVuY3kuYnVmZmVyID0gdHJhbnNmb3JtZWQuYnVmZmVyLnRvU3RyaW5nKCd1dGYtOCcpO1xuXHRcdH0gZWxzZSB7IC8vIFNxdWFzaGVkIGFuZCBmbGF0IGRlcGVuZGVuY2llcyAod2F5IGZhc3Rlcilcblx0XHRcdGRlcGVuZGVuY3kuYnVmZmVyID0gZGVwZW5kZW5jeS5zb3VyY2U7XG5cdFx0fVxuXHR9XG5cblx0bGV0IGNvbnRlbnRzID0gbmV3IEJ1ZmZlcihmaWxlLmJ1ZmZlcik7XG5cdGxldCBidW5kbGVyID0gYnJvd3NlcmlmeShuZXcgVmlueWwoe2NvbnRlbnRzfSksIGNvbmZpZ3VyYXRpb24ub3B0cyk7XG5cblx0Zm9yIChsZXQgZXhwb3NlIG9mIE9iamVjdC5rZXlzKGRlcGVuZGVuY2llcykpIHtcblx0XHRsZXQgZGVwZW5kZW5jeSA9IGRlcGVuZGVuY2llc1tleHBvc2VdO1xuXHRcdGxldCBiYXNlZGlyID0gZGlybmFtZShkZXBlbmRlbmN5LnBhdGgpO1xuXHRcdGxldCBvcHRzID0ge2V4cG9zZSwgYmFzZWRpcn07XG5cblx0XHRidW5kbGVyLmV4Y2x1ZGUoZXhwb3NlKTtcblx0XHRidW5kbGVyLnJlcXVpcmUobmV3IFZpbnlsKHsnY29udGVudHMnOiBuZXcgQnVmZmVyKGRlcGVuZGVuY3kuYnVmZmVyKX0pLCBPYmplY3QuYXNzaWduKHt9LCBjb25maWd1cmF0aW9uLm9wdHMsIG9wdHMpKTtcblx0fVxuXG5cdHJldHVybiBidW5kbGVyO1xufVxuXG5mdW5jdGlvbiBicm93c2VyaWZ5VHJhbnNmb3JtRmFjdG9yeSAoYXBwbGljYXRpb24pIHtcblx0cmV0dXJuIGFzeW5jIGZ1bmN0aW9uIGJyb3dzZXJpZnlUcmFuc2Zvcm0gKGZpbGUsIGRlbW8sIGNvbmZpZ3VyYXRpb24pIHtcblx0XHRjb25zdCB0cmFuc2Zvcm1OYW1lcyA9IE9iamVjdC5rZXlzKGNvbmZpZ3VyYXRpb24udHJhbnNmb3Jtcylcblx0XHRcdC5tYXAoKHRyYW5zZm9ybU5hbWUpID0+IGNvbmZpZ3VyYXRpb24udHJhbnNmb3Jtc1t0cmFuc2Zvcm1OYW1lXS5lbmFibGVkID8gdHJhbnNmb3JtTmFtZSA6IGZhbHNlKVxuXHRcdFx0LmZpbHRlcigoaXRlbSkgPT4gaXRlbSk7XG5cblx0XHRjb25zdCB0cmFuc2Zvcm1zID0gdHJhbnNmb3JtTmFtZXMucmVkdWNlKGZ1bmN0aW9uIGdldFRyYW5zZm9ybUNvbmZpZyAocmVzdWx0cywgdHJhbnNmb3JtTmFtZSkge1xuXHRcdFx0bGV0IHRyYW5zZm9ybUZuO1xuXHRcdFx0bGV0IHRyYW5zZm9ybUNvbmZpZyA9IGNvbmZpZ3VyYXRpb24udHJhbnNmb3Jtc1t0cmFuc2Zvcm1OYW1lXS5vcHRzIHx8IHt9O1xuXG5cdFx0XHR0cnkge1xuXHRcdFx0XHR0cmFuc2Zvcm1GbiA9IHJlcXVpcmUodHJhbnNmb3JtTmFtZSk7XG5cdFx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRhcHBsaWNhdGlvbi5sb2cud2FybihgVW5hYmxlIHRvIGxvYWQgYnJvd3NlcmlmeSB0cmFuc2Zvcm0gJHt0cmFuc2Zvcm1OYW1lfS5gKTtcblx0XHRcdFx0YXBwbGljYXRpb24ubG9nLmVycm9yKGVycm9yLnN0YWNrKTtcblx0XHRcdH1cblxuXHRcdFx0cmVzdWx0c1t0cmFuc2Zvcm1OYW1lXSA9IFt0cmFuc2Zvcm1GbiwgdHJhbnNmb3JtQ29uZmlnXTtcblx0XHRcdHJldHVybiByZXN1bHRzO1xuXHRcdH0sIHt9KTtcblxuXHRcdGlmICghZGVtbykge1xuXHRcdFx0bGV0IGJ1bmRsZXI7XG5cblx0XHRcdHRyeSB7XG5cdFx0XHRcdGJ1bmRsZXIgPSBhd2FpdCByZXNvbHZlRGVwZW5kZW5jaWVzKGZpbGUsIGNvbmZpZ3VyYXRpb24sIGFwcGxpY2F0aW9uLmNhY2hlKTtcblx0XHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0XHR0aHJvdyBlcnI7XG5cdFx0XHR9XG5cblx0XHRcdGZvciAobGV0IHRyYW5zZm9ybU5hbWUgb2YgT2JqZWN0LmtleXModHJhbnNmb3JtcykpIHtcblx0XHRcdFx0bGV0IFt0cmFuc2Zvcm1GbiwgdHJhbnNmb3JtQ29uZmlnXSA9IHRyYW5zZm9ybXNbdHJhbnNmb3JtTmFtZV07XG5cblx0XHRcdFx0aWYgKHR5cGVvZiB0cmFuc2Zvcm1Gbi5jb25maWd1cmUgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHRidW5kbGVyLnRyYW5zZm9ybSh0cmFuc2Zvcm1Gbi5jb25maWd1cmUodHJhbnNmb3JtQ29uZmlnKSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0YnVuZGxlci50cmFuc2Zvcm0oLi4udHJhbnNmb3Jtc1t0cmFuc2Zvcm1OYW1lXSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0bGV0IG10aW1lID0gZ2V0TGF0ZXN0TVRpbWUoZmlsZSk7XG5cdFx0XHRsZXQgdHJhbnNmb3JtZWQgPSBhcHBsaWNhdGlvbi5jYWNoZSAmJiBhcHBsaWNhdGlvbi5jYWNoZS5nZXQoYGJyb3dzZXJpZnk6JHtmaWxlLnBhdGh9YCwgbXRpbWUpO1xuXG5cdFx0XHRpZiAoIXRyYW5zZm9ybWVkKSB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0bGV0IGJ1bmRsZWQgPSBhd2FpdCBydW5CdW5kbGVyKGJ1bmRsZXIsIGNvbmZpZ3VyYXRpb24sIGZpbGUpO1xuXHRcdFx0XHRcdHRyYW5zZm9ybWVkID0gYnVuZGxlZCA/IGJ1bmRsZWQuYnVmZmVyIDogZmlsZS5idWZmZXI7XG5cdFx0XHRcdFx0aWYgKGFwcGxpY2F0aW9uLmNhY2hlKSB7XG5cdFx0XHRcdFx0XHRhcHBsaWNhdGlvbi5jYWNoZS5zZXQoYGJyb3dzZXJpZnk6JHtmaWxlLnBhdGh9YCwgbXRpbWUsIHRyYW5zZm9ybWVkLmJ1ZmZlcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGNhdGNoIChlcnIpIHtcblx0XHRcdFx0XHRlcnIuZmlsZSA9IGZpbGUucGF0aCB8fCBlcnIuZmlsZU5hbWU7XG5cdFx0XHRcdFx0dGhyb3cgZXJyO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdE9iamVjdC5hc3NpZ24oZmlsZSwge1xuXHRcdFx0XHQnYnVmZmVyJzogdHJhbnNmb3JtZWQsXG5cdFx0XHRcdCdpbic6IGNvbmZpZ3VyYXRpb24uaW5Gb3JtYXQsXG5cdFx0XHRcdCdvdXQnOiBjb25maWd1cmF0aW9uLm91dEZvcm1hdFxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0aWYgKGRlbW8pIHtcblx0XHRcdGRlbW8uZGVwZW5kZW5jaWVzID0geyAnUGF0dGVybic6IGZpbGUgfTtcblx0XHRcdGxldCBkZW1vQnVuZGxlcjtcblxuXHRcdFx0dHJ5IHtcblx0XHRcdFx0ZGVtb0J1bmRsZXIgPSBhd2FpdCByZXNvbHZlRGVwZW5kZW5jaWVzKGRlbW8sIGNvbmZpZ3VyYXRpb24sIGFwcGxpY2F0aW9uLmNhY2hlKTtcblx0XHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0XHR0aHJvdyBlcnI7XG5cdFx0XHR9XG5cblx0XHRcdGZvciAobGV0IHRyYW5zZm9ybU5hbWUgb2YgT2JqZWN0LmtleXModHJhbnNmb3JtcykpIHtcblx0XHRcdFx0bGV0IFt0cmFuc2Zvcm1GbiwgdHJhbnNmb3JtQ29uZmlnXSA9IHRyYW5zZm9ybXNbdHJhbnNmb3JtTmFtZV07XG5cblx0XHRcdFx0aWYgKHR5cGVvZiB0cmFuc2Zvcm1Gbi5jb25maWd1cmUgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHRkZW1vQnVuZGxlci50cmFuc2Zvcm0odHJhbnNmb3JtRm4uY29uZmlndXJlKHRyYW5zZm9ybUNvbmZpZykpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGRlbW9CdW5kbGVyLnRyYW5zZm9ybSguLi50cmFuc2Zvcm1zW3RyYW5zZm9ybU5hbWVdKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRsZXQgZGVtb1RyYW5zZm9ybWVkO1xuXG5cdFx0XHR0cnkge1xuXHRcdFx0XHRkZW1vVHJhbnNmb3JtZWQgPSBhd2FpdCBydW5CdW5kbGVyKGRlbW9CdW5kbGVyLCBjb25maWd1cmF0aW9uLCBkZW1vKTtcblx0XHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0XHRlcnIuZmlsZSA9IGVyci5maWxlIHx8IGRlbW8ucGF0aCB8fCBlcnIuZmlsZU5hbWU7XG5cdFx0XHRcdHRocm93IGVycjtcblx0XHRcdH1cblxuXHRcdFx0T2JqZWN0LmFzc2lnbihmaWxlLCB7XG5cdFx0XHRcdCdkZW1vU291cmNlJzogZGVtby5zb3VyY2UsXG5cdFx0XHRcdCdkZW1vQnVmZmVyJzogZGVtb1RyYW5zZm9ybWVkID8gZGVtb1RyYW5zZm9ybWVkLmJ1ZmZlciA6IGRlbW8uYnVmZmVyLFxuXHRcdFx0XHQnaW4nOiBjb25maWd1cmF0aW9uLmluRm9ybWF0LFxuXHRcdFx0XHQnb3V0JzogY29uZmlndXJhdGlvbi5vdXRGb3JtYXRcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHJldHVybiBmaWxlO1xuXHR9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBicm93c2VyaWZ5VHJhbnNmb3JtRmFjdG9yeTtcbiJdfQ==