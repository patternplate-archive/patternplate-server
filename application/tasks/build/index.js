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

var _libraryUtilitiesGit = require('../../../library/utilities/git');

var _libraryUtilitiesGit2 = _interopRequireDefault(_libraryUtilitiesGit);

var pkg = require((0, _path.resolve)(process.cwd(), 'package.json'));

function build(application, config) {
	var patternHook, patternRoot, patterns, transforms, patternConfig, built, environment, mode, revision, branch, tag, version, information, buildRoot, buildDirectory, environments, builds, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _environment, pattern, writes, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _loop, _iterator2, _step2, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, archive, output;

	return regeneratorRuntime.async(function build$(context$1$0) {
		while (1) switch (context$1$0.prev = context$1$0.next) {
			case 0:
				patternHook = application.hooks.filter(function (hook) {
					return hook.name === 'patterns';
				})[0];
				patternRoot = (0, _path.resolve)(application.runtime.patterncwd || application.runtime.cwd, patternHook.configuration.path);
				patterns = application.configuration.patterns || {};
				transforms = application.configuration.transforms || {};
				patternConfig = { patterns: patterns, transforms: transforms };
				built = new Date();
				environment = application.runtime.env;
				mode = application.runtime.mode;
				context$1$0.next = 10;
				return regeneratorRuntime.awrap(_libraryUtilitiesGit2['default'].short());

			case 10:
				revision = context$1$0.sent;
				context$1$0.next = 13;
				return regeneratorRuntime.awrap(_libraryUtilitiesGit2['default'].branch());

			case 13:
				branch = context$1$0.sent;
				context$1$0.next = 16;
				return regeneratorRuntime.awrap(_libraryUtilitiesGit2['default'].tag());

			case 16:
				tag = context$1$0.sent;
				version = pkg.version;
				information = { built: built, environment: environment, mode: mode, revision: revision, branch: branch, tag: tag, version: version };
				buildRoot = (0, _path.resolve)(application.runtime.patterncwd || application.runtime.cwd, 'build');
				buildDirectory = (0, _path.resolve)(buildRoot, 'build-v' + version + '-' + environment + '-' + revision);
				context$1$0.next = 23;
				return regeneratorRuntime.awrap(_qIoFs2['default'].listTree((0, _path.resolve)(patternRoot, '@environments')));

			case 23:
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
				context$1$0.prev = 29;
				_iterator = environments[Symbol.iterator]();

			case 31:
				if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
					context$1$0.next = 44;
					break;
				}

				_environment = _step.value;
				context$1$0.next = 35;
				return regeneratorRuntime.awrap(application.pattern.factory(_qIoFs2['default'].relativeFromDirectory(patternRoot, _environment), patternRoot, patternConfig, application.transforms));

			case 35:
				pattern = context$1$0.sent;
				context$1$0.next = 38;
				return regeneratorRuntime.awrap(pattern.read());

			case 38:
				context$1$0.next = 40;
				return regeneratorRuntime.awrap(pattern.transform(false, true));

			case 40:

				builds.push(pattern);

			case 41:
				_iteratorNormalCompletion = true;
				context$1$0.next = 31;
				break;

			case 44:
				context$1$0.next = 50;
				break;

			case 46:
				context$1$0.prev = 46;
				context$1$0.t0 = context$1$0['catch'](29);
				_didIteratorError = true;
				_iteratorError = context$1$0.t0;

			case 50:
				context$1$0.prev = 50;
				context$1$0.prev = 51;

				if (!_iteratorNormalCompletion && _iterator['return']) {
					_iterator['return']();
				}

			case 53:
				context$1$0.prev = 53;

				if (!_didIteratorError) {
					context$1$0.next = 56;
					break;
				}

				throw _iteratorError;

			case 56:
				return context$1$0.finish(53);

			case 57:
				return context$1$0.finish(50);

			case 58:
				context$1$0.next = 60;
				return regeneratorRuntime.awrap(_qIoFs2['default'].makeTree(buildDirectory));

			case 60:
				writes = [];
				_iteratorNormalCompletion2 = true;
				_didIteratorError2 = false;
				_iteratorError2 = undefined;
				context$1$0.prev = 64;

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

				context$1$0.next = 73;
				break;

			case 69:
				context$1$0.prev = 69;
				context$1$0.t1 = context$1$0['catch'](64);
				_didIteratorError2 = true;
				_iteratorError2 = context$1$0.t1;

			case 73:
				context$1$0.prev = 73;
				context$1$0.prev = 74;

				if (!_iteratorNormalCompletion2 && _iterator2['return']) {
					_iterator2['return']();
				}

			case 76:
				context$1$0.prev = 76;

				if (!_didIteratorError2) {
					context$1$0.next = 79;
					break;
				}

				throw _iteratorError2;

			case 79:
				return context$1$0.finish(76);

			case 80:
				return context$1$0.finish(73);

			case 81:
				context$1$0.next = 83;
				return regeneratorRuntime.awrap(Promise.all(writes));

			case 83:
				archive = (0, _archiver2['default'])('zip');
				output = (0, _fs.createWriteStream)('' + buildDirectory + '.zip');

				archive.pipe(output);
				archive.directory(buildDirectory, false);
				archive.finalize();

				return context$1$0.abrupt('return', new Promise(function (fulfill, reject) {
					output.on('close', fulfill);
					archive.on('error', reject);
				}));

			case 89:
			case 'end':
				return context$1$0.stop();
		}
	}, null, this, [[29, 46, 50, 58], [51,, 53, 57], [64, 69, 73, 81], [74,, 76, 80]]);
}

exports['default'] = build;
module.exports = exports['default'];