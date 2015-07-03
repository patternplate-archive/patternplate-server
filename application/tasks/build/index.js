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
					context$1$0.next = 89;
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

				if (environments.length === 0) {
					environments = ['index'];
				}

				builds = [];
				_iteratorNormalCompletion = true;
				_didIteratorError = false;
				_iteratorError = undefined;
				context$1$0.prev = 35;
				_iterator = environments[Symbol.iterator]();

			case 37:
				if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
					context$1$0.next = 50;
					break;
				}

				_environment = _step.value;
				context$1$0.next = 41;
				return regeneratorRuntime.awrap(application.pattern.factory(_qIoFs2['default'].relativeFromDirectory(patternRoot, _environment), patternRoot, patternConfig, application.transforms));

			case 41:
				pattern = context$1$0.sent;
				context$1$0.next = 44;
				return regeneratorRuntime.awrap(pattern.read());

			case 44:
				context$1$0.next = 46;
				return regeneratorRuntime.awrap(pattern.transform(false, true));

			case 46:

				builds.push(pattern);

			case 47:
				_iteratorNormalCompletion = true;
				context$1$0.next = 37;
				break;

			case 50:
				context$1$0.next = 56;
				break;

			case 52:
				context$1$0.prev = 52;
				context$1$0.t0 = context$1$0['catch'](35);
				_didIteratorError = true;
				_iteratorError = context$1$0.t0;

			case 56:
				context$1$0.prev = 56;
				context$1$0.prev = 57;

				if (!_iteratorNormalCompletion && _iterator['return']) {
					_iterator['return']();
				}

			case 59:
				context$1$0.prev = 59;

				if (!_didIteratorError) {
					context$1$0.next = 62;
					break;
				}

				throw _iteratorError;

			case 62:
				return context$1$0.finish(59);

			case 63:
				return context$1$0.finish(56);

			case 64:
				context$1$0.next = 66;
				return regeneratorRuntime.awrap(_qIoFs2['default'].makeTree(patternBuildDirectory));

			case 66:
				writes = [];
				_iteratorNormalCompletion2 = true;
				_didIteratorError2 = false;
				_iteratorError2 = undefined;
				context$1$0.prev = 70;

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

				context$1$0.next = 79;
				break;

			case 75:
				context$1$0.prev = 75;
				context$1$0.t1 = context$1$0['catch'](70);
				_didIteratorError2 = true;
				_iteratorError2 = context$1$0.t1;

			case 79:
				context$1$0.prev = 79;
				context$1$0.prev = 80;

				if (!_iteratorNormalCompletion2 && _iterator2['return']) {
					_iterator2['return']();
				}

			case 82:
				context$1$0.prev = 82;

				if (!_didIteratorError2) {
					context$1$0.next = 85;
					break;
				}

				throw _iteratorError2;

			case 85:
				return context$1$0.finish(82);

			case 86:
				return context$1$0.finish(79);

			case 87:
				context$1$0.next = 89;
				return regeneratorRuntime.awrap(Promise.all(writes));

			case 89:
				if (!buildConfig.tasks['static']) {
					context$1$0.next = 99;
					break;
				}

				context$1$0.next = 92;
				return regeneratorRuntime.awrap(_qIoFs2['default'].exists(staticRoot));

			case 92:
				if (!context$1$0.sent) {
					context$1$0.next = 98;
					break;
				}

				application.log.info('[console:run] Copy asset files from "' + assetRoot + '" to ' + patternBuildDirectory + ' ...');
				context$1$0.next = 96;
				return regeneratorRuntime.awrap(_qIoFs2['default'].copyTree(staticRoot, (0, _path.resolve)(patternBuildDirectory, 'static')));

			case 96:
				context$1$0.next = 99;
				break;

			case 98:
				application.log.info('[console:run] No asset files at "' + assetRoot + '"');

			case 99:
				if (!buildConfig.tasks.patterns) {
					context$1$0.next = 293;
					break;
				}

				context$1$0.next = 102;
				return regeneratorRuntime.awrap(_qIoFs2['default'].exists(assetRoot));

			case 102:
				if (!context$1$0.sent) {
					context$1$0.next = 108;
					break;
				}

				application.log.info('[console:run] Copy static files from "' + staticRoot + '" to ' + buildDirectory + ' ...');
				context$1$0.next = 106;
				return regeneratorRuntime.awrap(_qIoFs2['default'].copyTree(assetRoot, (0, _path.resolve)(patternBuildDirectory, '_assets')));

			case 106:
				context$1$0.next = 109;
				break;

			case 108:
				application.log.info('[console:run] No static files at "' + staticRoot + '"');

			case 109:
				context$1$0.next = 111;
				return regeneratorRuntime.awrap((0, _libraryUtilitiesGetPatterns2['default'])({
					'id': '.',
					'base': patternRoot,
					'config': patternConfig,
					'factory': application.pattern.factory,
					'transforms': application.transforms,
					'filters': {}
				}));

			case 111:
				patternList = context$1$0.sent;
				_iteratorNormalCompletion4 = true;
				_didIteratorError4 = false;
				_iteratorError4 = undefined;
				context$1$0.prev = 115;
				_iterator4 = patternList[Symbol.iterator]();

			case 117:
				if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
					context$1$0.next = 279;
					break;
				}

				patternItem = _step4.value;
				patternResultDirectory = (0, _path.resolve)(patternBuildDirectory, patternItem.id);
				patternSnippetsDirectory = (0, _path.resolve)(patternResultDirectory, 'snippets');
				context$1$0.next = 123;
				return regeneratorRuntime.awrap(_qIoFs2['default'].makeTree(patternResultDirectory));

			case 123:
				context$1$0.next = 125;
				return regeneratorRuntime.awrap(_qIoFs2['default'].makeTree(patternSnippetsDirectory));

			case 125:
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
				context$1$0.prev = 129;
				_iterator5 = Object.keys(patternItem.results)[Symbol.iterator]();

			case 131:
				if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
					context$1$0.next = 207;
					break;
				}

				resultEnvironmentName = _step5.value;
				resultEnvironment = patternItem.results[resultEnvironmentName];
				environmentConfig = patternItem.environments[resultEnvironmentName].manifest;

				metaData.results[resultEnvironmentName] = {};

				_iteratorNormalCompletion7 = true;
				_didIteratorError7 = false;
				_iteratorError7 = undefined;
				context$1$0.prev = 139;
				_iterator7 = Object.keys(resultEnvironment)[Symbol.iterator]();

			case 141:
				if (_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done) {
					context$1$0.next = 190;
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
				context$1$0.prev = 150;
				_iterator8 = variants[Symbol.iterator]();

			case 152:
				if (_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done) {
					context$1$0.next = 164;
					break;
				}

				variant = _step8.value;
				fragments = [resultName.toLowerCase(), !environmentConfig.formats || environmentConfig.formats.includes(result['in']) ? resultEnvironmentName : '', variants.length > 1 ? variant.name : ''];

				fragments = fragments.filter(function (item) {
					return item;
				});

				resultFileBaseName = fragments.join('-') + '.' + result.out;
				resultFile = (0, _path.resolve)(patternSnippetsDirectory, resultFileBaseName);
				context$1$0.next = 160;
				return regeneratorRuntime.awrap(_qIoFs2['default'].write(resultFile, variant.buffer));

			case 160:
				metaData.results[resultEnvironmentName][resultName][variant.name || 'library'] = _qIoFs2['default'].relativeFromDirectory(patternResultDirectory, resultFile);

			case 161:
				_iteratorNormalCompletion8 = true;
				context$1$0.next = 152;
				break;

			case 164:
				context$1$0.next = 170;
				break;

			case 166:
				context$1$0.prev = 166;
				context$1$0.t2 = context$1$0['catch'](150);
				_didIteratorError8 = true;
				_iteratorError8 = context$1$0.t2;

			case 170:
				context$1$0.prev = 170;
				context$1$0.prev = 171;

				if (!_iteratorNormalCompletion8 && _iterator8['return']) {
					_iterator8['return']();
				}

			case 173:
				context$1$0.prev = 173;

				if (!_didIteratorError8) {
					context$1$0.next = 176;
					break;
				}

				throw _iteratorError8;

			case 176:
				return context$1$0.finish(173);

			case 177:
				return context$1$0.finish(170);

			case 178:
				mainBuffer = result.demoBuffer || result.buffer;
				mainName = resultName.toLowerCase();

				if (!(mainName === 'markup')) {
					context$1$0.next = 182;
					break;
				}

				return context$1$0.abrupt('continue', 187);

			case 182:

				// TODO: resolve this
				mainName = mainName === 'documentation' ? mainName : resultEnvironmentName;

				mainFileBaseName = mainName + '.' + result.out;
				mainFile = (0, _path.resolve)(patternResultDirectory, mainFileBaseName);
				context$1$0.next = 187;
				return regeneratorRuntime.awrap(_qIoFs2['default'].write(mainFile, mainBuffer));

			case 187:
				_iteratorNormalCompletion7 = true;
				context$1$0.next = 141;
				break;

			case 190:
				context$1$0.next = 196;
				break;

			case 192:
				context$1$0.prev = 192;
				context$1$0.t3 = context$1$0['catch'](139);
				_didIteratorError7 = true;
				_iteratorError7 = context$1$0.t3;

			case 196:
				context$1$0.prev = 196;
				context$1$0.prev = 197;

				if (!_iteratorNormalCompletion7 && _iterator7['return']) {
					_iterator7['return']();
				}

			case 199:
				context$1$0.prev = 199;

				if (!_didIteratorError7) {
					context$1$0.next = 202;
					break;
				}

				throw _iteratorError7;

			case 202:
				return context$1$0.finish(199);

			case 203:
				return context$1$0.finish(196);

			case 204:
				_iteratorNormalCompletion5 = true;
				context$1$0.next = 131;
				break;

			case 207:
				context$1$0.next = 213;
				break;

			case 209:
				context$1$0.prev = 209;
				context$1$0.t4 = context$1$0['catch'](129);
				_didIteratorError5 = true;
				_iteratorError5 = context$1$0.t4;

			case 213:
				context$1$0.prev = 213;
				context$1$0.prev = 214;

				if (!_iteratorNormalCompletion5 && _iterator5['return']) {
					_iterator5['return']();
				}

			case 216:
				context$1$0.prev = 216;

				if (!_didIteratorError5) {
					context$1$0.next = 219;
					break;
				}

				throw _iteratorError5;

			case 219:
				return context$1$0.finish(216);

			case 220:
				return context$1$0.finish(213);

			case 221:
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
				context$1$0.prev = 225;
				_iterator6 = Object.keys(patternItem.results)[Symbol.iterator]();

			case 227:
				if (_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done) {
					context$1$0.next = 255;
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
				context$1$0.prev = 236;

				for (_iterator9 = Object.keys(_environment2)[Symbol.iterator](); !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
					resultType = _step9.value;
					result = _environment2[resultType];
					templateKey = resultType.toLowerCase();
					content = result.demoBuffer || result.buffer;
					uri = patternItem.id + '/' + environmentName + '.' + result.out;
					templateSectionData = Object.assign({}, blueprint, { content: content, uri: uri });

					templateData[templateKey] = Array.isArray(templateData[templateKey]) ? templateData[templateKey].concat([templateSectionData]) : [templateSectionData];
				}
				context$1$0.next = 244;
				break;

			case 240:
				context$1$0.prev = 240;
				context$1$0.t5 = context$1$0['catch'](236);
				_didIteratorError9 = true;
				_iteratorError9 = context$1$0.t5;

			case 244:
				context$1$0.prev = 244;
				context$1$0.prev = 245;

				if (!_iteratorNormalCompletion9 && _iterator9['return']) {
					_iterator9['return']();
				}

			case 247:
				context$1$0.prev = 247;

				if (!_didIteratorError9) {
					context$1$0.next = 250;
					break;
				}

				throw _iteratorError9;

			case 250:
				return context$1$0.finish(247);

			case 251:
				return context$1$0.finish(244);

			case 252:
				_iteratorNormalCompletion6 = true;
				context$1$0.next = 227;
				break;

			case 255:
				context$1$0.next = 261;
				break;

			case 257:
				context$1$0.prev = 257;
				context$1$0.t6 = context$1$0['catch'](225);
				_didIteratorError6 = true;
				_iteratorError6 = context$1$0.t6;

			case 261:
				context$1$0.prev = 261;
				context$1$0.prev = 262;

				if (!_iteratorNormalCompletion6 && _iterator6['return']) {
					_iterator6['return']();
				}

			case 264:
				context$1$0.prev = 264;

				if (!_didIteratorError6) {
					context$1$0.next = 267;
					break;
				}

				throw _iteratorError6;

			case 267:
				return context$1$0.finish(264);

			case 268:
				return context$1$0.finish(261);

			case 269:
				rendered = (0, _layouts2['default'])(templateData);
				context$1$0.next = 272;
				return regeneratorRuntime.awrap(_qIoFs2['default'].write((0, _path.resolve)(patternResultDirectory, 'index.html'), rendered));

			case 272:
				context$1$0.next = 274;
				return regeneratorRuntime.awrap(_qIoFs2['default'].write((0, _path.resolve)(patternResultDirectory, 'build.json'), JSON.stringify(patternItem, null, '  ')));

			case 274:
				context$1$0.next = 276;
				return regeneratorRuntime.awrap(_qIoFs2['default'].write((0, _path.resolve)(patternResultDirectory, 'pattern.json'), JSON.stringify(metaData, null, '  ')));

			case 276:
				_iteratorNormalCompletion4 = true;
				context$1$0.next = 117;
				break;

			case 279:
				context$1$0.next = 285;
				break;

			case 281:
				context$1$0.prev = 281;
				context$1$0.t7 = context$1$0['catch'](115);
				_didIteratorError4 = true;
				_iteratorError4 = context$1$0.t7;

			case 285:
				context$1$0.prev = 285;
				context$1$0.prev = 286;

				if (!_iteratorNormalCompletion4 && _iterator4['return']) {
					_iterator4['return']();
				}

			case 288:
				context$1$0.prev = 288;

				if (!_didIteratorError4) {
					context$1$0.next = 291;
					break;
				}

				throw _iteratorError4;

			case 291:
				return context$1$0.finish(288);

			case 292:
				return context$1$0.finish(285);

			case 293:
				archive = (0, _archiver2['default'])('zip');
				output = (0, _fs.createWriteStream)(buildDirectory + '.zip');

				archive.pipe(output);
				archive.directory(buildDirectory, false);
				archive.finalize();

				return context$1$0.abrupt('return', new Promise(function (fulfill, reject) {
					output.on('close', fulfill);
					archive.on('error', reject);
				}));

			case 299:
			case 'end':
				return context$1$0.stop();
		}
	}, null, this, [[35, 52, 56, 64], [57,, 59, 63], [70, 75, 79, 87], [80,, 82, 86], [115, 281, 285, 293], [129, 209, 213, 221], [139, 192, 196, 204], [150, 166, 170, 178], [171,, 173, 177], [197,, 199, 203], [214,, 216, 220], [225, 257, 261, 269], [236, 240, 244, 252], [245,, 247, 251], [262,, 264, 268], [286,, 288, 292]]);
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