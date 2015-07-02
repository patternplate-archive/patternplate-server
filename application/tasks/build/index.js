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
	var patternHook, patternRoot, staticRoot, assetRoot, buildConfig, patterns, transforms, patternConfig, built, environment, mode, revision, branch, tag, version, information, buildRoot, buildDirectory, patternBuildDirectory, environments, builds, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _environment, pattern, writes, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _loop, _iterator2, _step2, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, patternList, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, patternItem, patternResultDirectory, patternSnippetsDirectory, metaData, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, resultEnvironmentName, resultEnvironment, environmentConfig, _iteratorNormalCompletion7, _didIteratorError7, _iteratorError7, _iterator7, _step7, resultName, result, variants, _iteratorNormalCompletion8, _didIteratorError8, _iteratorError8, _iterator8, _step8, variant, fragments, resultFileBaseName, resultFile, mainBuffer, mainName, mainFileBaseName, mainFile, templateData, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, environmentName, _environment2, envConfig, wrapper, blueprint, _iteratorNormalCompletion9, _didIteratorError9, _iteratorError9, _iterator9, _step9, resultType, templateKey, content, uri, templateSectionData, rendered, archive, output;

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
				context$1$0.next = 27;
				return regeneratorRuntime.awrap(_qIoFs2['default'].listTree((0, _path.resolve)(patternRoot, '@environments')));

			case 27:
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
				context$1$0.prev = 33;
				_iterator = environments[Symbol.iterator]();

			case 35:
				if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
					context$1$0.next = 48;
					break;
				}

				_environment = _step.value;
				context$1$0.next = 39;
				return regeneratorRuntime.awrap(application.pattern.factory(_qIoFs2['default'].relativeFromDirectory(patternRoot, _environment), patternRoot, patternConfig, application.transforms));

			case 39:
				pattern = context$1$0.sent;
				context$1$0.next = 42;
				return regeneratorRuntime.awrap(pattern.read());

			case 42:
				context$1$0.next = 44;
				return regeneratorRuntime.awrap(pattern.transform(false, true));

			case 44:

				builds.push(pattern);

			case 45:
				_iteratorNormalCompletion = true;
				context$1$0.next = 35;
				break;

			case 48:
				context$1$0.next = 54;
				break;

			case 50:
				context$1$0.prev = 50;
				context$1$0.t0 = context$1$0['catch'](33);
				_didIteratorError = true;
				_iteratorError = context$1$0.t0;

			case 54:
				context$1$0.prev = 54;
				context$1$0.prev = 55;

				if (!_iteratorNormalCompletion && _iterator['return']) {
					_iterator['return']();
				}

			case 57:
				context$1$0.prev = 57;

				if (!_didIteratorError) {
					context$1$0.next = 60;
					break;
				}

				throw _iteratorError;

			case 60:
				return context$1$0.finish(57);

			case 61:
				return context$1$0.finish(54);

			case 62:
				context$1$0.next = 64;
				return regeneratorRuntime.awrap(_qIoFs2['default'].makeTree(patternBuildDirectory));

			case 64:
				writes = [];
				_iteratorNormalCompletion2 = true;
				_didIteratorError2 = false;
				_iteratorError2 = undefined;
				context$1$0.prev = 68;

				_loop = function () {
					var build = _step2.value;

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

					_iteratorNormalCompletion4 = true;
					_didIteratorError4 = false;
					_iteratorError4 = undefined;

					try {
						for (_iterator4 = Object.keys(results)[Symbol.iterator](); !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
							var resultName = _step4.value;

							var result = results[resultName];
							var contents = comment + '\n' + result.buffer.toString('utf-8');
							var ext = result.out;
							var fileName = (0, _path.resolve)(buildDirectory, [build.manifest.name, ext].join('.'));
							application.log.info('[console:run] Writing "' + resultName + '" for configuration "' + build.manifest.name + '" to ' + fileName + ' ...');
							writes.push(_qIoFs2['default'].write(fileName, contents));
						}
					} catch (err) {
						_didIteratorError4 = true;
						_iteratorError4 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion4 && _iterator4['return']) {
								_iterator4['return']();
							}
						} finally {
							if (_didIteratorError4) {
								throw _iteratorError4;
							}
						}
					}
				};

				for (_iterator2 = builds[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					_loop();
				}

				context$1$0.next = 77;
				break;

			case 73:
				context$1$0.prev = 73;
				context$1$0.t1 = context$1$0['catch'](68);
				_didIteratorError2 = true;
				_iteratorError2 = context$1$0.t1;

			case 77:
				context$1$0.prev = 77;
				context$1$0.prev = 78;

				if (!_iteratorNormalCompletion2 && _iterator2['return']) {
					_iterator2['return']();
				}

			case 80:
				context$1$0.prev = 80;

				if (!_didIteratorError2) {
					context$1$0.next = 83;
					break;
				}

				throw _iteratorError2;

			case 83:
				return context$1$0.finish(80);

			case 84:
				return context$1$0.finish(77);

			case 85:
				context$1$0.next = 87;
				return regeneratorRuntime.awrap(Promise.all(writes));

			case 87:
				context$1$0.next = 89;
				return regeneratorRuntime.awrap(_qIoFs2['default'].exists(assetRoot));

			case 89:
				if (!context$1$0.sent) {
					context$1$0.next = 95;
					break;
				}

				application.log.info('[console:run] Copy static files from "' + staticRoot + '" to ' + buildDirectory + ' ...');
				context$1$0.next = 93;
				return regeneratorRuntime.awrap(_qIoFs2['default'].copyTree(assetRoot, (0, _path.resolve)(patternBuildDirectory, '_assets')));

			case 93:
				context$1$0.next = 96;
				break;

			case 95:
				application.log.info('[console:run] No static files at "' + staticRoot + '"');

			case 96:
				context$1$0.next = 98;
				return regeneratorRuntime.awrap(_qIoFs2['default'].exists(staticRoot));

			case 98:
				if (!context$1$0.sent) {
					context$1$0.next = 104;
					break;
				}

				application.log.info('[console:run] Copy asset files from "' + assetRoot + '" to ' + patternBuildDirectory + ' ...');
				context$1$0.next = 102;
				return regeneratorRuntime.awrap(_qIoFs2['default'].copyTree(staticRoot, (0, _path.resolve)(patternBuildDirectory, 'static')));

			case 102:
				context$1$0.next = 105;
				break;

			case 104:
				application.log.info('[console:run] No asset files at "' + assetRoot + '"');

			case 105:
				context$1$0.next = 107;
				return regeneratorRuntime.awrap((0, _libraryUtilitiesGetPatterns2['default'])({
					'id': '.',
					'base': patternRoot,
					'config': patternConfig,
					'factory': application.pattern.factory,
					'transforms': application.transforms,
					'filters': {}
				}));

			case 107:
				patternList = context$1$0.sent;
				_iteratorNormalCompletion3 = true;
				_didIteratorError3 = false;
				_iteratorError3 = undefined;
				context$1$0.prev = 111;
				_iterator3 = patternList[Symbol.iterator]();

			case 113:
				if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
					context$1$0.next = 275;
					break;
				}

				patternItem = _step3.value;
				patternResultDirectory = (0, _path.resolve)(patternBuildDirectory, patternItem.id);
				patternSnippetsDirectory = (0, _path.resolve)(patternResultDirectory, 'snippets');
				context$1$0.next = 119;
				return regeneratorRuntime.awrap(_qIoFs2['default'].makeTree(patternResultDirectory));

			case 119:
				context$1$0.next = 121;
				return regeneratorRuntime.awrap(_qIoFs2['default'].makeTree(patternSnippetsDirectory));

			case 121:
				metaData = Object.assign({}, patternItem.manifest, {
					'build': {
						'date': built,
						environment: environment, mode: mode, revision: revision,
						tag: tag, version: version
					},
					'results': {}
				});
				_iteratorNormalCompletion5 = true;
				_didIteratorError5 = false;
				_iteratorError5 = undefined;
				context$1$0.prev = 125;
				_iterator5 = Object.keys(patternItem.results)[Symbol.iterator]();

			case 127:
				if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
					context$1$0.next = 203;
					break;
				}

				resultEnvironmentName = _step5.value;
				resultEnvironment = patternItem.results[resultEnvironmentName];
				environmentConfig = patternItem.environments[resultEnvironmentName].manifest;

				metaData.results[resultEnvironmentName] = {};

				_iteratorNormalCompletion7 = true;
				_didIteratorError7 = false;
				_iteratorError7 = undefined;
				context$1$0.prev = 135;
				_iterator7 = Object.keys(resultEnvironment)[Symbol.iterator]();

			case 137:
				if (_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done) {
					context$1$0.next = 186;
					break;
				}

				resultName = _step7.value;
				result = resultEnvironment[resultName];

				metaData.results[resultEnvironmentName][resultName] = {};

				variants = [{ 'name': 'demo', 'buffer': result.demoBuffer }, { 'name': '', 'buffer': result.buffer }];

				variants = variants.filter(function (item) {
					return item.buffer.length > 0;
				});

				_iteratorNormalCompletion8 = true;
				_didIteratorError8 = false;
				_iteratorError8 = undefined;
				context$1$0.prev = 146;
				_iterator8 = variants[Symbol.iterator]();

			case 148:
				if (_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done) {
					context$1$0.next = 160;
					break;
				}

				variant = _step8.value;
				fragments = [resultName.toLowerCase(), !environmentConfig.formats || environmentConfig.formats.includes(result['in']) ? resultEnvironmentName : '', variants.length > 1 ? variant.name : ''];

				fragments = fragments.filter(function (item) {
					return item;
				});

				resultFileBaseName = fragments.join('-') + '.' + result.out;
				resultFile = (0, _path.resolve)(patternSnippetsDirectory, resultFileBaseName);
				context$1$0.next = 156;
				return regeneratorRuntime.awrap(_qIoFs2['default'].write(resultFile, variant.buffer));

			case 156:
				metaData.results[resultEnvironmentName][resultName][variant.name || 'library'] = _qIoFs2['default'].relativeFromDirectory(patternResultDirectory, resultFile);

			case 157:
				_iteratorNormalCompletion8 = true;
				context$1$0.next = 148;
				break;

			case 160:
				context$1$0.next = 166;
				break;

			case 162:
				context$1$0.prev = 162;
				context$1$0.t2 = context$1$0['catch'](146);
				_didIteratorError8 = true;
				_iteratorError8 = context$1$0.t2;

			case 166:
				context$1$0.prev = 166;
				context$1$0.prev = 167;

				if (!_iteratorNormalCompletion8 && _iterator8['return']) {
					_iterator8['return']();
				}

			case 169:
				context$1$0.prev = 169;

				if (!_didIteratorError8) {
					context$1$0.next = 172;
					break;
				}

				throw _iteratorError8;

			case 172:
				return context$1$0.finish(169);

			case 173:
				return context$1$0.finish(166);

			case 174:
				mainBuffer = result.demoBuffer || result.buffer;
				mainName = resultName.toLowerCase();

				if (!(mainName === 'markup')) {
					context$1$0.next = 178;
					break;
				}

				return context$1$0.abrupt('continue', 183);

			case 178:

				// TODO: resolve this
				mainName = mainName === 'documentation' ? mainName : resultEnvironmentName;

				mainFileBaseName = mainName + '.' + result.out;
				mainFile = (0, _path.resolve)(patternResultDirectory, mainFileBaseName);
				context$1$0.next = 183;
				return regeneratorRuntime.awrap(_qIoFs2['default'].write(mainFile, mainBuffer));

			case 183:
				_iteratorNormalCompletion7 = true;
				context$1$0.next = 137;
				break;

			case 186:
				context$1$0.next = 192;
				break;

			case 188:
				context$1$0.prev = 188;
				context$1$0.t3 = context$1$0['catch'](135);
				_didIteratorError7 = true;
				_iteratorError7 = context$1$0.t3;

			case 192:
				context$1$0.prev = 192;
				context$1$0.prev = 193;

				if (!_iteratorNormalCompletion7 && _iterator7['return']) {
					_iterator7['return']();
				}

			case 195:
				context$1$0.prev = 195;

				if (!_didIteratorError7) {
					context$1$0.next = 198;
					break;
				}

				throw _iteratorError7;

			case 198:
				return context$1$0.finish(195);

			case 199:
				return context$1$0.finish(192);

			case 200:
				_iteratorNormalCompletion5 = true;
				context$1$0.next = 127;
				break;

			case 203:
				context$1$0.next = 209;
				break;

			case 205:
				context$1$0.prev = 205;
				context$1$0.t4 = context$1$0['catch'](125);
				_didIteratorError5 = true;
				_iteratorError5 = context$1$0.t4;

			case 209:
				context$1$0.prev = 209;
				context$1$0.prev = 210;

				if (!_iteratorNormalCompletion5 && _iterator5['return']) {
					_iterator5['return']();
				}

			case 212:
				context$1$0.prev = 212;

				if (!_didIteratorError5) {
					context$1$0.next = 215;
					break;
				}

				throw _iteratorError5;

			case 215:
				return context$1$0.finish(212);

			case 216:
				return context$1$0.finish(209);

			case 217:
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
				_iteratorNormalCompletion6 = true;
				_didIteratorError6 = false;
				_iteratorError6 = undefined;
				context$1$0.prev = 221;
				_iterator6 = Object.keys(patternItem.results)[Symbol.iterator]();

			case 223:
				if (_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done) {
					context$1$0.next = 251;
					break;
				}

				environmentName = _step6.value;
				_environment2 = patternItem.results[environmentName];
				envConfig = patternItem.environments[environmentName].manifest || {};
				wrapper = (0, _libraryUtilitiesGetWrapper2['default'])(envConfig['conditional-comment']);
				blueprint = { 'environment': environmentName, 'content': '', wrapper: wrapper };
				_iteratorNormalCompletion9 = true;
				_didIteratorError9 = false;
				_iteratorError9 = undefined;
				context$1$0.prev = 232;

				for (_iterator9 = Object.keys(_environment2)[Symbol.iterator](); !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
					resultType = _step9.value;
					result = _environment2[resultType];
					templateKey = resultType.toLowerCase();
					content = result.demoBuffer || result.buffer;
					uri = patternItem.id + '/' + environmentName + '.' + result.out;
					templateSectionData = Object.assign({}, blueprint, { content: content, uri: uri });

					templateData[templateKey] = Array.isArray(templateData[templateKey]) ? templateData[templateKey].concat([templateSectionData]) : [templateSectionData];
				}
				context$1$0.next = 240;
				break;

			case 236:
				context$1$0.prev = 236;
				context$1$0.t5 = context$1$0['catch'](232);
				_didIteratorError9 = true;
				_iteratorError9 = context$1$0.t5;

			case 240:
				context$1$0.prev = 240;
				context$1$0.prev = 241;

				if (!_iteratorNormalCompletion9 && _iterator9['return']) {
					_iterator9['return']();
				}

			case 243:
				context$1$0.prev = 243;

				if (!_didIteratorError9) {
					context$1$0.next = 246;
					break;
				}

				throw _iteratorError9;

			case 246:
				return context$1$0.finish(243);

			case 247:
				return context$1$0.finish(240);

			case 248:
				_iteratorNormalCompletion6 = true;
				context$1$0.next = 223;
				break;

			case 251:
				context$1$0.next = 257;
				break;

			case 253:
				context$1$0.prev = 253;
				context$1$0.t6 = context$1$0['catch'](221);
				_didIteratorError6 = true;
				_iteratorError6 = context$1$0.t6;

			case 257:
				context$1$0.prev = 257;
				context$1$0.prev = 258;

				if (!_iteratorNormalCompletion6 && _iterator6['return']) {
					_iterator6['return']();
				}

			case 260:
				context$1$0.prev = 260;

				if (!_didIteratorError6) {
					context$1$0.next = 263;
					break;
				}

				throw _iteratorError6;

			case 263:
				return context$1$0.finish(260);

			case 264:
				return context$1$0.finish(257);

			case 265:
				rendered = (0, _layouts2['default'])(templateData);
				context$1$0.next = 268;
				return regeneratorRuntime.awrap(_qIoFs2['default'].write((0, _path.resolve)(patternResultDirectory, 'index.html'), rendered));

			case 268:
				context$1$0.next = 270;
				return regeneratorRuntime.awrap(_qIoFs2['default'].write((0, _path.resolve)(patternResultDirectory, 'build.json'), JSON.stringify(patternItem, null, '  ')));

			case 270:
				context$1$0.next = 272;
				return regeneratorRuntime.awrap(_qIoFs2['default'].write((0, _path.resolve)(patternResultDirectory, 'pattern.json'), JSON.stringify(metaData, null, '  ')));

			case 272:
				_iteratorNormalCompletion3 = true;
				context$1$0.next = 113;
				break;

			case 275:
				context$1$0.next = 281;
				break;

			case 277:
				context$1$0.prev = 277;
				context$1$0.t7 = context$1$0['catch'](111);
				_didIteratorError3 = true;
				_iteratorError3 = context$1$0.t7;

			case 281:
				context$1$0.prev = 281;
				context$1$0.prev = 282;

				if (!_iteratorNormalCompletion3 && _iterator3['return']) {
					_iterator3['return']();
				}

			case 284:
				context$1$0.prev = 284;

				if (!_didIteratorError3) {
					context$1$0.next = 287;
					break;
				}

				throw _iteratorError3;

			case 287:
				return context$1$0.finish(284);

			case 288:
				return context$1$0.finish(281);

			case 289:
				archive = (0, _archiver2['default'])('zip');
				output = (0, _fs.createWriteStream)(buildDirectory + '.zip');

				archive.pipe(output);
				archive.directory(buildDirectory, false);
				archive.finalize();

				return context$1$0.abrupt('return', new Promise(function (fulfill, reject) {
					output.on('close', fulfill);
					archive.on('error', reject);
				}));

			case 295:
			case 'end':
				return context$1$0.stop();
		}
	}, null, this, [[33, 50, 54, 62], [55,, 57, 61], [68, 73, 77, 85], [78,, 80, 84], [111, 277, 281, 289], [125, 205, 209, 217], [135, 188, 192, 200], [146, 162, 166, 174], [167,, 169, 173], [193,, 195, 199], [210,, 212, 216], [221, 253, 257, 265], [232, 236, 240, 248], [241,, 243, 247], [258,, 260, 264], [282,, 284, 288]]);
}

exports['default'] = build;
module.exports = exports['default'];

// Build environment output

// Copy static files

// Copy assets

// write pattern.json with additional meta data
// Write all variants into snippets

// Write main variant into pattern build folder, render html into layout

// TODO: resolve this

// Render markup into layout, write to index.html

// Write index.html

// Write build.json

// Write augmented pattern.json