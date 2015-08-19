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

				// Write all variants into snippets
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

// Write main variant into pattern build folder, render html into layout

// TODO: resolve this

// Render markup into layout, write to index.html

// Write index.html

// Write build.json to pattern tree

// Write build.json to cache tree

// Write augmented pattern.json

// Build environment output

// Copy static files
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NvdXJjZS9hcHBsaWNhdGlvbi90YXNrcy9idWlsZC9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztvQkFBeUMsTUFBTTs7a0JBQ2YsSUFBSTs7cUJBRXBCLFNBQVM7Ozs7d0JBQ0osVUFBVTs7OzsyQkFDYixjQUFjOzs7OzJDQUVSLHlDQUF5Qzs7OzswQ0FDMUMsd0NBQXdDOzs7O21DQUMvQyxnQ0FBZ0M7Ozs7dUJBRTdCLGVBQWU7Ozs7QUFFbEMsSUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLG1CQUFRLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFDOztBQUU1RCxTQUFlLEtBQUssQ0FBRSxXQUFXLEVBQUUsTUFBTTtLQUNsQyxXQUFXLEVBQ1gsV0FBVyxFQUNYLFVBQVUsRUFDVixTQUFTLEVBRVQsV0FBVyxFQUVYLFFBQVEsRUFDUixVQUFVLEVBQ1YsYUFBYSxFQUViLEtBQUssRUFDTCxXQUFXLEVBQ1gsSUFBSSxFQUNKLFFBQVEsRUFDUixNQUFNLEVBQ04sR0FBRyxFQUNILE9BQU8sRUFFUCxXQUFXLEVBQ1gsU0FBUyxFQUNULGNBQWMsRUFDZCxxQkFBcUIsRUFDckIsb0JBQW9CLEVBaUJyQixXQUFXLGtGQWdCTixXQUFXLEVBQ2Ysc0JBQXNCLEVBQ3RCLHdCQUF3QixFQU14QixRQUFRLHVGQVNILHFCQUFxQixFQUN6QixpQkFBaUIsRUFDakIsaUJBQWlCLHVGQUdaLFVBQVUsRUFzRWQsTUFBTSxFQWxFTixRQUFRLHVGQU9ILE9BQU8sRUFDWCxTQUFTLEVBUVQsa0JBQWtCLEVBQ2xCLFVBQVUsRUFNWCxVQUFVLEVBQ1YsUUFBUSxFQVVSLGdCQUFnQixFQUNoQixRQUFRLEVBTVYsWUFBWSx1RkFrQlAsZUFBZSxFQUNuQixZQUFXLEVBQ1gsU0FBUyxFQUNULE9BQU8sRUFDUCxTQUFTLHVGQUVKLFVBQVUsRUFFZCxXQUFXLEVBQ1gsT0FBTyxFQUNQLEdBQUcsRUFDSCxtQkFBbUIs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QUMsR0FBRyxDQUFDLElBQUksMkNBQXlDLFNBQVMsYUFBUSxxQkFBcUIsVUFBTyxDQUFDOztvQ0FDckcsbUJBQUksUUFBUSxDQUFDLG1CQUFRLHFCQUFxQixFQUFFLFFBQVEsQ0FBQyxDQUFDOzs7O29DQUN0RCxtQkFBSSxRQUFRLENBQUMsVUFBVSxFQUFFLG1CQUFRLHFCQUFxQixFQUFFLFFBQVEsQ0FBQyxDQUFDOzs7Ozs7O0FBRXhFLGVBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSx1Q0FBcUMsU0FBUyxPQUFJLENBQUM7OztBQUlyRSxXQUFPLEdBQUcsMkJBQVMsS0FBSyxDQUFDO0FBQ3pCLFVBQU0sR0FBRywyQkFBcUIsY0FBYyxVQUFPOztBQUV2RCxXQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3JCLFdBQU8sQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3pDLFdBQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQzs7d0NBRVosSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFLO0FBQ3ZDLFdBQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQzVCLFlBQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0tBQzVCLENBQUM7Ozs7Ozs7Q0FDRjs7cUJBRWMsS0FBSyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7cmVzb2x2ZSwgYmFzZW5hbWUsIGRpcm5hbWV9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IHtjcmVhdGVXcml0ZVN0cmVhbX0gZnJvbSAnZnMnO1xuXG5pbXBvcnQgcWZzIGZyb20gJ3EtaW8vZnMnO1xuaW1wb3J0IGFyY2hpdmVyIGZyb20gJ2FyY2hpdmVyJztcbmltcG9ydCBtZXJnZSBmcm9tICdsb2Rhc2gubWVyZ2UnO1xuXG5pbXBvcnQgZ2V0UGF0dGVybnMgZnJvbSAnLi4vLi4vLi4vbGlicmFyeS91dGlsaXRpZXMvZ2V0LXBhdHRlcm5zJztcbmltcG9ydCBnZXRXcmFwcGVyIGZyb20gJy4uLy4uLy4uL2xpYnJhcnkvdXRpbGl0aWVzL2dldC13cmFwcGVyJztcbmltcG9ydCBnaXQgZnJvbSAnLi4vLi4vLi4vbGlicmFyeS91dGlsaXRpZXMvZ2l0JztcblxuaW1wb3J0IGxheW91dCBmcm9tICcuLi8uLi9sYXlvdXRzJztcblxuY29uc3QgcGtnID0gcmVxdWlyZShyZXNvbHZlKHByb2Nlc3MuY3dkKCksICdwYWNrYWdlLmpzb24nKSk7XG5cbmFzeW5jIGZ1bmN0aW9uIGJ1aWxkIChhcHBsaWNhdGlvbiwgY29uZmlnKSB7XG5cdGNvbnN0IHBhdHRlcm5Ib29rID0gYXBwbGljYXRpb24uaG9va3MuZmlsdGVyKChob29rKSA9PiBob29rLm5hbWUgPT09ICdwYXR0ZXJucycpWzBdO1xuXHRjb25zdCBwYXR0ZXJuUm9vdCA9IHJlc29sdmUoYXBwbGljYXRpb24ucnVudGltZS5wYXR0ZXJuY3dkIHx8IGFwcGxpY2F0aW9uLnJ1bnRpbWUuY3dkLCBwYXR0ZXJuSG9vay5jb25maWd1cmF0aW9uLnBhdGgpO1xuXHRjb25zdCBzdGF0aWNSb290ID0gcmVzb2x2ZShhcHBsaWNhdGlvbi5ydW50aW1lLnBhdHRlcm5jd2QgfHwgYXBwbGljYXRpb24ucnVudGltZS5jd2QsICdzdGF0aWMnKTtcblx0Y29uc3QgYXNzZXRSb290ID0gcmVzb2x2ZShhcHBsaWNhdGlvbi5ydW50aW1lLmN3ZCwgJ2Fzc2V0cycpO1xuXG5cdGNvbnN0IGJ1aWxkQ29uZmlnID0gYXBwbGljYXRpb24uY29uZmlndXJhdGlvbi5idWlsZCB8fCB7fTtcblxuXHRjb25zdCBwYXR0ZXJucyA9IG1lcmdlKHt9LCBhcHBsaWNhdGlvbi5jb25maWd1cmF0aW9uLnBhdHRlcm5zIHx8IHt9LCBidWlsZENvbmZpZy5wYXR0ZXJucyB8fCB7fSk7XG5cdGNvbnN0IHRyYW5zZm9ybXMgPSBtZXJnZSh7fSwgYXBwbGljYXRpb24uY29uZmlndXJhdGlvbi50cmFuc2Zvcm1zIHx8IHt9LCBidWlsZENvbmZpZy50cmFuc2Zvcm1zIHx8IHt9KTtcblx0Y29uc3QgcGF0dGVybkNvbmZpZyA9IHsgcGF0dGVybnMsIHRyYW5zZm9ybXMgfTtcblxuXHRjb25zdCBidWlsdCA9IG5ldyBEYXRlKCk7XG5cdGNvbnN0IGVudmlyb25tZW50ID0gYXBwbGljYXRpb24ucnVudGltZS5lbnY7XG5cdGNvbnN0IG1vZGUgPSBhcHBsaWNhdGlvbi5ydW50aW1lLm1vZGU7XG5cdGNvbnN0IHJldmlzaW9uID0gYXdhaXQgZ2l0LnNob3J0KCk7XG5cdGNvbnN0IGJyYW5jaCA9IGF3YWl0IGdpdC5icmFuY2goKTtcblx0Y29uc3QgdGFnID0gYXdhaXQgZ2l0LnRhZygpO1xuXHRjb25zdCB2ZXJzaW9uID0gcGtnLnZlcnNpb247XG5cblx0Y29uc3QgaW5mb3JtYXRpb24gPSB7YnVpbHQsIGVudmlyb25tZW50LCBtb2RlLCByZXZpc2lvbiwgYnJhbmNoLCB0YWcsIHZlcnNpb259O1xuXHRjb25zdCBidWlsZFJvb3QgPSByZXNvbHZlKGFwcGxpY2F0aW9uLnJ1bnRpbWUucGF0dGVybmN3ZCB8fCBhcHBsaWNhdGlvbi5ydW50aW1lLmN3ZCwgJ2J1aWxkJyk7XG5cdGNvbnN0IGJ1aWxkRGlyZWN0b3J5ID0gcmVzb2x2ZShidWlsZFJvb3QsIGBidWlsZC12JHt2ZXJzaW9ufS0ke2Vudmlyb25tZW50fS0ke3JldmlzaW9ufWApO1xuXHRjb25zdCBwYXR0ZXJuQnVpbGREaXJlY3RvcnkgPSByZXNvbHZlKGJ1aWxkRGlyZWN0b3J5LCAncGF0dGVybnMnKTtcblx0Y29uc3Qgc3RhdGljQ2FjaGVEaXJlY3RvcnkgPSByZXNvbHZlKGFwcGxpY2F0aW9uLnJ1bnRpbWUucGF0dGVybmN3ZCB8fCBhcHBsaWNhdGlvbi5ydW50aW1lLmN3ZCwgJy5jYWNoZScpO1xuXG5cblx0aWYgKGJ1aWxkQ29uZmlnLnRhc2tzLnBhdHRlcm5zKSB7XG5cdFx0Ly8gQ29weSBhc3NldHNcblx0XHRpZiAoYXdhaXQgcWZzLmV4aXN0cyhhc3NldFJvb3QpKSB7XG5cdFx0XHRhcHBsaWNhdGlvbi5sb2cuaW5mbyhgW2NvbnNvbGU6cnVuXSBDb3B5IHN0YXRpYyBmaWxlcyBmcm9tIFwiJHtzdGF0aWNSb290fVwiIHRvICR7YnVpbGREaXJlY3Rvcnl9IC4uLmApO1xuXHRcdFx0YXdhaXQgcWZzLm1ha2VUcmVlKHJlc29sdmUocGF0dGVybkJ1aWxkRGlyZWN0b3J5LCAnX2Fzc2V0cycpKTtcblx0XHRcdGF3YWl0IHFmcy5jb3B5VHJlZShhc3NldFJvb3QsIHJlc29sdmUocGF0dGVybkJ1aWxkRGlyZWN0b3J5LCAnX2Fzc2V0cycpKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0YXBwbGljYXRpb24ubG9nLmluZm8oYFtjb25zb2xlOnJ1bl0gTm8gc3RhdGljIGZpbGVzIGF0IFwiJHtzdGF0aWNSb290fVwiYCk7XG5cdFx0fVxuXG5cdFx0aWYgKGFwcGxpY2F0aW9uLmNhY2hlKSB7XG5cdFx0XHRhcHBsaWNhdGlvbi5jYWNoZS5jb25maWcuc3RhdGljID0gZmFsc2U7XG5cdFx0fVxuXG5cdFx0bGV0IHBhdHRlcm5MaXN0ID0gYXdhaXQgZ2V0UGF0dGVybnMoe1xuXHRcdFx0J2lkJzogJy4nLFxuXHRcdFx0J2Jhc2UnOiBwYXR0ZXJuUm9vdCxcblx0XHRcdCdjb25maWcnOiBwYXR0ZXJuQ29uZmlnLFxuXHRcdFx0J2ZhY3RvcnknOiBhcHBsaWNhdGlvbi5wYXR0ZXJuLmZhY3RvcnksXG5cdFx0XHQndHJhbnNmb3Jtcyc6IGFwcGxpY2F0aW9uLnRyYW5zZm9ybXMsXG5cdFx0XHQnZmlsdGVycyc6IHt9LFxuXHRcdFx0J2xvZyc6IGZ1bmN0aW9uKC4uLmFyZ3MpIHtcblx0XHRcdFx0YXBwbGljYXRpb24ubG9nLmRlYnVnKC4uLlsnW2NvbnNvbGU6cnVuXScsIC4uLmFyZ3NdKTtcblx0XHRcdH1cblx0XHR9LCBhcHBsaWNhdGlvbi5jYWNoZSwgZmFsc2UsIGZhbHNlKTtcblxuXHRcdGlmIChhcHBsaWNhdGlvbi5jYWNoZSkge1xuXHRcdFx0YXBwbGljYXRpb24uY2FjaGUuY29uZmlnLnN0YXRpYyA9IHRydWU7XG5cdFx0fVxuXG5cdFx0Zm9yIChsZXQgcGF0dGVybkl0ZW0gb2YgcGF0dGVybkxpc3QpIHtcblx0XHRcdGxldCBwYXR0ZXJuUmVzdWx0RGlyZWN0b3J5ID0gcmVzb2x2ZShwYXR0ZXJuQnVpbGREaXJlY3RvcnksIHBhdHRlcm5JdGVtLmlkKTtcblx0XHRcdGxldCBwYXR0ZXJuU25pcHBldHNEaXJlY3RvcnkgPSByZXNvbHZlKHBhdHRlcm5SZXN1bHREaXJlY3RvcnksICdzbmlwcGV0cycpO1xuXG5cdFx0XHRhd2FpdCBxZnMubWFrZVRyZWUocGF0dGVyblJlc3VsdERpcmVjdG9yeSk7XG5cdFx0XHRhd2FpdCBxZnMubWFrZVRyZWUocGF0dGVyblNuaXBwZXRzRGlyZWN0b3J5KTtcblxuXHRcdFx0Ly8gd3JpdGUgcGF0dGVybi5qc29uIHdpdGggYWRkaXRpb25hbCBtZXRhIGRhdGFcblx0XHRcdGxldCBtZXRhRGF0YSA9IE9iamVjdC5hc3NpZ24oe30sIHBhdHRlcm5JdGVtLm1hbmlmZXN0LCB7XG5cdFx0XHRcdCdidWlsZCc6IHtcblx0XHRcdFx0XHQnZGF0ZSc6IGJ1aWx0LFxuXHRcdFx0XHRcdGVudmlyb25tZW50LCBtb2RlLCByZXZpc2lvbixcblx0XHRcdFx0XHR0YWcsIHZlcnNpb25cblx0XHRcdFx0fSxcblx0XHRcdFx0J3Jlc3VsdHMnOiB7fVxuXHRcdFx0fSk7XG5cblx0XHRcdGZvciAobGV0IHJlc3VsdEVudmlyb25tZW50TmFtZSBvZiBPYmplY3Qua2V5cyhwYXR0ZXJuSXRlbS5yZXN1bHRzKSkge1xuXHRcdFx0XHRsZXQgcmVzdWx0RW52aXJvbm1lbnQgPSBwYXR0ZXJuSXRlbS5yZXN1bHRzW3Jlc3VsdEVudmlyb25tZW50TmFtZV07XG5cdFx0XHRcdGxldCBlbnZpcm9ubWVudENvbmZpZyA9IHBhdHRlcm5JdGVtLmVudmlyb25tZW50c1tyZXN1bHRFbnZpcm9ubWVudE5hbWVdLm1hbmlmZXN0O1xuXHRcdFx0XHRtZXRhRGF0YS5yZXN1bHRzW3Jlc3VsdEVudmlyb25tZW50TmFtZV0gPSB7fTtcblxuXHRcdFx0XHRmb3IgKGxldCByZXN1bHROYW1lIG9mIE9iamVjdC5rZXlzKHJlc3VsdEVudmlyb25tZW50KSkge1xuXHRcdFx0XHRcdGxldCByZXN1bHQgPSByZXN1bHRFbnZpcm9ubWVudFtyZXN1bHROYW1lXTtcblx0XHRcdFx0XHRtZXRhRGF0YS5yZXN1bHRzW3Jlc3VsdEVudmlyb25tZW50TmFtZV1bcmVzdWx0TmFtZV0gPSB7fTtcblxuXHRcdFx0XHRcdGxldCB2YXJpYW50cyA9IFtcblx0XHRcdFx0XHRcdHsgJ25hbWUnOiAnZGVtbycsICdidWZmZXInOiByZXN1bHQuZGVtb0J1ZmZlciB9LFxuXHRcdFx0XHRcdFx0eyAnbmFtZSc6ICcnLCAnYnVmZmVyJzogcmVzdWx0LmJ1ZmZlciB9XG5cdFx0XHRcdFx0XTtcblx0XHRcdFx0XHR2YXJpYW50cyA9IHZhcmlhbnRzLmZpbHRlcigoaXRlbSkgPT4gaXRlbS5idWZmZXIubGVuZ3RoID4gMCk7XG5cblx0XHRcdFx0XHQvLyBXcml0ZSBhbGwgdmFyaWFudHMgaW50byBzbmlwcGV0c1xuXHRcdFx0XHRcdGZvciAobGV0IHZhcmlhbnQgb2YgdmFyaWFudHMpIHtcblx0XHRcdFx0XHRcdGxldCBmcmFnbWVudHMgPSBbXG5cdFx0XHRcdFx0XHRcdHJlc3VsdE5hbWUudG9Mb3dlckNhc2UoKSxcblx0XHRcdFx0XHRcdFx0IWVudmlyb25tZW50Q29uZmlnLmZvcm1hdHMgfHwgZW52aXJvbm1lbnRDb25maWcuZm9ybWF0cy5pbmNsdWRlcyhyZXN1bHQuaW4pID8gcmVzdWx0RW52aXJvbm1lbnROYW1lIDogJycsXG5cdFx0XHRcdFx0XHRcdHZhcmlhbnRzLmxlbmd0aCA+IDEgPyB2YXJpYW50Lm5hbWUgOiAnJ1xuXHRcdFx0XHRcdFx0XTtcblxuXHRcdFx0XHRcdFx0ZnJhZ21lbnRzID0gZnJhZ21lbnRzLmZpbHRlcigoaXRlbSkgPT4gaXRlbSk7XG5cblx0XHRcdFx0XHRcdGxldCByZXN1bHRGaWxlQmFzZU5hbWUgPSBgJHtmcmFnbWVudHMuam9pbignLScpfS4ke3Jlc3VsdC5vdXR9YDtcblx0XHRcdFx0XHRcdGxldCByZXN1bHRGaWxlID0gcmVzb2x2ZShwYXR0ZXJuU25pcHBldHNEaXJlY3RvcnksIHJlc3VsdEZpbGVCYXNlTmFtZSk7XG5cdFx0XHRcdFx0XHRhd2FpdCBxZnMud3JpdGUocmVzdWx0RmlsZSwgdmFyaWFudC5idWZmZXIpO1xuXHRcdFx0XHRcdFx0bWV0YURhdGEucmVzdWx0c1tyZXN1bHRFbnZpcm9ubWVudE5hbWVdW3Jlc3VsdE5hbWVdW3ZhcmlhbnQubmFtZSB8fCAnbGlicmFyeSddID0gcWZzLnJlbGF0aXZlRnJvbURpcmVjdG9yeShwYXR0ZXJuUmVzdWx0RGlyZWN0b3J5LCByZXN1bHRGaWxlKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBXcml0ZSBtYWluIHZhcmlhbnQgaW50byBwYXR0ZXJuIGJ1aWxkIGZvbGRlciwgcmVuZGVyIGh0bWwgaW50byBsYXlvdXRcblx0XHRcdFx0XHRsZXQgbWFpbkJ1ZmZlciA9IHJlc3VsdC5kZW1vQnVmZmVyIHx8IHJlc3VsdC5idWZmZXI7XG5cdFx0XHRcdFx0bGV0IG1haW5OYW1lID0gcmVzdWx0TmFtZS50b0xvd2VyQ2FzZSgpO1xuXG5cdFx0XHRcdFx0Ly8gVE9ETzogcmVzb2x2ZSB0aGlzXG5cdFx0XHRcdFx0aWYgKG1haW5OYW1lID09PSAnbWFya3VwJykge1xuXHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gVE9ETzogcmVzb2x2ZSB0aGlzXG5cdFx0XHRcdFx0bWFpbk5hbWUgPSBtYWluTmFtZSA9PT0gJ2RvY3VtZW50YXRpb24nID8gbWFpbk5hbWUgOiByZXN1bHRFbnZpcm9ubWVudE5hbWU7XG5cblx0XHRcdFx0XHRsZXQgbWFpbkZpbGVCYXNlTmFtZSA9IGAke21haW5OYW1lfS4ke3Jlc3VsdC5vdXR9YDtcblx0XHRcdFx0XHRsZXQgbWFpbkZpbGUgPSByZXNvbHZlKHBhdHRlcm5SZXN1bHREaXJlY3RvcnksIG1haW5GaWxlQmFzZU5hbWUpO1xuXHRcdFx0XHRcdGF3YWl0IHFmcy53cml0ZShtYWluRmlsZSwgbWFpbkJ1ZmZlcik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gUmVuZGVyIG1hcmt1cCBpbnRvIGxheW91dCwgd3JpdGUgdG8gaW5kZXguaHRtbFxuXHRcdFx0bGV0IHRlbXBsYXRlRGF0YSA9IHtcblx0XHRcdFx0J3RpdGxlJzogcGF0dGVybkl0ZW0uaWQsXG5cdFx0XHRcdCdzdHlsZSc6IFtdLFxuXHRcdFx0XHQnc2NyaXB0JzogW10sXG5cdFx0XHRcdCdtYXJrdXAnOiBbXSxcblx0XHRcdFx0J3JvdXRlJzogKG5hbWUsIHBhcmFtcykgPT4ge1xuXHRcdFx0XHRcdC8vIFRPRE86IEdlbmVyYWxpemUgdGhpc1xuXHRcdFx0XHRcdGxldCBpZCA9IHBhcmFtcy5pZCB8fCBwYXJhbXMucGF0aDtcblx0XHRcdFx0XHRpZCA9IGlkID09PSAnY29udGVudC5qcycgPyAnY29udGVudC5idW5kbGUuanMnIDogaWQ7XG5cdFx0XHRcdFx0bmFtZSA9IG5hbWUgPT09ICdzY3JpcHQnID8gJ19hc3NldHMvc2NyaXB0JyA6IG5hbWU7XG5cblx0XHRcdFx0XHRsZXQgZnJhZ21lbnRzID0gW25hbWUsIGlkXTtcblx0XHRcdFx0XHRmcmFnbWVudHMgPSBmcmFnbWVudHMuZmlsdGVyKChpdGVtKSA9PiBpdGVtKTtcblxuXHRcdFx0XHRcdHJldHVybiAnLycgKyBmcmFnbWVudHMuam9pbignLycpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHRmb3IgKGxldCBlbnZpcm9ubWVudE5hbWUgb2YgT2JqZWN0LmtleXMocGF0dGVybkl0ZW0ucmVzdWx0cykpIHtcblx0XHRcdFx0bGV0IGVudmlyb25tZW50ID0gcGF0dGVybkl0ZW0ucmVzdWx0c1tlbnZpcm9ubWVudE5hbWVdO1xuXHRcdFx0XHRsZXQgZW52Q29uZmlnID0gcGF0dGVybkl0ZW0uZW52aXJvbm1lbnRzW2Vudmlyb25tZW50TmFtZV0ubWFuaWZlc3QgfHwge307XG5cdFx0XHRcdGxldCB3cmFwcGVyID0gZ2V0V3JhcHBlcihlbnZDb25maWdbJ2NvbmRpdGlvbmFsLWNvbW1lbnQnXSk7XG5cdFx0XHRcdGxldCBibHVlcHJpbnQgPSB7J2Vudmlyb25tZW50JzogZW52aXJvbm1lbnROYW1lLCAnY29udGVudCc6ICcnLCB3cmFwcGVyfTtcblxuXHRcdFx0XHRmb3IgKGxldCByZXN1bHRUeXBlIG9mIE9iamVjdC5rZXlzKGVudmlyb25tZW50KSkge1xuXHRcdFx0XHRcdGxldCByZXN1bHQgPSBlbnZpcm9ubWVudFtyZXN1bHRUeXBlXTtcblx0XHRcdFx0XHRsZXQgdGVtcGxhdGVLZXkgPSByZXN1bHRUeXBlLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRcdFx0bGV0IGNvbnRlbnQgPSByZXN1bHQuZGVtb0J1ZmZlciB8fCByZXN1bHQuYnVmZmVyO1xuXHRcdFx0XHRcdGxldCB1cmkgPSBgJHtwYXR0ZXJuSXRlbS5pZH0vJHtlbnZpcm9ubWVudE5hbWV9LiR7cmVzdWx0Lm91dH1gO1xuXHRcdFx0XHRcdGxldCB0ZW1wbGF0ZVNlY3Rpb25EYXRhID0gT2JqZWN0LmFzc2lnbih7fSwgYmx1ZXByaW50LCB7Y29udGVudCwgdXJpfSk7XG5cblx0XHRcdFx0XHR0ZW1wbGF0ZURhdGFbdGVtcGxhdGVLZXldID0gQXJyYXkuaXNBcnJheSh0ZW1wbGF0ZURhdGFbdGVtcGxhdGVLZXldKSA/XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZURhdGFbdGVtcGxhdGVLZXldLmNvbmNhdChbdGVtcGxhdGVTZWN0aW9uRGF0YV0pIDpcblx0XHRcdFx0XHRcdFt0ZW1wbGF0ZVNlY3Rpb25EYXRhXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRsZXQgcmVuZGVyZWQgPSBsYXlvdXQodGVtcGxhdGVEYXRhKTtcblxuXHRcdFx0Ly8gV3JpdGUgaW5kZXguaHRtbFxuXHRcdFx0YXdhaXQgcWZzLndyaXRlKHJlc29sdmUocGF0dGVyblJlc3VsdERpcmVjdG9yeSwgJ2luZGV4Lmh0bWwnKSwgcmVuZGVyZWQpO1xuXG5cdFx0XHQvLyBXcml0ZSBidWlsZC5qc29uIHRvIHBhdHRlcm4gdHJlZVxuXHRcdFx0YXdhaXQgcWZzLndyaXRlKHJlc29sdmUocGF0dGVyblJlc3VsdERpcmVjdG9yeSwgJ2J1aWxkLmpzb24nKSwgSlNPTi5zdHJpbmdpZnkocGF0dGVybkl0ZW0sIG51bGwsICcgICcpKTtcblxuXHRcdFx0Ly8gV3JpdGUgYnVpbGQuanNvbiB0byBjYWNoZSB0cmVlXG5cdFx0XHRpZiAoYnVpbGRDb25maWcudGFza3MuY2FjaGUpIHtcblx0XHRcdFx0bGV0IHN0YXRpY1BhdHRlcm5DYWNoZURpcmVjdG9yeSA9IHJlc29sdmUoc3RhdGljQ2FjaGVEaXJlY3RvcnksIHBhdHRlcm5JdGVtLmlkKTtcblxuXHRcdFx0XHRhcHBsaWNhdGlvbi5sb2cuaW5mbyhgW2NvbnNvbGU6cnVuXSBXcml0aW5nIGNhY2hlIGZvciBcIiR7cGF0dGVybkl0ZW0uaWR9XCIgdG8gJHtzdGF0aWNQYXR0ZXJuQ2FjaGVEaXJlY3Rvcnl9IC4uLmApO1xuXHRcdFx0XHRhd2FpdCBxZnMubWFrZVRyZWUoc3RhdGljUGF0dGVybkNhY2hlRGlyZWN0b3J5KTtcblx0XHRcdFx0YXdhaXQgcWZzLndyaXRlKHJlc29sdmUoc3RhdGljUGF0dGVybkNhY2hlRGlyZWN0b3J5LCAnYnVpbGQuanNvbicpLCBKU09OLnN0cmluZ2lmeShwYXR0ZXJuSXRlbSwgbnVsbCwgJyAgJykpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBXcml0ZSBhdWdtZW50ZWQgcGF0dGVybi5qc29uXG5cdFx0XHRhd2FpdCBxZnMud3JpdGUocmVzb2x2ZShwYXR0ZXJuUmVzdWx0RGlyZWN0b3J5LCAncGF0dGVybi5qc29uJyksIEpTT04uc3RyaW5naWZ5KG1ldGFEYXRhLCBudWxsLCAnICAnKSk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gQnVpbGQgZW52aXJvbm1lbnQgb3V0cHV0XG5cdGlmIChidWlsZENvbmZpZy50YXNrcy5idW5kbGVzKSB7XG5cdFx0bGV0IGVudmlyb25tZW50cyA9IGF3YWl0IHFmcy5saXN0VHJlZShyZXNvbHZlKHBhdHRlcm5Sb290LCAnQGVudmlyb25tZW50cycpKTtcblxuXHRcdGVudmlyb25tZW50cyA9IGVudmlyb25tZW50c1xuXHRcdFx0LmZpbHRlcigoaXRlbSkgPT4gYmFzZW5hbWUoaXRlbSkgPT09ICdwYXR0ZXJuLmpzb24nKVxuXHRcdFx0Lm1hcCgoaXRlbSkgPT4gZGlybmFtZShpdGVtKSk7XG5cblx0XHRpZiAoZW52aXJvbm1lbnRzLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0ZW52aXJvbm1lbnRzID0gWydpbmRleCddO1xuXHRcdH1cblxuXHRcdGxldCBidWlsZHMgPSBbXTtcblxuXHRcdGZvciAobGV0IGVudmlyb25tZW50IG9mIGVudmlyb25tZW50cykge1xuXHRcdFx0bGV0IHBhdHRlcm4gPSBhd2FpdCBnZXRQYXR0ZXJucyh7XG5cdFx0XHRcdCdpZCc6IHFmcy5yZWxhdGl2ZUZyb21EaXJlY3RvcnkocGF0dGVyblJvb3QsIGVudmlyb25tZW50KSxcblx0XHRcdFx0J2Jhc2UnOiBwYXR0ZXJuUm9vdCxcblx0XHRcdFx0J2NvbmZpZyc6IHBhdHRlcm5Db25maWcsXG5cdFx0XHRcdCdmYWN0b3J5JzogYXBwbGljYXRpb24ucGF0dGVybi5mYWN0b3J5LFxuXHRcdFx0XHQndHJhbnNmb3Jtcyc6IGFwcGxpY2F0aW9uLnRyYW5zZm9ybXMsXG5cdFx0XHRcdCdmaWx0ZXJzJzoge30sXG5cdFx0XHRcdCdsb2cnOiBmdW5jdGlvbiguLi5hcmdzKSB7XG5cdFx0XHRcdFx0YXBwbGljYXRpb24ubG9nLmRlYnVnKC4uLlsnW2NvbnNvbGU6cnVuXScsIC4uLmFyZ3NdKTtcblx0XHRcdFx0fVxuXHRcdFx0fSwgYXBwbGljYXRpb24uY2FjaGUsIGZhbHNlLCB0cnVlKTtcblxuXHRcdFx0YnVpbGRzLnB1c2gocGF0dGVyblswXSk7XG5cdFx0fVxuXG5cdFx0YXdhaXQgcWZzLm1ha2VUcmVlKHBhdHRlcm5CdWlsZERpcmVjdG9yeSk7XG5cdFx0bGV0IHdyaXRlcyA9IFtdO1xuXG5cdFx0Zm9yIChsZXQgYnVpbGQgb2YgYnVpbGRzKSB7XG5cdFx0XHRsZXQgdGFyZ2V0ID0gYnVpbGQubWFuaWZlc3QubmFtZTtcblxuXHRcdFx0bGV0IGluZm8gPSBPYmplY3QuYXNzaWduKHt9LCBpbmZvcm1hdGlvbiwgeyB2ZXJzaW9uLCB0YXJnZXQgfSk7XG5cdFx0XHRsZXQgZnJhZ21lbnRzID0gWycvKiohJ107XG5cblx0XHRcdGxldCBjb21tZW50ID0gT2JqZWN0LmtleXMoaW5mbykucmVkdWNlKChyZXN1bHRzLCBmcmFnbWVudE5hbWUpID0+IHtcblx0XHRcdFx0bGV0IG5hbWUgPSBgJHtmcmFnbWVudE5hbWVbMF0udG9VcHBlckNhc2UoKX0ke2ZyYWdtZW50TmFtZS5zbGljZSgxKX1gO1xuXHRcdFx0XHRsZXQgdmFsdWUgPSBpbmZvW2ZyYWdtZW50TmFtZV07XG5cdFx0XHRcdHJlc3VsdHMucHVzaChgICogJHtuYW1lfTogJHt2YWx1ZX1gKTtcblx0XHRcdFx0cmV0dXJuIHJlc3VsdHM7XG5cdFx0XHR9LCBmcmFnbWVudHMpLmNvbmNhdChbJyoqLyddKS5qb2luKCdcXG4nKTtcblxuXHRcdFx0bGV0IHJlc3VsdHMgPSBidWlsZC5yZXN1bHRzW3RhcmdldF07XG5cblx0XHRcdGZvciAobGV0IHJlc3VsdE5hbWUgb2YgT2JqZWN0LmtleXMocmVzdWx0cykpIHtcblx0XHRcdFx0bGV0IHJlc3VsdCA9IHJlc3VsdHNbcmVzdWx0TmFtZV07XG5cdFx0XHRcdGxldCBjb250ZW50cyA9IGAke2NvbW1lbnR9XFxuJHtyZXN1bHQuYnVmZmVyLnRvU3RyaW5nKCd1dGYtOCcpfWA7XG5cdFx0XHRcdGxldCBleHQgPSByZXN1bHQub3V0O1xuXHRcdFx0XHRsZXQgZmlsZU5hbWUgPSByZXNvbHZlKGJ1aWxkRGlyZWN0b3J5LCBbYnVpbGQubWFuaWZlc3QubmFtZSwgZXh0XS5qb2luKCcuJykpO1xuXHRcdFx0XHRhcHBsaWNhdGlvbi5sb2cuaW5mbyhgW2NvbnNvbGU6cnVuXSBXcml0aW5nIFwiJHtyZXN1bHROYW1lfVwiIGZvciBjb25maWd1cmF0aW9uIFwiJHtidWlsZC5tYW5pZmVzdC5uYW1lfVwiIHRvICR7ZmlsZU5hbWV9IC4uLmApO1xuXHRcdFx0XHR3cml0ZXMucHVzaChxZnMud3JpdGUoZmlsZU5hbWUsIGNvbnRlbnRzKSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0YXdhaXQgUHJvbWlzZS5hbGwod3JpdGVzKTtcblx0fVxuXG5cdGlmIChidWlsZENvbmZpZy50YXNrcy5zdGF0aWMpIHtcblx0XHQvLyBDb3B5IHN0YXRpYyBmaWxlc1xuXHRcdGlmIChhd2FpdCBxZnMuZXhpc3RzKHN0YXRpY1Jvb3QpKSB7XG5cdFx0XHRhcHBsaWNhdGlvbi5sb2cuaW5mbyhgW2NvbnNvbGU6cnVuXSBDb3B5IGFzc2V0IGZpbGVzIGZyb20gXCIke2Fzc2V0Um9vdH1cIiB0byAke3BhdHRlcm5CdWlsZERpcmVjdG9yeX0gLi4uYCk7XG5cdFx0XHRhd2FpdCBxZnMubWFrZVRyZWUocmVzb2x2ZShwYXR0ZXJuQnVpbGREaXJlY3RvcnksICdzdGF0aWMnKSk7XG5cdFx0XHRhd2FpdCBxZnMuY29weVRyZWUoc3RhdGljUm9vdCwgcmVzb2x2ZShwYXR0ZXJuQnVpbGREaXJlY3RvcnksICdzdGF0aWMnKSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGFwcGxpY2F0aW9uLmxvZy5pbmZvKGBbY29uc29sZTpydW5dIE5vIGFzc2V0IGZpbGVzIGF0IFwiJHthc3NldFJvb3R9XCJgKTtcblx0XHR9XG5cdH1cblxuXHRsZXQgYXJjaGl2ZSA9IGFyY2hpdmVyKCd6aXAnKTtcblx0bGV0IG91dHB1dCA9IGNyZWF0ZVdyaXRlU3RyZWFtKGAke2J1aWxkRGlyZWN0b3J5fS56aXBgKTtcblxuXHRhcmNoaXZlLnBpcGUob3V0cHV0KTtcblx0YXJjaGl2ZS5kaXJlY3RvcnkoYnVpbGREaXJlY3RvcnksIGZhbHNlKTtcblx0YXJjaGl2ZS5maW5hbGl6ZSgpO1xuXG5cdHJldHVybiBuZXcgUHJvbWlzZSgoZnVsZmlsbCwgcmVqZWN0KSA9PiB7XG5cdFx0b3V0cHV0Lm9uKCdjbG9zZScsIGZ1bGZpbGwpO1xuXHRcdGFyY2hpdmUub24oJ2Vycm9yJywgcmVqZWN0KTtcblx0fSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGJ1aWxkO1xuIl19