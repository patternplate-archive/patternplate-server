'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _fs = require('fs');

var _qIoFs = require('q-io/fs');

var _qIoFs2 = _interopRequireDefault(_qIoFs);

var _archiver = require('archiver');

var _archiver2 = _interopRequireDefault(_archiver);

var _lodashMerge = require('lodash.merge');

var _lodashMerge2 = _interopRequireDefault(_lodashMerge);

var _libraryUtilitiesGit = require('../../../library/utilities/git');

var _libraryUtilitiesGit2 = _interopRequireDefault(_libraryUtilitiesGit);

var pkg = require((0, _path.resolve)(process.cwd(), 'package.json'));

function build(application, config) {
	var patternHook, patternRoot, buildConfig, patterns, transforms, patternConfig, built, environment, mode, revision, branch, tag, version, information, buildRoot, buildDirectory, environments, builds, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _environment, pattern, writes, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _loop, _iterator2, _step2, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, archive, output;

	return regeneratorRuntime.async(function build$(context$1$0) {
		while (1) switch (context$1$0.prev = context$1$0.next) {
			case 0:
				patternHook = application.hooks.filter(function (hook) {
					return hook.name === 'patterns';
				})[0];
				patternRoot = (0, _path.resolve)(application.runtime.patterncwd || application.runtime.cwd, patternHook.configuration.path);
				buildConfig = application.configuration.build || {};
				patterns = (0, _lodashMerge2['default'])({}, application.configuration.patterns || {}, buildConfig.patterns || {});
				transforms = (0, _lodashMerge2['default'])({}, application.configuration.transforms || {}, buildConfig.transforms || {});
				patternConfig = { patterns: patterns, transforms: transforms };
				built = new Date();
				environment = application.runtime.env;
				mode = application.runtime.mode;
				context$1$0.next = 11;
				return regeneratorRuntime.awrap(_libraryUtilitiesGit2['default'].short());

			case 11:
				revision = context$1$0.sent;
				context$1$0.next = 14;
				return regeneratorRuntime.awrap(_libraryUtilitiesGit2['default'].branch());

			case 14:
				branch = context$1$0.sent;
				context$1$0.next = 17;
				return regeneratorRuntime.awrap(_libraryUtilitiesGit2['default'].tag());

			case 17:
				tag = context$1$0.sent;
				version = pkg.version;
				information = { built: built, environment: environment, mode: mode, revision: revision, branch: branch, tag: tag, version: version };
				buildRoot = (0, _path.resolve)(application.runtime.patterncwd || application.runtime.cwd, 'build');
				buildDirectory = (0, _path.resolve)(buildRoot, 'build-v' + version + '-' + environment + '-' + revision);
				context$1$0.next = 24;
				return regeneratorRuntime.awrap(_qIoFs2['default'].listTree((0, _path.resolve)(patternRoot, '@environments')));

			case 24:
				environments = context$1$0.sent;

				environments = environments.filter(function (item) {
					return (0, _path.basename)(item) === 'pattern.json';
				}).map(function (item) {
					return (0, _path.dirname)(item);
				});

				builds = [];
				_iteratorNormalCompletion = true;
				_didIteratorError = false;
				_iteratorError = undefined;
				context$1$0.prev = 30;
				_iterator = environments[Symbol.iterator]();

			case 32:
				if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
					context$1$0.next = 45;
					break;
				}

				_environment = _step.value;
				context$1$0.next = 36;
				return regeneratorRuntime.awrap(application.pattern.factory(_qIoFs2['default'].relativeFromDirectory(patternRoot, _environment), patternRoot, patternConfig, application.transforms));

			case 36:
				pattern = context$1$0.sent;
				context$1$0.next = 39;
				return regeneratorRuntime.awrap(pattern.read());

			case 39:
				context$1$0.next = 41;
				return regeneratorRuntime.awrap(pattern.transform(false, true));

			case 41:

				builds.push(pattern);

			case 42:
				_iteratorNormalCompletion = true;
				context$1$0.next = 32;
				break;

			case 45:
				context$1$0.next = 51;
				break;

			case 47:
				context$1$0.prev = 47;
				context$1$0.t0 = context$1$0['catch'](30);
				_didIteratorError = true;
				_iteratorError = context$1$0.t0;

			case 51:
				context$1$0.prev = 51;
				context$1$0.prev = 52;

				if (!_iteratorNormalCompletion && _iterator['return']) {
					_iterator['return']();
				}

			case 54:
				context$1$0.prev = 54;

				if (!_didIteratorError) {
					context$1$0.next = 57;
					break;
				}

				throw _iteratorError;

			case 57:
				return context$1$0.finish(54);

			case 58:
				return context$1$0.finish(51);

			case 59:
				context$1$0.next = 61;
				return regeneratorRuntime.awrap(_qIoFs2['default'].makeTree(buildDirectory));

			case 61:
				writes = [];
				_iteratorNormalCompletion2 = true;
				_didIteratorError2 = false;
				_iteratorError2 = undefined;
				context$1$0.prev = 65;

				_loop = function () {
					var build = _step2.value;

					var target = build.manifest.name;

					var info = Object.assign({}, information, { version: version, target: target });
					var fragments = ['/**!'];

					var comment = Object.keys(info).reduce(function (results, fragmentName) {
						var name = '' + fragmentName[0].toUpperCase() + '' + fragmentName.slice(1);
						var value = info[fragmentName];
						results.push(' * ' + name + ': ' + value);
						return results;
					}, fragments).concat(['**/']).join('\n');

					var results = build.results[target];

					_iteratorNormalCompletion3 = true;
					_didIteratorError3 = false;
					_iteratorError3 = undefined;

					try {
						for (_iterator3 = Object.keys(results)[Symbol.iterator](); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
							var resultName = _step3.value;

							var result = results[resultName];
							var contents = '' + comment + '\n' + result.buffer.toString('utf-8');
							var ext = result.out;
							var fileName = (0, _path.resolve)(buildDirectory, [build.manifest.name, ext].join('.'));
							application.log.info('[console:run] Writing "' + resultName + '" for configuration "' + build.manifest.name + '" to ' + fileName + ' ...');
							writes.push(_qIoFs2['default'].write(fileName, contents));
						}
					} catch (err) {
						_didIteratorError3 = true;
						_iteratorError3 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion3 && _iterator3['return']) {
								_iterator3['return']();
							}
						} finally {
							if (_didIteratorError3) {
								throw _iteratorError3;
							}
						}
					}
				};

				for (_iterator2 = builds[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					_loop();
				}

				context$1$0.next = 74;
				break;

			case 70:
				context$1$0.prev = 70;
				context$1$0.t1 = context$1$0['catch'](65);
				_didIteratorError2 = true;
				_iteratorError2 = context$1$0.t1;

			case 74:
				context$1$0.prev = 74;
				context$1$0.prev = 75;

				if (!_iteratorNormalCompletion2 && _iterator2['return']) {
					_iterator2['return']();
				}

			case 77:
				context$1$0.prev = 77;

				if (!_didIteratorError2) {
					context$1$0.next = 80;
					break;
				}

				throw _iteratorError2;

			case 80:
				return context$1$0.finish(77);

			case 81:
				return context$1$0.finish(74);

			case 82:
				context$1$0.next = 84;
				return regeneratorRuntime.awrap(Promise.all(writes));

			case 84:
				archive = (0, _archiver2['default'])('zip');
				output = (0, _fs.createWriteStream)('' + buildDirectory + '.zip');

				archive.pipe(output);
				archive.directory(buildDirectory, false);
				archive.finalize();

				return context$1$0.abrupt('return', new Promise(function (fulfill, reject) {
					output.on('close', fulfill);
					archive.on('error', reject);
				}));

			case 90:
			case 'end':
				return context$1$0.stop();
		}
	}, null, this, [[30, 47, 51, 59], [52,, 54, 58], [65, 70, 74, 82], [75,, 77, 81]]);
}

exports['default'] = build;
module.exports = exports['default'];