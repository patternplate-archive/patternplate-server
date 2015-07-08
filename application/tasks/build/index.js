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

var _libraryUtilitiesGetPatterns = require('../../../library/utilities/get-patterns');

var _libraryUtilitiesGetPatterns2 = _interopRequireDefault(_libraryUtilitiesGetPatterns);

var _libraryUtilitiesGetWrapper = require('../../../library/utilities/get-wrapper');

var _libraryUtilitiesGetWrapper2 = _interopRequireDefault(_libraryUtilitiesGetWrapper);

var _libraryUtilitiesGit = require('../../../library/utilities/git');

var _libraryUtilitiesGit2 = _interopRequireDefault(_libraryUtilitiesGit);

var _layouts = require('../../layouts');

var _layouts2 = _interopRequireDefault(_layouts);

var pkg = require((0, _path.resolve)(process.cwd(), 'package.json'));

function build(application, config) {
	var patternHook, patternRoot, staticRoot, assetRoot, buildConfig, patterns, transforms, patternConfig, built, environment, mode, revision, branch, tag, version, information, buildRoot, buildDirectory, patternBuildDirectory, staticCacheDirectory, patternList, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, patternItem, patternResultDirectory, patternSnippetsDirectory, metaData, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, resultEnvironmentName, resultEnvironment, environmentConfig, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, resultName, result, variants, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, variant, fragments, resultFileBaseName, resultFile, mainBuffer, mainName, mainFileBaseName, mainFile, templateData, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, environmentName, _environment, envConfig, wrapper, blueprint, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, resultType, templateKey, content, uri, templateSectionData, rendered, staticPatternCacheDirectory, environments, builds, _iteratorNormalCompletion7, _didIteratorError7, _iteratorError7, _iterator7, _step7, _environment2, pattern, writes, _iteratorNormalCompletion8, _didIteratorError8, _iteratorError8, _loop, _iterator8, _step8, _iteratorNormalCompletion9, _didIteratorError9, _iteratorError9, _iterator9, _step9, archive, output;

	return regeneratorRuntime.async(function build$(context$1$0) {
		while (1) switch (context$1$0.prev = context$1$0.next) {
			case 0:
				patternHook = application.hooks.filter(function (hook) {
					return hook.name === 'patterns';
				})[0];
				patternRoot = (0, _path.resolve)(application.runtime.patterncwd || application.runtime.cwd, patternHook.configuration.path);
				staticRoot = (0, _path.resolve)(application.runtime.patterncwd || application.runtime.cwd, 'static');
				assetRoot = (0, _path.resolve)(application.runtime.cwd, 'assets');
				buildConfig = application.configuration.build || {};
				patterns = (0, _lodashMerge2['default'])({}, application.configuration.patterns || {}, buildConfig.patterns || {});
				transforms = (0, _lodashMerge2['default'])({}, application.configuration.transforms || {}, buildConfig.transforms || {});
				patternConfig = { patterns: patterns, transforms: transforms };
				built = new Date();
				environment = application.runtime.env;
				mode = application.runtime.mode;
				context$1$0.next = 13;
				return regeneratorRuntime.awrap(_libraryUtilitiesGit2['default'].short());

			case 13:
				revision = context$1$0.sent;
				context$1$0.next = 16;
				return regeneratorRuntime.awrap(_libraryUtilitiesGit2['default'].branch());

			case 16:
				branch = context$1$0.sent;
				context$1$0.next = 19;
				return regeneratorRuntime.awrap(_libraryUtilitiesGit2['default'].tag());

			case 19:
				tag = context$1$0.sent;
				version = pkg.version;
				information = { built: built, environment: environment, mode: mode, revision: revision, branch: branch, tag: tag, version: version };
				buildRoot = (0, _path.resolve)(application.runtime.patterncwd || application.runtime.cwd, 'build');
				buildDirectory = (0, _path.resolve)(buildRoot, 'build-v' + version + '-' + environment + '-' + revision);
				patternBuildDirectory = (0, _path.resolve)(buildDirectory, 'patterns');
				staticCacheDirectory = (0, _path.resolve)(application.runtime.patterncwd || application.runtime.cwd, '.cache');

				if (!buildConfig.tasks.patterns) {
					context$1$0.next = 231;
					break;
				}

				context$1$0.next = 29;
				return regeneratorRuntime.awrap(_qIoFs2['default'].exists(assetRoot));

			case 29:
				if (!context$1$0.sent) {
					context$1$0.next = 37;
					break;
				}

				application.log.info('[console:run] Copy static files from "' + staticRoot + '" to ' + buildDirectory + ' ...');
				context$1$0.next = 33;
				return regeneratorRuntime.awrap(_qIoFs2['default'].makeTree((0, _path.resolve)(patternBuildDirectory, '_assets')));

			case 33:
				context$1$0.next = 35;
				return regeneratorRuntime.awrap(_qIoFs2['default'].copyTree(assetRoot, (0, _path.resolve)(patternBuildDirectory, '_assets')));

			case 35:
				context$1$0.next = 38;
				break;

			case 37:
				application.log.info('[console:run] No static files at "' + staticRoot + '"');

			case 38:

				if (application.cache) {
					application.cache.config['static'] = false;
				}

				context$1$0.next = 41;
				return regeneratorRuntime.awrap((0, _libraryUtilitiesGetPatterns2['default'])({
					'id': '.',
					'base': patternRoot,
					'config': patternConfig,
					'factory': application.pattern.factory,
					'transforms': application.transforms,
					'filters': {},
					'log': function log() {
						var _application$log;

						for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
							args[_key] = arguments[_key];
						}

						(_application$log = application.log).debug.apply(_application$log, ['[console:run]'].concat(args));
					}
				}, application.cache, false, false));

			case 41:
				patternList = context$1$0.sent;

				if (application.cache) {
					application.cache.config['static'] = true;
				}

				_iteratorNormalCompletion = true;
				_didIteratorError = false;
				_iteratorError = undefined;
				context$1$0.prev = 46;
				_iterator = patternList[Symbol.iterator]();

			case 48:
				if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
					context$1$0.next = 217;
					break;
				}

				patternItem = _step.value;
				patternResultDirectory = (0, _path.resolve)(patternBuildDirectory, patternItem.id);
				patternSnippetsDirectory = (0, _path.resolve)(patternResultDirectory, 'snippets');
				context$1$0.next = 54;
				return regeneratorRuntime.awrap(_qIoFs2['default'].makeTree(patternResultDirectory));

			case 54:
				context$1$0.next = 56;
				return regeneratorRuntime.awrap(_qIoFs2['default'].makeTree(patternSnippetsDirectory));

			case 56:
				metaData = Object.assign({}, patternItem.manifest, {
					'build': {
						'date': built,
						environment: environment, mode: mode, revision: revision,
						tag: tag, version: version
					},
					'results': {}
				});
				_iteratorNormalCompletion2 = true;
				_didIteratorError2 = false;
				_iteratorError2 = undefined;
				context$1$0.prev = 60;
				_iterator2 = Object.keys(patternItem.results)[Symbol.iterator]();

			case 62:
				if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
					context$1$0.next = 138;
					break;
				}

				resultEnvironmentName = _step2.value;
				resultEnvironment = patternItem.results[resultEnvironmentName];
				environmentConfig = patternItem.environments[resultEnvironmentName].manifest;

				metaData.results[resultEnvironmentName] = {};

				_iteratorNormalCompletion4 = true;
				_didIteratorError4 = false;
				_iteratorError4 = undefined;
				context$1$0.prev = 70;
				_iterator4 = Object.keys(resultEnvironment)[Symbol.iterator]();

			case 72:
				if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
					context$1$0.next = 121;
					break;
				}

				resultName = _step4.value;
				result = resultEnvironment[resultName];

				metaData.results[resultEnvironmentName][resultName] = {};

				variants = [{ 'name': 'demo', 'buffer': result.demoBuffer }, { 'name': '', 'buffer': result.buffer }];

				variants = variants.filter(function (item) {
					return item.buffer.length > 0;
				});

				_iteratorNormalCompletion5 = true;
				_didIteratorError5 = false;
				_iteratorError5 = undefined;
				context$1$0.prev = 81;
				_iterator5 = variants[Symbol.iterator]();

			case 83:
				if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
					context$1$0.next = 95;
					break;
				}

				variant = _step5.value;
				fragments = [resultName.toLowerCase(), !environmentConfig.formats || environmentConfig.formats.includes(result['in']) ? resultEnvironmentName : '', variants.length > 1 ? variant.name : ''];

				fragments = fragments.filter(function (item) {
					return item;
				});

				resultFileBaseName = fragments.join('-') + '.' + result.out;
				resultFile = (0, _path.resolve)(patternSnippetsDirectory, resultFileBaseName);
				context$1$0.next = 91;
				return regeneratorRuntime.awrap(_qIoFs2['default'].write(resultFile, variant.buffer));

			case 91:
				metaData.results[resultEnvironmentName][resultName][variant.name || 'library'] = _qIoFs2['default'].relativeFromDirectory(patternResultDirectory, resultFile);

			case 92:
				_iteratorNormalCompletion5 = true;
				context$1$0.next = 83;
				break;

			case 95:
				context$1$0.next = 101;
				break;

			case 97:
				context$1$0.prev = 97;
				context$1$0.t0 = context$1$0['catch'](81);
				_didIteratorError5 = true;
				_iteratorError5 = context$1$0.t0;

			case 101:
				context$1$0.prev = 101;
				context$1$0.prev = 102;

				if (!_iteratorNormalCompletion5 && _iterator5['return']) {
					_iterator5['return']();
				}

			case 104:
				context$1$0.prev = 104;

				if (!_didIteratorError5) {
					context$1$0.next = 107;
					break;
				}

				throw _iteratorError5;

			case 107:
				return context$1$0.finish(104);

			case 108:
				return context$1$0.finish(101);

			case 109:
				mainBuffer = result.demoBuffer || result.buffer;
				mainName = resultName.toLowerCase();

				if (!(mainName === 'markup')) {
					context$1$0.next = 113;
					break;
				}

				return context$1$0.abrupt('continue', 118);

			case 113:

				// TODO: resolve this
				mainName = mainName === 'documentation' ? mainName : resultEnvironmentName;

				mainFileBaseName = mainName + '.' + result.out;
				mainFile = (0, _path.resolve)(patternResultDirectory, mainFileBaseName);
				context$1$0.next = 118;
				return regeneratorRuntime.awrap(_qIoFs2['default'].write(mainFile, mainBuffer));

			case 118:
				_iteratorNormalCompletion4 = true;
				context$1$0.next = 72;
				break;

			case 121:
				context$1$0.next = 127;
				break;

			case 123:
				context$1$0.prev = 123;
				context$1$0.t1 = context$1$0['catch'](70);
				_didIteratorError4 = true;
				_iteratorError4 = context$1$0.t1;

			case 127:
				context$1$0.prev = 127;
				context$1$0.prev = 128;

				if (!_iteratorNormalCompletion4 && _iterator4['return']) {
					_iterator4['return']();
				}

			case 130:
				context$1$0.prev = 130;

				if (!_didIteratorError4) {
					context$1$0.next = 133;
					break;
				}

				throw _iteratorError4;

			case 133:
				return context$1$0.finish(130);

			case 134:
				return context$1$0.finish(127);

			case 135:
				_iteratorNormalCompletion2 = true;
				context$1$0.next = 62;
				break;

			case 138:
				context$1$0.next = 144;
				break;

			case 140:
				context$1$0.prev = 140;
				context$1$0.t2 = context$1$0['catch'](60);
				_didIteratorError2 = true;
				_iteratorError2 = context$1$0.t2;

			case 144:
				context$1$0.prev = 144;
				context$1$0.prev = 145;

				if (!_iteratorNormalCompletion2 && _iterator2['return']) {
					_iterator2['return']();
				}

			case 147:
				context$1$0.prev = 147;

				if (!_didIteratorError2) {
					context$1$0.next = 150;
					break;
				}

				throw _iteratorError2;

			case 150:
				return context$1$0.finish(147);

			case 151:
				return context$1$0.finish(144);

			case 152:
				templateData = {
					'title': patternItem.id,
					'style': [],
					'script': [],
					'markup': [],
					'route': function route(name, params) {
						// TODO: Generalize this
						var id = params.id || params.path;
						id = id === 'content.js' ? 'content.bundle.js' : id;
						name = name === 'script' ? '_assets/script' : name;

						var fragments = [name, id];
						fragments = fragments.filter(function (item) {
							return item;
						});

						return '/' + fragments.join('/');
					}
				};
				_iteratorNormalCompletion3 = true;
				_didIteratorError3 = false;
				_iteratorError3 = undefined;
				context$1$0.prev = 156;
				_iterator3 = Object.keys(patternItem.results)[Symbol.iterator]();

			case 158:
				if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
					context$1$0.next = 186;
					break;
				}

				environmentName = _step3.value;
				_environment = patternItem.results[environmentName];
				envConfig = patternItem.environments[environmentName].manifest || {};
				wrapper = (0, _libraryUtilitiesGetWrapper2['default'])(envConfig['conditional-comment']);
				blueprint = { 'environment': environmentName, 'content': '', wrapper: wrapper };
				_iteratorNormalCompletion6 = true;
				_didIteratorError6 = false;
				_iteratorError6 = undefined;
				context$1$0.prev = 167;

				for (_iterator6 = Object.keys(_environment)[Symbol.iterator](); !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
					resultType = _step6.value;
					result = _environment[resultType];
					templateKey = resultType.toLowerCase();
					content = result.demoBuffer || result.buffer;
					uri = patternItem.id + '/' + environmentName + '.' + result.out;
					templateSectionData = Object.assign({}, blueprint, { content: content, uri: uri });

					templateData[templateKey] = Array.isArray(templateData[templateKey]) ? templateData[templateKey].concat([templateSectionData]) : [templateSectionData];
				}
				context$1$0.next = 175;
				break;

			case 171:
				context$1$0.prev = 171;
				context$1$0.t3 = context$1$0['catch'](167);
				_didIteratorError6 = true;
				_iteratorError6 = context$1$0.t3;

			case 175:
				context$1$0.prev = 175;
				context$1$0.prev = 176;

				if (!_iteratorNormalCompletion6 && _iterator6['return']) {
					_iterator6['return']();
				}

			case 178:
				context$1$0.prev = 178;

				if (!_didIteratorError6) {
					context$1$0.next = 181;
					break;
				}

				throw _iteratorError6;

			case 181:
				return context$1$0.finish(178);

			case 182:
				return context$1$0.finish(175);

			case 183:
				_iteratorNormalCompletion3 = true;
				context$1$0.next = 158;
				break;

			case 186:
				context$1$0.next = 192;
				break;

			case 188:
				context$1$0.prev = 188;
				context$1$0.t4 = context$1$0['catch'](156);
				_didIteratorError3 = true;
				_iteratorError3 = context$1$0.t4;

			case 192:
				context$1$0.prev = 192;
				context$1$0.prev = 193;

				if (!_iteratorNormalCompletion3 && _iterator3['return']) {
					_iterator3['return']();
				}

			case 195:
				context$1$0.prev = 195;

				if (!_didIteratorError3) {
					context$1$0.next = 198;
					break;
				}

				throw _iteratorError3;

			case 198:
				return context$1$0.finish(195);

			case 199:
				return context$1$0.finish(192);

			case 200:
				rendered = (0, _layouts2['default'])(templateData);
				context$1$0.next = 203;
				return regeneratorRuntime.awrap(_qIoFs2['default'].write((0, _path.resolve)(patternResultDirectory, 'index.html'), rendered));

			case 203:
				context$1$0.next = 205;
				return regeneratorRuntime.awrap(_qIoFs2['default'].write((0, _path.resolve)(patternResultDirectory, 'build.json'), JSON.stringify(patternItem, null, '  ')));

			case 205:
				if (!buildConfig.tasks.cache) {
					context$1$0.next = 212;
					break;
				}

				staticPatternCacheDirectory = (0, _path.resolve)(staticCacheDirectory, patternItem.id);

				application.log.info('[console:run] Writing cache for "' + patternItem.id + '" to ' + staticPatternCacheDirectory + ' ...');
				context$1$0.next = 210;
				return regeneratorRuntime.awrap(_qIoFs2['default'].makeTree(staticPatternCacheDirectory));

			case 210:
				context$1$0.next = 212;
				return regeneratorRuntime.awrap(_qIoFs2['default'].write((0, _path.resolve)(staticPatternCacheDirectory, 'build.json'), JSON.stringify(patternItem, null, '  ')));

			case 212:
				context$1$0.next = 214;
				return regeneratorRuntime.awrap(_qIoFs2['default'].write((0, _path.resolve)(patternResultDirectory, 'pattern.json'), JSON.stringify(metaData, null, '  ')));

			case 214:
				_iteratorNormalCompletion = true;
				context$1$0.next = 48;
				break;

			case 217:
				context$1$0.next = 223;
				break;

			case 219:
				context$1$0.prev = 219;
				context$1$0.t5 = context$1$0['catch'](46);
				_didIteratorError = true;
				_iteratorError = context$1$0.t5;

			case 223:
				context$1$0.prev = 223;
				context$1$0.prev = 224;

				if (!_iteratorNormalCompletion && _iterator['return']) {
					_iterator['return']();
				}

			case 226:
				context$1$0.prev = 226;

				if (!_didIteratorError) {
					context$1$0.next = 229;
					break;
				}

				throw _iteratorError;

			case 229:
				return context$1$0.finish(226);

			case 230:
				return context$1$0.finish(223);

			case 231:
				if (!buildConfig.tasks.bundles) {
					context$1$0.next = 291;
					break;
				}

				context$1$0.next = 234;
				return regeneratorRuntime.awrap(_qIoFs2['default'].listTree((0, _path.resolve)(patternRoot, '@environments')));

			case 234:
				environments = context$1$0.sent;

				environments = environments.filter(function (item) {
					return (0, _path.basename)(item) === 'pattern.json';
				}).map(function (item) {
					return (0, _path.dirname)(item);
				});

				if (environments.length === 0) {
					environments = ['index'];
				}

				builds = [];
				_iteratorNormalCompletion7 = true;
				_didIteratorError7 = false;
				_iteratorError7 = undefined;
				context$1$0.prev = 241;
				_iterator7 = environments[Symbol.iterator]();

			case 243:
				if (_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done) {
					context$1$0.next = 252;
					break;
				}

				_environment2 = _step7.value;
				context$1$0.next = 247;
				return regeneratorRuntime.awrap((0, _libraryUtilitiesGetPatterns2['default'])({
					'id': _qIoFs2['default'].relativeFromDirectory(patternRoot, _environment2),
					'base': patternRoot,
					'config': patternConfig,
					'factory': application.pattern.factory,
					'transforms': application.transforms,
					'filters': {},
					'log': function log() {
						var _application$log2;

						for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
							args[_key2] = arguments[_key2];
						}

						(_application$log2 = application.log).debug.apply(_application$log2, ['[console:run]'].concat(args));
					}
				}, application.cache, false, true));

			case 247:
				pattern = context$1$0.sent;

				builds.push(pattern[0]);

			case 249:
				_iteratorNormalCompletion7 = true;
				context$1$0.next = 243;
				break;

			case 252:
				context$1$0.next = 258;
				break;

			case 254:
				context$1$0.prev = 254;
				context$1$0.t6 = context$1$0['catch'](241);
				_didIteratorError7 = true;
				_iteratorError7 = context$1$0.t6;

			case 258:
				context$1$0.prev = 258;
				context$1$0.prev = 259;

				if (!_iteratorNormalCompletion7 && _iterator7['return']) {
					_iterator7['return']();
				}

			case 261:
				context$1$0.prev = 261;

				if (!_didIteratorError7) {
					context$1$0.next = 264;
					break;
				}

				throw _iteratorError7;

			case 264:
				return context$1$0.finish(261);

			case 265:
				return context$1$0.finish(258);

			case 266:
				context$1$0.next = 268;
				return regeneratorRuntime.awrap(_qIoFs2['default'].makeTree(patternBuildDirectory));

			case 268:
				writes = [];
				_iteratorNormalCompletion8 = true;
				_didIteratorError8 = false;
				_iteratorError8 = undefined;
				context$1$0.prev = 272;

				_loop = function () {
					var build = _step8.value;

					var target = build.manifest.name;

					var info = Object.assign({}, information, { version: version, target: target });
					var fragments = ['/**!'];

					var comment = Object.keys(info).reduce(function (results, fragmentName) {
						var name = '' + fragmentName[0].toUpperCase() + fragmentName.slice(1);
						var value = info[fragmentName];
						results.push(' * ' + name + ': ' + value);
						return results;
					}, fragments).concat(['**/']).join('\n');

					var results = build.results[target];

					_iteratorNormalCompletion9 = true;
					_didIteratorError9 = false;
					_iteratorError9 = undefined;

					try {
						for (_iterator9 = Object.keys(results)[Symbol.iterator](); !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
							var resultName = _step9.value;

							var result = results[resultName];
							var contents = comment + '\n' + result.buffer.toString('utf-8');
							var ext = result.out;
							var fileName = (0, _path.resolve)(buildDirectory, [build.manifest.name, ext].join('.'));
							application.log.info('[console:run] Writing "' + resultName + '" for configuration "' + build.manifest.name + '" to ' + fileName + ' ...');
							writes.push(_qIoFs2['default'].write(fileName, contents));
						}
					} catch (err) {
						_didIteratorError9 = true;
						_iteratorError9 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion9 && _iterator9['return']) {
								_iterator9['return']();
							}
						} finally {
							if (_didIteratorError9) {
								throw _iteratorError9;
							}
						}
					}
				};

				for (_iterator8 = builds[Symbol.iterator](); !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
					_loop();
				}

				context$1$0.next = 281;
				break;

			case 277:
				context$1$0.prev = 277;
				context$1$0.t7 = context$1$0['catch'](272);
				_didIteratorError8 = true;
				_iteratorError8 = context$1$0.t7;

			case 281:
				context$1$0.prev = 281;
				context$1$0.prev = 282;

				if (!_iteratorNormalCompletion8 && _iterator8['return']) {
					_iterator8['return']();
				}

			case 284:
				context$1$0.prev = 284;

				if (!_didIteratorError8) {
					context$1$0.next = 287;
					break;
				}

				throw _iteratorError8;

			case 287:
				return context$1$0.finish(284);

			case 288:
				return context$1$0.finish(281);

			case 289:
				context$1$0.next = 291;
				return regeneratorRuntime.awrap(Promise.all(writes));

			case 291:
				if (!buildConfig.tasks['static']) {
					context$1$0.next = 303;
					break;
				}

				context$1$0.next = 294;
				return regeneratorRuntime.awrap(_qIoFs2['default'].exists(staticRoot));

			case 294:
				if (!context$1$0.sent) {
					context$1$0.next = 302;
					break;
				}

				application.log.info('[console:run] Copy asset files from "' + assetRoot + '" to ' + patternBuildDirectory + ' ...');
				context$1$0.next = 298;
				return regeneratorRuntime.awrap(_qIoFs2['default'].makeTree((0, _path.resolve)(patternBuildDirectory, 'static')));

			case 298:
				context$1$0.next = 300;
				return regeneratorRuntime.awrap(_qIoFs2['default'].copyTree(staticRoot, (0, _path.resolve)(patternBuildDirectory, 'static')));

			case 300:
				context$1$0.next = 303;
				break;

			case 302:
				application.log.info('[console:run] No asset files at "' + assetRoot + '"');

			case 303:
				archive = (0, _archiver2['default'])('zip');
				output = (0, _fs.createWriteStream)(buildDirectory + '.zip');

				archive.pipe(output);
				archive.directory(buildDirectory, false);
				archive.finalize();

				return context$1$0.abrupt('return', new Promise(function (fulfill, reject) {
					output.on('close', fulfill);
					archive.on('error', reject);
				}));

			case 309:
			case 'end':
				return context$1$0.stop();
		}
	}, null, this, [[46, 219, 223, 231], [60, 140, 144, 152], [70, 123, 127, 135], [81, 97, 101, 109], [102,, 104, 108], [128,, 130, 134], [145,, 147, 151], [156, 188, 192, 200], [167, 171, 175, 183], [176,, 178, 182], [193,, 195, 199], [224,, 226, 230], [241, 254, 258, 266], [259,, 261, 265], [272, 277, 281, 289], [282,, 284, 288]]);
}

exports['default'] = build;
module.exports = exports['default'];

// Copy assets

// write pattern.json with additional meta data
// Write all variants into snippets

// Write main variant into pattern build folder, render html into layout

// TODO: resolve this

// Render markup into layout, write to index.html

// Write index.html

// Write build.json to pattern tree

// Write build.json to cache tree

// Write augmented pattern.json

// Build environment output

// Copy static files