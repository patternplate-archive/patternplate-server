'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _fs = require('fs');

var _qIoFs = require('q-io/fs');

var _qIoFs2 = _interopRequireDefault(_qIoFs);

var _lodashMerge = require('lodash.merge');

var _lodashMerge2 = _interopRequireDefault(_lodashMerge);

var _libraryUtilitiesGetPatterns = require('../../../library/utilities/get-patterns');

var _libraryUtilitiesGetPatterns2 = _interopRequireDefault(_libraryUtilitiesGetPatterns);

//import getWrapper from '../../../library/utilities/get-wrapper';

var pkg = require((0, _path.resolve)(process.cwd(), 'package.json'));

function exportAsCommonjs(application, config) {
	var patternHook, patternRoot, staticRoot, assetRoot, commonjsConfig, patterns, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _name, transforms, patternConfig, built, environment, mode, version, information, commonjsRoot, staticCacheDirectory, patternList, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, patternItem, patternResultDirectory, patternSnippetsDirectory, metaData, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, resultEnvironmentName, resultEnvironment, environmentConfig, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, resultName, result, variants, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, variant, fragments, resultFileBaseName, resultFile, mainBuffer, mainName, mainFileBaseName, mainFile, commonjsPkg, environments, builds, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, _environment, pattern, writes, _iteratorNormalCompletion7, _didIteratorError7, _iteratorError7, _loop, _iterator7, _step7, _iteratorNormalCompletion8, _didIteratorError8, _iteratorError8, _iterator8, _step8;

	return regeneratorRuntime.async(function exportAsCommonjs$(context$1$0) {
		while (1) switch (context$1$0.prev = context$1$0.next) {
			case 0:
				patternHook = application.hooks.filter(function (hook) {
					return hook.name === 'patterns';
				})[0];
				patternRoot = (0, _path.resolve)(application.runtime.patterncwd || application.runtime.cwd, patternHook.configuration.path);
				staticRoot = (0, _path.resolve)(application.runtime.patterncwd || application.runtime.cwd, 'static');
				assetRoot = (0, _path.resolve)(application.runtime.cwd, 'assets');
				commonjsConfig = application.configuration.commonjs || {};
				patterns = (0, _lodashMerge2['default'])({}, application.configuration.patterns || {}, commonjsConfig.patterns || {});
				_iteratorNormalCompletion = true;
				_didIteratorError = false;
				_iteratorError = undefined;
				context$1$0.prev = 9;

				// Update formats to the current buildFormats (this is required to e.g. reduce transformers for build)
				for (_iterator = Object.keys(commonjsConfig.patterns.formats)[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					_name = _step.value;

					patterns.formats[_name] = commonjsConfig.patterns.formats[_name];
				}
				context$1$0.next = 17;
				break;

			case 13:
				context$1$0.prev = 13;
				context$1$0.t0 = context$1$0['catch'](9);
				_didIteratorError = true;
				_iteratorError = context$1$0.t0;

			case 17:
				context$1$0.prev = 17;
				context$1$0.prev = 18;

				if (!_iteratorNormalCompletion && _iterator['return']) {
					_iterator['return']();
				}

			case 20:
				context$1$0.prev = 20;

				if (!_didIteratorError) {
					context$1$0.next = 23;
					break;
				}

				throw _iteratorError;

			case 23:
				return context$1$0.finish(20);

			case 24:
				return context$1$0.finish(17);

			case 25:
				transforms = (0, _lodashMerge2['default'])({}, application.configuration.transforms || {}, commonjsConfig.transforms || {});
				patternConfig = { patterns: patterns, transforms: transforms };
				built = new Date();
				environment = application.runtime.env;
				mode = application.runtime.mode;
				version = pkg.version;
				information = { built: built, environment: environment, mode: mode, version: version };
				commonjsRoot = (0, _path.resolve)(application.runtime.patterncwd || application.runtime.cwd, 'distribution');
				staticCacheDirectory = (0, _path.resolve)(application.runtime.patterncwd || application.runtime.cwd, '.cache');

				if (!commonjsConfig.tasks.patterns) {
					context$1$0.next = 180;
					break;
				}

				context$1$0.next = 37;
				return regeneratorRuntime.awrap(_qIoFs2['default'].exists(assetRoot));

			case 37:
				if (!context$1$0.sent) {
					context$1$0.next = 45;
					break;
				}

				application.log.info('[console:run] Copy static files from "' + staticRoot + '" to ' + commonjsRoot + ' ...');
				context$1$0.next = 41;
				return regeneratorRuntime.awrap(_qIoFs2['default'].makeTree((0, _path.resolve)(commonjsRoot, '_assets')));

			case 41:
				context$1$0.next = 43;
				return regeneratorRuntime.awrap(_qIoFs2['default'].copyTree(assetRoot, (0, _path.resolve)(commonjsRoot, '_assets')));

			case 43:
				context$1$0.next = 46;
				break;

			case 45:
				application.log.info('[console:run] No static files at "' + staticRoot + '"');

			case 46:

				if (application.cache) {
					application.cache.config['static'] = false;
				}

				context$1$0.next = 49;
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

			case 49:
				patternList = context$1$0.sent;

				if (application.cache) {
					application.cache.config['static'] = true;
				}

				_iteratorNormalCompletion2 = true;
				_didIteratorError2 = false;
				_iteratorError2 = undefined;
				context$1$0.prev = 54;
				_iterator2 = patternList[Symbol.iterator]();

			case 56:
				if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
					context$1$0.next = 166;
					break;
				}

				patternItem = _step2.value;
				patternResultDirectory = (0, _path.resolve)(commonjsRoot, patternItem.id);
				patternSnippetsDirectory = (0, _path.resolve)(patternResultDirectory, 'snippets');
				context$1$0.next = 62;
				return regeneratorRuntime.awrap(_qIoFs2['default'].makeTree(patternResultDirectory));

			case 62:
				context$1$0.next = 64;
				return regeneratorRuntime.awrap(_qIoFs2['default'].makeTree(patternSnippetsDirectory));

			case 64:
				metaData = Object.assign({}, patternItem.manifest, {
					'build': {
						'date': built,
						environment: environment, mode: mode, version: version
					},
					'results': {}
				});
				_iteratorNormalCompletion3 = true;
				_didIteratorError3 = false;
				_iteratorError3 = undefined;
				context$1$0.prev = 68;
				_iterator3 = Object.keys(patternItem.results)[Symbol.iterator]();

			case 70:
				if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
					context$1$0.next = 146;
					break;
				}

				resultEnvironmentName = _step3.value;
				resultEnvironment = patternItem.results[resultEnvironmentName];
				environmentConfig = patternItem.environments[resultEnvironmentName].manifest;

				metaData.results[resultEnvironmentName] = {};

				_iteratorNormalCompletion4 = true;
				_didIteratorError4 = false;
				_iteratorError4 = undefined;
				context$1$0.prev = 78;
				_iterator4 = Object.keys(resultEnvironment)[Symbol.iterator]();

			case 80:
				if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
					context$1$0.next = 129;
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
				context$1$0.prev = 89;
				_iterator5 = variants[Symbol.iterator]();

			case 91:
				if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
					context$1$0.next = 103;
					break;
				}

				variant = _step5.value;
				fragments = [resultName.toLowerCase(), !environmentConfig.formats || environmentConfig.formats.includes(result['in']) ? resultEnvironmentName : '', variants.length > 1 ? variant.name : ''];

				fragments = fragments.filter(function (item) {
					return item;
				});

				resultFileBaseName = fragments.join('-') + '.' + result.out;
				resultFile = (0, _path.resolve)(patternSnippetsDirectory, resultFileBaseName);
				context$1$0.next = 99;
				return regeneratorRuntime.awrap(_qIoFs2['default'].write(resultFile, variant.buffer));

			case 99:
				metaData.results[resultEnvironmentName][resultName][variant.name || 'library'] = _qIoFs2['default'].relativeFromDirectory(patternResultDirectory, resultFile);

			case 100:
				_iteratorNormalCompletion5 = true;
				context$1$0.next = 91;
				break;

			case 103:
				context$1$0.next = 109;
				break;

			case 105:
				context$1$0.prev = 105;
				context$1$0.t1 = context$1$0['catch'](89);
				_didIteratorError5 = true;
				_iteratorError5 = context$1$0.t1;

			case 109:
				context$1$0.prev = 109;
				context$1$0.prev = 110;

				if (!_iteratorNormalCompletion5 && _iterator5['return']) {
					_iterator5['return']();
				}

			case 112:
				context$1$0.prev = 112;

				if (!_didIteratorError5) {
					context$1$0.next = 115;
					break;
				}

				throw _iteratorError5;

			case 115:
				return context$1$0.finish(112);

			case 116:
				return context$1$0.finish(109);

			case 117:
				mainBuffer = result.demoBuffer || result.buffer;
				mainName = resultName.toLowerCase();

				if (!(mainName === 'markup')) {
					context$1$0.next = 121;
					break;
				}

				return context$1$0.abrupt('continue', 126);

			case 121:

				// TODO: resolve this
				mainName = mainName === 'documentation' ? mainName : resultEnvironmentName;

				mainFileBaseName = mainName + '.' + result.out;
				mainFile = (0, _path.resolve)(patternResultDirectory, mainFileBaseName);
				context$1$0.next = 126;
				return regeneratorRuntime.awrap(_qIoFs2['default'].write(mainFile, mainBuffer));

			case 126:
				_iteratorNormalCompletion4 = true;
				context$1$0.next = 80;
				break;

			case 129:
				context$1$0.next = 135;
				break;

			case 131:
				context$1$0.prev = 131;
				context$1$0.t2 = context$1$0['catch'](78);
				_didIteratorError4 = true;
				_iteratorError4 = context$1$0.t2;

			case 135:
				context$1$0.prev = 135;
				context$1$0.prev = 136;

				if (!_iteratorNormalCompletion4 && _iterator4['return']) {
					_iterator4['return']();
				}

			case 138:
				context$1$0.prev = 138;

				if (!_didIteratorError4) {
					context$1$0.next = 141;
					break;
				}

				throw _iteratorError4;

			case 141:
				return context$1$0.finish(138);

			case 142:
				return context$1$0.finish(135);

			case 143:
				_iteratorNormalCompletion3 = true;
				context$1$0.next = 70;
				break;

			case 146:
				context$1$0.next = 152;
				break;

			case 148:
				context$1$0.prev = 148;
				context$1$0.t3 = context$1$0['catch'](68);
				_didIteratorError3 = true;
				_iteratorError3 = context$1$0.t3;

			case 152:
				context$1$0.prev = 152;
				context$1$0.prev = 153;

				if (!_iteratorNormalCompletion3 && _iterator3['return']) {
					_iterator3['return']();
				}

			case 155:
				context$1$0.prev = 155;

				if (!_didIteratorError3) {
					context$1$0.next = 158;
					break;
				}

				throw _iteratorError3;

			case 158:
				return context$1$0.finish(155);

			case 159:
				return context$1$0.finish(152);

			case 160:
				commonjsPkg = {
					name: pkg.name,
					version: version,
					dependencies: {
						react: pkg.dependencies.react || require(require.resolve('patternplate/node_modules/patternplate-server/package.json')).dependencies.react
					}
				};
				context$1$0.next = 163;
				return regeneratorRuntime.awrap(_qIoFs2['default'].write((0, _path.resolve)(commonjsRoot, 'package.json'), JSON.stringify(commonjsPkg, null, '  ')));

			case 163:
				_iteratorNormalCompletion2 = true;
				context$1$0.next = 56;
				break;

			case 166:
				context$1$0.next = 172;
				break;

			case 168:
				context$1$0.prev = 168;
				context$1$0.t4 = context$1$0['catch'](54);
				_didIteratorError2 = true;
				_iteratorError2 = context$1$0.t4;

			case 172:
				context$1$0.prev = 172;
				context$1$0.prev = 173;

				if (!_iteratorNormalCompletion2 && _iterator2['return']) {
					_iterator2['return']();
				}

			case 175:
				context$1$0.prev = 175;

				if (!_didIteratorError2) {
					context$1$0.next = 178;
					break;
				}

				throw _iteratorError2;

			case 178:
				return context$1$0.finish(175);

			case 179:
				return context$1$0.finish(172);

			case 180:
				if (!commonjsConfig.tasks.bundles) {
					context$1$0.next = 240;
					break;
				}

				context$1$0.next = 183;
				return regeneratorRuntime.awrap(_qIoFs2['default'].listTree((0, _path.resolve)(patternRoot, '@environments')));

			case 183:
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
				_iteratorNormalCompletion6 = true;
				_didIteratorError6 = false;
				_iteratorError6 = undefined;
				context$1$0.prev = 190;
				_iterator6 = environments[Symbol.iterator]();

			case 192:
				if (_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done) {
					context$1$0.next = 201;
					break;
				}

				_environment = _step6.value;
				context$1$0.next = 196;
				return regeneratorRuntime.awrap((0, _libraryUtilitiesGetPatterns2['default'])({
					'id': _qIoFs2['default'].relativeFromDirectory(patternRoot, _environment),
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

			case 196:
				pattern = context$1$0.sent;

				builds.push(pattern[0]);

			case 198:
				_iteratorNormalCompletion6 = true;
				context$1$0.next = 192;
				break;

			case 201:
				context$1$0.next = 207;
				break;

			case 203:
				context$1$0.prev = 203;
				context$1$0.t5 = context$1$0['catch'](190);
				_didIteratorError6 = true;
				_iteratorError6 = context$1$0.t5;

			case 207:
				context$1$0.prev = 207;
				context$1$0.prev = 208;

				if (!_iteratorNormalCompletion6 && _iterator6['return']) {
					_iterator6['return']();
				}

			case 210:
				context$1$0.prev = 210;

				if (!_didIteratorError6) {
					context$1$0.next = 213;
					break;
				}

				throw _iteratorError6;

			case 213:
				return context$1$0.finish(210);

			case 214:
				return context$1$0.finish(207);

			case 215:
				context$1$0.next = 217;
				return regeneratorRuntime.awrap(_qIoFs2['default'].makeTree(commonjsRoot));

			case 217:
				writes = [];
				_iteratorNormalCompletion7 = true;
				_didIteratorError7 = false;
				_iteratorError7 = undefined;
				context$1$0.prev = 221;

				_loop = function () {
					var build = _step7.value;

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

					_iteratorNormalCompletion8 = true;
					_didIteratorError8 = false;
					_iteratorError8 = undefined;

					try {
						for (_iterator8 = Object.keys(results)[Symbol.iterator](); !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
							var resultName = _step8.value;

							var result = results[resultName];
							var contents = comment + '\n' + result.buffer.toString('utf-8');
							var ext = result.out;
							var fileName = (0, _path.resolve)(commonjsRoot, [build.manifest.name, ext].join('.'));
							application.log.info('[console:run] Writing "' + resultName + '" for configuration "' + build.manifest.name + '" to ' + fileName + ' ...');
							writes.push(_qIoFs2['default'].write(fileName, contents));
						}
					} catch (err) {
						_didIteratorError8 = true;
						_iteratorError8 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion8 && _iterator8['return']) {
								_iterator8['return']();
							}
						} finally {
							if (_didIteratorError8) {
								throw _iteratorError8;
							}
						}
					}
				};

				for (_iterator7 = builds[Symbol.iterator](); !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
					_loop();
				}

				context$1$0.next = 230;
				break;

			case 226:
				context$1$0.prev = 226;
				context$1$0.t6 = context$1$0['catch'](221);
				_didIteratorError7 = true;
				_iteratorError7 = context$1$0.t6;

			case 230:
				context$1$0.prev = 230;
				context$1$0.prev = 231;

				if (!_iteratorNormalCompletion7 && _iterator7['return']) {
					_iterator7['return']();
				}

			case 233:
				context$1$0.prev = 233;

				if (!_didIteratorError7) {
					context$1$0.next = 236;
					break;
				}

				throw _iteratorError7;

			case 236:
				return context$1$0.finish(233);

			case 237:
				return context$1$0.finish(230);

			case 238:
				context$1$0.next = 240;
				return regeneratorRuntime.awrap(Promise.all(writes));

			case 240:
				if (!commonjsConfig.tasks['static']) {
					context$1$0.next = 252;
					break;
				}

				context$1$0.next = 243;
				return regeneratorRuntime.awrap(_qIoFs2['default'].exists(staticRoot));

			case 243:
				if (!context$1$0.sent) {
					context$1$0.next = 251;
					break;
				}

				application.log.info('[console:run] Copy asset files from "' + assetRoot + '" to ' + commonjsRoot + ' ...');
				context$1$0.next = 247;
				return regeneratorRuntime.awrap(_qIoFs2['default'].makeTree((0, _path.resolve)(commonjsRoot, 'static')));

			case 247:
				context$1$0.next = 249;
				return regeneratorRuntime.awrap(_qIoFs2['default'].copyTree(staticRoot, (0, _path.resolve)(commonjsRoot, 'static')));

			case 249:
				context$1$0.next = 252;
				break;

			case 251:
				application.log.info('[console:run] No asset files at "' + assetRoot + '"');

			case 252:
			case 'end':
				return context$1$0.stop();
		}
	}, null, this, [[9, 13, 17, 25], [18,, 20, 24], [54, 168, 172, 180], [68, 148, 152, 160], [78, 131, 135, 143], [89, 105, 109, 117], [110,, 112, 116], [136,, 138, 142], [153,, 155, 159], [173,, 175, 179], [190, 203, 207, 215], [208,, 210, 214], [221, 226, 230, 238], [231,, 233, 237]]);
}

exports['default'] = exportAsCommonjs;
module.exports = exports['default'];

// FIXME: This simple merge statement is not sufficient to reconfigure your build process (may apply to other config
// cases too). A better aproach would be to have a configuration model which could do the merge on a per-config-key
// and as side-benefit it would help reduce breaking changes.

// Copy assets

// write pattern.json with additional meta data

// Write main variant into pattern build folder, render html into layout

// TODO: resolve this

// Build environment output

// Copy static files