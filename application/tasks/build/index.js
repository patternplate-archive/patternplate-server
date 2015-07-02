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
	var patternHook, patternRoot, staticRoot, assetRoot, buildConfig, patterns, transforms, patternConfig, built, environment, mode, revision, branch, tag, version, information, buildRoot, buildDirectory, patternBuildDirectory, environments, builds, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _environment, pattern, writes, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _loop, _iterator2, _step2, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, patternList, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, patternItem, patternResultDirectory, patternSnippetsDirectory, metaData, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, resultEnvironmentName, resultEnvironment, environmentConfig, _iteratorNormalCompletion7, _didIteratorError7, _iteratorError7, _iterator7, _step7, resultName, result, variants, _iteratorNormalCompletion8, _didIteratorError8, _iteratorError8, _iterator8, _step8, variant, fragments, resultFileBaseName, resultFile, mainBuffer, mainName, mainFileBaseName, mainFile, templateData, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, environmentName, _environment2, envConfig, wrapper, blueprint, _iteratorNormalCompletion9, _didIteratorError9, _iteratorError9, _iterator9, _step9, resultType, templateKey, content, uri, templateSectionData, rendered, archive, output;

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

				if (!buildConfig.tasks.bundles) {
					context$1$0.next = 88;
					break;
				}

				context$1$0.next = 28;
				return regeneratorRuntime.awrap(_qIoFs2['default'].listTree((0, _path.resolve)(patternRoot, '@environments')));

			case 28:
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
				context$1$0.prev = 34;
				_iterator = environments[Symbol.iterator]();

			case 36:
				if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
					context$1$0.next = 49;
					break;
				}

				_environment = _step.value;
				context$1$0.next = 40;
				return regeneratorRuntime.awrap(application.pattern.factory(_qIoFs2['default'].relativeFromDirectory(patternRoot, _environment), patternRoot, patternConfig, application.transforms));

			case 40:
				pattern = context$1$0.sent;
				context$1$0.next = 43;
				return regeneratorRuntime.awrap(pattern.read());

			case 43:
				context$1$0.next = 45;
				return regeneratorRuntime.awrap(pattern.transform(false, true));

			case 45:

				builds.push(pattern);

			case 46:
				_iteratorNormalCompletion = true;
				context$1$0.next = 36;
				break;

			case 49:
				context$1$0.next = 55;
				break;

			case 51:
				context$1$0.prev = 51;
				context$1$0.t0 = context$1$0['catch'](34);
				_didIteratorError = true;
				_iteratorError = context$1$0.t0;

			case 55:
				context$1$0.prev = 55;
				context$1$0.prev = 56;

				if (!_iteratorNormalCompletion && _iterator['return']) {
					_iterator['return']();
				}

			case 58:
				context$1$0.prev = 58;

				if (!_didIteratorError) {
					context$1$0.next = 61;
					break;
				}

				throw _iteratorError;

			case 61:
				return context$1$0.finish(58);

			case 62:
				return context$1$0.finish(55);

			case 63:
				context$1$0.next = 65;
				return regeneratorRuntime.awrap(_qIoFs2['default'].makeTree(patternBuildDirectory));

			case 65:
				writes = [];
				_iteratorNormalCompletion2 = true;
				_didIteratorError2 = false;
				_iteratorError2 = undefined;
				context$1$0.prev = 69;

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

					_iteratorNormalCompletion3 = true;
					_didIteratorError3 = false;
					_iteratorError3 = undefined;

					try {
						for (_iterator3 = Object.keys(results)[Symbol.iterator](); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
							var resultName = _step3.value;

							var result = results[resultName];
							var contents = comment + '\n' + result.buffer.toString('utf-8');
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

				context$1$0.next = 78;
				break;

			case 74:
				context$1$0.prev = 74;
				context$1$0.t1 = context$1$0['catch'](69);
				_didIteratorError2 = true;
				_iteratorError2 = context$1$0.t1;

			case 78:
				context$1$0.prev = 78;
				context$1$0.prev = 79;

				if (!_iteratorNormalCompletion2 && _iterator2['return']) {
					_iterator2['return']();
				}

			case 81:
				context$1$0.prev = 81;

				if (!_didIteratorError2) {
					context$1$0.next = 84;
					break;
				}

				throw _iteratorError2;

			case 84:
				return context$1$0.finish(81);

			case 85:
				return context$1$0.finish(78);

			case 86:
				context$1$0.next = 88;
				return regeneratorRuntime.awrap(Promise.all(writes));

			case 88:
				if (!buildConfig.tasks['static']) {
					context$1$0.next = 98;
					break;
				}

				context$1$0.next = 91;
				return regeneratorRuntime.awrap(_qIoFs2['default'].exists(staticRoot));

			case 91:
				if (!context$1$0.sent) {
					context$1$0.next = 97;
					break;
				}

				application.log.info('[console:run] Copy asset files from "' + assetRoot + '" to ' + patternBuildDirectory + ' ...');
				context$1$0.next = 95;
				return regeneratorRuntime.awrap(_qIoFs2['default'].copyTree(staticRoot, (0, _path.resolve)(patternBuildDirectory, 'static')));

			case 95:
				context$1$0.next = 98;
				break;

			case 97:
				application.log.info('[console:run] No asset files at "' + assetRoot + '"');

			case 98:
				if (!buildConfig.tasks.patterns) {
					context$1$0.next = 292;
					break;
				}

				context$1$0.next = 101;
				return regeneratorRuntime.awrap(_qIoFs2['default'].exists(assetRoot));

			case 101:
				if (!context$1$0.sent) {
					context$1$0.next = 107;
					break;
				}

				application.log.info('[console:run] Copy static files from "' + staticRoot + '" to ' + buildDirectory + ' ...');
				context$1$0.next = 105;
				return regeneratorRuntime.awrap(_qIoFs2['default'].copyTree(assetRoot, (0, _path.resolve)(patternBuildDirectory, '_assets')));

			case 105:
				context$1$0.next = 108;
				break;

			case 107:
				application.log.info('[console:run] No static files at "' + staticRoot + '"');

			case 108:
				context$1$0.next = 110;
				return regeneratorRuntime.awrap((0, _libraryUtilitiesGetPatterns2['default'])({
					'id': '.',
					'base': patternRoot,
					'config': patternConfig,
					'factory': application.pattern.factory,
					'transforms': application.transforms,
					'filters': {}
				}));

			case 110:
				patternList = context$1$0.sent;
				_iteratorNormalCompletion4 = true;
				_didIteratorError4 = false;
				_iteratorError4 = undefined;
				context$1$0.prev = 114;
				_iterator4 = patternList[Symbol.iterator]();

			case 116:
				if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
					context$1$0.next = 278;
					break;
				}

				patternItem = _step4.value;
				patternResultDirectory = (0, _path.resolve)(patternBuildDirectory, patternItem.id);
				patternSnippetsDirectory = (0, _path.resolve)(patternResultDirectory, 'snippets');
				context$1$0.next = 122;
				return regeneratorRuntime.awrap(_qIoFs2['default'].makeTree(patternResultDirectory));

			case 122:
				context$1$0.next = 124;
				return regeneratorRuntime.awrap(_qIoFs2['default'].makeTree(patternSnippetsDirectory));

			case 124:
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
				context$1$0.prev = 128;
				_iterator5 = Object.keys(patternItem.results)[Symbol.iterator]();

			case 130:
				if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
					context$1$0.next = 206;
					break;
				}

				resultEnvironmentName = _step5.value;
				resultEnvironment = patternItem.results[resultEnvironmentName];
				environmentConfig = patternItem.environments[resultEnvironmentName].manifest;

				metaData.results[resultEnvironmentName] = {};

				_iteratorNormalCompletion7 = true;
				_didIteratorError7 = false;
				_iteratorError7 = undefined;
				context$1$0.prev = 138;
				_iterator7 = Object.keys(resultEnvironment)[Symbol.iterator]();

			case 140:
				if (_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done) {
					context$1$0.next = 189;
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
				context$1$0.prev = 149;
				_iterator8 = variants[Symbol.iterator]();

			case 151:
				if (_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done) {
					context$1$0.next = 163;
					break;
				}

				variant = _step8.value;
				fragments = [resultName.toLowerCase(), !environmentConfig.formats || environmentConfig.formats.includes(result['in']) ? resultEnvironmentName : '', variants.length > 1 ? variant.name : ''];

				fragments = fragments.filter(function (item) {
					return item;
				});

				resultFileBaseName = fragments.join('-') + '.' + result.out;
				resultFile = (0, _path.resolve)(patternSnippetsDirectory, resultFileBaseName);
				context$1$0.next = 159;
				return regeneratorRuntime.awrap(_qIoFs2['default'].write(resultFile, variant.buffer));

			case 159:
				metaData.results[resultEnvironmentName][resultName][variant.name || 'library'] = _qIoFs2['default'].relativeFromDirectory(patternResultDirectory, resultFile);

			case 160:
				_iteratorNormalCompletion8 = true;
				context$1$0.next = 151;
				break;

			case 163:
				context$1$0.next = 169;
				break;

			case 165:
				context$1$0.prev = 165;
				context$1$0.t2 = context$1$0['catch'](149);
				_didIteratorError8 = true;
				_iteratorError8 = context$1$0.t2;

			case 169:
				context$1$0.prev = 169;
				context$1$0.prev = 170;

				if (!_iteratorNormalCompletion8 && _iterator8['return']) {
					_iterator8['return']();
				}

			case 172:
				context$1$0.prev = 172;

				if (!_didIteratorError8) {
					context$1$0.next = 175;
					break;
				}

				throw _iteratorError8;

			case 175:
				return context$1$0.finish(172);

			case 176:
				return context$1$0.finish(169);

			case 177:
				mainBuffer = result.demoBuffer || result.buffer;
				mainName = resultName.toLowerCase();

				if (!(mainName === 'markup')) {
					context$1$0.next = 181;
					break;
				}

				return context$1$0.abrupt('continue', 186);

			case 181:

				// TODO: resolve this
				mainName = mainName === 'documentation' ? mainName : resultEnvironmentName;

				mainFileBaseName = mainName + '.' + result.out;
				mainFile = (0, _path.resolve)(patternResultDirectory, mainFileBaseName);
				context$1$0.next = 186;
				return regeneratorRuntime.awrap(_qIoFs2['default'].write(mainFile, mainBuffer));

			case 186:
				_iteratorNormalCompletion7 = true;
				context$1$0.next = 140;
				break;

			case 189:
				context$1$0.next = 195;
				break;

			case 191:
				context$1$0.prev = 191;
				context$1$0.t3 = context$1$0['catch'](138);
				_didIteratorError7 = true;
				_iteratorError7 = context$1$0.t3;

			case 195:
				context$1$0.prev = 195;
				context$1$0.prev = 196;

				if (!_iteratorNormalCompletion7 && _iterator7['return']) {
					_iterator7['return']();
				}

			case 198:
				context$1$0.prev = 198;

				if (!_didIteratorError7) {
					context$1$0.next = 201;
					break;
				}

				throw _iteratorError7;

			case 201:
				return context$1$0.finish(198);

			case 202:
				return context$1$0.finish(195);

			case 203:
				_iteratorNormalCompletion5 = true;
				context$1$0.next = 130;
				break;

			case 206:
				context$1$0.next = 212;
				break;

			case 208:
				context$1$0.prev = 208;
				context$1$0.t4 = context$1$0['catch'](128);
				_didIteratorError5 = true;
				_iteratorError5 = context$1$0.t4;

			case 212:
				context$1$0.prev = 212;
				context$1$0.prev = 213;

				if (!_iteratorNormalCompletion5 && _iterator5['return']) {
					_iterator5['return']();
				}

			case 215:
				context$1$0.prev = 215;

				if (!_didIteratorError5) {
					context$1$0.next = 218;
					break;
				}

				throw _iteratorError5;

			case 218:
				return context$1$0.finish(215);

			case 219:
				return context$1$0.finish(212);

			case 220:
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
				context$1$0.prev = 224;
				_iterator6 = Object.keys(patternItem.results)[Symbol.iterator]();

			case 226:
				if (_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done) {
					context$1$0.next = 254;
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
				context$1$0.prev = 235;

				for (_iterator9 = Object.keys(_environment2)[Symbol.iterator](); !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
					resultType = _step9.value;
					result = _environment2[resultType];
					templateKey = resultType.toLowerCase();
					content = result.demoBuffer || result.buffer;
					uri = patternItem.id + '/' + environmentName + '.' + result.out;
					templateSectionData = Object.assign({}, blueprint, { content: content, uri: uri });

					templateData[templateKey] = Array.isArray(templateData[templateKey]) ? templateData[templateKey].concat([templateSectionData]) : [templateSectionData];
				}
				context$1$0.next = 243;
				break;

			case 239:
				context$1$0.prev = 239;
				context$1$0.t5 = context$1$0['catch'](235);
				_didIteratorError9 = true;
				_iteratorError9 = context$1$0.t5;

			case 243:
				context$1$0.prev = 243;
				context$1$0.prev = 244;

				if (!_iteratorNormalCompletion9 && _iterator9['return']) {
					_iterator9['return']();
				}

			case 246:
				context$1$0.prev = 246;

				if (!_didIteratorError9) {
					context$1$0.next = 249;
					break;
				}

				throw _iteratorError9;

			case 249:
				return context$1$0.finish(246);

			case 250:
				return context$1$0.finish(243);

			case 251:
				_iteratorNormalCompletion6 = true;
				context$1$0.next = 226;
				break;

			case 254:
				context$1$0.next = 260;
				break;

			case 256:
				context$1$0.prev = 256;
				context$1$0.t6 = context$1$0['catch'](224);
				_didIteratorError6 = true;
				_iteratorError6 = context$1$0.t6;

			case 260:
				context$1$0.prev = 260;
				context$1$0.prev = 261;

				if (!_iteratorNormalCompletion6 && _iterator6['return']) {
					_iterator6['return']();
				}

			case 263:
				context$1$0.prev = 263;

				if (!_didIteratorError6) {
					context$1$0.next = 266;
					break;
				}

				throw _iteratorError6;

			case 266:
				return context$1$0.finish(263);

			case 267:
				return context$1$0.finish(260);

			case 268:
				rendered = (0, _layouts2['default'])(templateData);
				context$1$0.next = 271;
				return regeneratorRuntime.awrap(_qIoFs2['default'].write((0, _path.resolve)(patternResultDirectory, 'index.html'), rendered));

			case 271:
				context$1$0.next = 273;
				return regeneratorRuntime.awrap(_qIoFs2['default'].write((0, _path.resolve)(patternResultDirectory, 'build.json'), JSON.stringify(patternItem, null, '  ')));

			case 273:
				context$1$0.next = 275;
				return regeneratorRuntime.awrap(_qIoFs2['default'].write((0, _path.resolve)(patternResultDirectory, 'pattern.json'), JSON.stringify(metaData, null, '  ')));

			case 275:
				_iteratorNormalCompletion4 = true;
				context$1$0.next = 116;
				break;

			case 278:
				context$1$0.next = 284;
				break;

			case 280:
				context$1$0.prev = 280;
				context$1$0.t7 = context$1$0['catch'](114);
				_didIteratorError4 = true;
				_iteratorError4 = context$1$0.t7;

			case 284:
				context$1$0.prev = 284;
				context$1$0.prev = 285;

				if (!_iteratorNormalCompletion4 && _iterator4['return']) {
					_iterator4['return']();
				}

			case 287:
				context$1$0.prev = 287;

				if (!_didIteratorError4) {
					context$1$0.next = 290;
					break;
				}

				throw _iteratorError4;

			case 290:
				return context$1$0.finish(287);

			case 291:
				return context$1$0.finish(284);

			case 292:
				archive = (0, _archiver2['default'])('zip');
				output = (0, _fs.createWriteStream)(buildDirectory + '.zip');

				archive.pipe(output);
				archive.directory(buildDirectory, false);
				archive.finalize();

				return context$1$0.abrupt('return', new Promise(function (fulfill, reject) {
					output.on('close', fulfill);
					archive.on('error', reject);
				}));

			case 298:
			case 'end':
				return context$1$0.stop();
		}
	}, null, this, [[34, 51, 55, 63], [56,, 58, 62], [69, 74, 78, 86], [79,, 81, 85], [114, 280, 284, 292], [128, 208, 212, 220], [138, 191, 195, 203], [149, 165, 169, 177], [170,, 172, 176], [196,, 198, 202], [213,, 215, 219], [224, 256, 260, 268], [235, 239, 243, 251], [244,, 246, 250], [261,, 263, 267], [285,, 287, 291]]);
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