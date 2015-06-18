/* eslint ignore */
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
var _bind = Function.prototype.bind;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports['default'] = patternFactory;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _path = require('path');

var _qIoFs = require('q-io/fs');

var _qIoFs2 = _interopRequireDefault(_qIoFs);

var _pascalCase = require('pascal-case');

var _pascalCase2 = _interopRequireDefault(_pascalCase);

var _semver = require('semver');

var _semver2 = _interopRequireDefault(_semver);

var _lodashMerge = require('lodash.merge');

var _lodashMerge2 = _interopRequireDefault(_lodashMerge);

var _minimatch = require('minimatch');

var _minimatch2 = _interopRequireDefault(_minimatch);

var Pattern = (function () {
	function Pattern(id, base) {
		var config = arguments[2] === undefined ? {} : arguments[2];
		var transforms = arguments[3] === undefined ? {} : arguments[3];
		var cache = arguments[4] === undefined ? null : arguments[4];

		_classCallCheck(this, Pattern);

		this.files = {};
		this.config = {};
		this.manifest = {};
		this.dependencies = {};
		this.results = {};
		this.mtime = null;

		this.id = id;
		this.cache = cache;
		this.base = base;
		this.path = Pattern.resolve(this.base, this.id);
		this.config = config;
		this.transforms = transforms;
		this.environments = {
			'index': {
				'manifest': { 'name': 'index' }
			}
		};
		this.isEnvironment = this.id.includes('@environment');
	}

	_createClass(Pattern, [{
		key: 'readEnvironments',
		value: function readEnvironments() {
			var environmentsPath, results, environments, manifestPaths, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, manifestPath, _manifest, environemntName;

			return regeneratorRuntime.async(function readEnvironments$(context$2$0) {
				while (1) switch (context$2$0.prev = context$2$0.next) {
					case 0:
						environmentsPath = (0, _path.resolve)(this.base, '@environments');
						results = this.environments;
						context$2$0.next = 4;
						return regeneratorRuntime.awrap(_qIoFs2['default'].exists(environmentsPath));

					case 4:
						if (context$2$0.sent) {
							context$2$0.next = 6;
							break;
						}

						return context$2$0.abrupt('return', results);

					case 6:
						context$2$0.next = 8;
						return regeneratorRuntime.awrap(_qIoFs2['default'].listTree(environmentsPath));

					case 8:
						environments = context$2$0.sent;
						manifestPaths = environments.filter(function (environemnt) {
							return (0, _path.basename)(environemnt) === 'pattern.json';
						});
						_iteratorNormalCompletion = true;
						_didIteratorError = false;
						_iteratorError = undefined;
						context$2$0.prev = 13;
						_iterator = manifestPaths[Symbol.iterator]();

					case 15:
						if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
							context$2$0.next = 26;
							break;
						}

						manifestPath = _step.value;
						context$2$0.next = 19;
						return regeneratorRuntime.awrap(_qIoFs2['default'].read(manifestPath));

					case 19:
						context$2$0.t0 = context$2$0.sent;
						_manifest = JSON.parse(context$2$0.t0);
						environemntName = _manifest.name || (0, _path.dirname)(manifestPath);

						results[environemntName] = { manifest: _manifest };

					case 23:
						_iteratorNormalCompletion = true;
						context$2$0.next = 15;
						break;

					case 26:
						context$2$0.next = 32;
						break;

					case 28:
						context$2$0.prev = 28;
						context$2$0.t1 = context$2$0['catch'](13);
						_didIteratorError = true;
						_iteratorError = context$2$0.t1;

					case 32:
						context$2$0.prev = 32;
						context$2$0.prev = 33;

						if (!_iteratorNormalCompletion && _iterator['return']) {
							_iterator['return']();
						}

					case 35:
						context$2$0.prev = 35;

						if (!_didIteratorError) {
							context$2$0.next = 38;
							break;
						}

						throw _iteratorError;

					case 38:
						return context$2$0.finish(35);

					case 39:
						return context$2$0.finish(32);

					case 40:
						return context$2$0.abrupt('return', results);

					case 41:
					case 'end':
						return context$2$0.stop();
				}
			}, null, this, [[13, 28, 32, 40], [33,, 35, 39]]);
		}
	}, {
		key: 'read',
		value: function read() {
			var path = arguments[0] === undefined ? this.path : arguments[0];
			var fs = arguments[1] === undefined ? _qIoFs2['default'] : arguments[1];

			var manifestPath, manifestData, files, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, file, stat, _mtime, _name, data, ext, buffer, patternName, patternIDString, patternBaseName, patternBaseNameFragments, patternRange, patternID, pattern, fileName, dependencyName, dependencyFile;

			return regeneratorRuntime.async(function read$(context$2$0) {
				var _this2 = this;

				while (1) switch (context$2$0.prev = context$2$0.next) {
					case 0:
						fs.exists = fs.exists.bind(fs);

						context$2$0.next = 3;
						return regeneratorRuntime.awrap(fs.exists(path));

					case 3:
						context$2$0.t0 = context$2$0.sent;

						if (!(context$2$0.t0 !== true)) {
							context$2$0.next = 6;
							break;
						}

						throw new Error('Can not read pattern from ' + this.path + ', it does not exist.', {
							'fileName': this.path,
							'pattern': this.id
						});

					case 6:
						manifestPath = (0, _path.resolve)(this.path, 'pattern.json');
						context$2$0.next = 9;
						return regeneratorRuntime.awrap(fs.exists(manifestPath));

					case 9:
						if (context$2$0.sent) {
							context$2$0.next = 11;
							break;
						}

						throw new Error('Can not read pattern.json from ' + this.path + ', it does not exist.', {
							'fileName': this.path,
							'pattern': this.id
						});

					case 11:
						context$2$0.prev = 11;
						context$2$0.next = 14;
						return regeneratorRuntime.awrap(fs.read(manifestPath));

					case 14:
						context$2$0.t1 = context$2$0.sent;
						manifestData = JSON.parse(context$2$0.t1);

						this.manifest = Object.assign({}, {
							'version': '0.1.0',
							'build': true,
							'display': true
						}, this.manifest, manifestData);
						context$2$0.next = 22;
						break;

					case 19:
						context$2$0.prev = 19;
						context$2$0.t2 = context$2$0['catch'](11);
						throw new Error('Error while reading pattern.json from ' + this.path, {
							'file': this.path,
							'pattern': this.id,
							'stack': context$2$0.t2.stack
						});

					case 22:
						if (!(this.isEnvironment && !this.manifest.patterns)) {
							context$2$0.next = 25;
							break;
						}

						context$2$0.next = 25;
						return regeneratorRuntime.awrap((function callee$2$0() {
							var list, range;
							return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
								var _this = this;

								while (1) switch (context$3$0.prev = context$3$0.next) {
									case 0:
										context$3$0.next = 2;
										return regeneratorRuntime.awrap(_qIoFs2['default'].listTree(this.base));

									case 2:
										list = context$3$0.sent;
										range = this.manifest.range || '*';

										list = list.filter(function (item) {
											return (0, _path.basename)(item) === 'pattern.json';
										}).filter(function (item) {
											return !item.includes('@environment');
										}).map(function (item) {
											return _qIoFs2['default'].relativeFromDirectory(_this.base, (0, _path.dirname)(item));
										}).filter(function (item) {
											return item !== _this.id;
										});

										if (this.manifest.include) {
											list = list.filter(function (item) {
												return (0, _minimatch2['default'])(item, _this.manifest.include.join('|'));
											});
										}

										if (this.manifest.exclude) {
											list = list.filter(function (item) {
												return !(0, _minimatch2['default'])(item, _this.manifest.exclude.join('|'));
											});
										}

										this.manifest.patterns = list.reduce(function (results, item) {
											return Object.assign(results, _defineProperty({}, item, '' + item + '@' + range));
										}, {});

									case 8:
									case 'end':
										return context$3$0.stop();
								}
							}, null, _this2);
						})());

					case 25:
						context$2$0.next = 27;
						return regeneratorRuntime.awrap(this.readEnvironments());

					case 27:
						this.environments = context$2$0.sent;
						context$2$0.next = 30;
						return regeneratorRuntime.awrap(fs.listTree(path));

					case 30:
						files = context$2$0.sent;

						files = files.filter(function (fileName) {
							var ext = (0, _path.extname)(fileName);
							return ext && ['index', 'demo', 'pattern'].indexOf((0, _path.basename)(fileName, ext)) > -1;
						});

						_iteratorNormalCompletion2 = true;
						_didIteratorError2 = false;
						_iteratorError2 = undefined;
						context$2$0.prev = 35;
						_iterator2 = files[Symbol.iterator]();

					case 37:
						if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
							context$2$0.next = 57;
							break;
						}

						file = _step2.value;
						context$2$0.next = 41;
						return regeneratorRuntime.awrap(fs.stat(file));

					case 41:
						stat = context$2$0.sent;
						_mtime = stat.node.mtime;
						_name = (0, _path.basename)(file);
						data = undefined;

						if (this.cache) {
							data = this.cache.get(file, _mtime);
						}

						if (data) {
							context$2$0.next = 53;
							break;
						}

						ext = (0, _path.extname)(file);
						context$2$0.next = 50;
						return regeneratorRuntime.awrap(fs.read(file));

					case 50:
						buffer = context$2$0.sent;

						data = {
							buffer: buffer,
							name: _name,
							'basename': (0, _path.basename)(_name, ext),
							'ext': ext,
							'format': ext.replace('.', ''),
							'fs': stat,
							'path': file,
							'source': buffer
						};

						if (this.cache) {
							this.cache.set(file, _mtime, data);
						}

					case 53:

						this.files[_name] = data;

					case 54:
						_iteratorNormalCompletion2 = true;
						context$2$0.next = 37;
						break;

					case 57:
						context$2$0.next = 63;
						break;

					case 59:
						context$2$0.prev = 59;
						context$2$0.t3 = context$2$0['catch'](35);
						_didIteratorError2 = true;
						_iteratorError2 = context$2$0.t3;

					case 63:
						context$2$0.prev = 63;
						context$2$0.prev = 64;

						if (!_iteratorNormalCompletion2 && _iterator2['return']) {
							_iterator2['return']();
						}

					case 66:
						context$2$0.prev = 66;

						if (!_didIteratorError2) {
							context$2$0.next = 69;
							break;
						}

						throw _iteratorError2;

					case 69:
						return context$2$0.finish(66);

					case 70:
						return context$2$0.finish(63);

					case 71:
						if (!(typeof this.manifest.patterns !== 'object')) {
							context$2$0.next = 73;
							break;
						}

						return context$2$0.abrupt('return', this);

					case 73:
						context$2$0.t4 = regeneratorRuntime.keys(this.manifest.patterns);

					case 74:
						if ((context$2$0.t5 = context$2$0.t4()).done) {
							context$2$0.next = 96;
							break;
						}

						patternName = context$2$0.t5.value;
						patternIDString = this.manifest.patterns[patternName];
						patternBaseName = (0, _path.basename)(patternIDString);
						patternBaseNameFragments = patternBaseName.split('@');
						patternRange = _semver2['default'].validRange(patternBaseNameFragments[1]) || '*';

						if (patternRange) {
							context$2$0.next = 82;
							break;
						}

						throw new Error('' + patternBaseNameFragments[1] + ' in ' + patternIDString + ' is no valid semver range.', {
							'file': this.path,
							'pattern': this.id
						});

					case 82:
						patternID = (0, _path.join)((0, _path.dirname)(patternIDString), patternBaseNameFragments[0]);
						pattern = new Pattern(patternID, this.base, this.config, this.transforms, this.cache);
						context$2$0.next = 86;
						return regeneratorRuntime.awrap(pattern.read(pattern.path));

					case 86:
						this.dependencies[patternName] = context$2$0.sent;

						if (_semver2['default'].satisfies(pattern.manifest.version, patternRange)) {
							context$2$0.next = 94;
							break;
						}

						if (this.isEnvironment) {
							context$2$0.next = 92;
							break;
						}

						throw new Error('' + pattern.id + ' at version ' + pattern.manifest.version + ' does not satisfy range ' + patternRange + ' specified by ' + this.id + '.', {
							'file': pattern.path,
							'pattern': this.id
						});

					case 92:
						delete this.dependencies[patternName];
						console.warn('Omitting ' + pattern.id + ' at version ' + pattern.manifest.version + ' from build. It does not satisfy range ' + patternRange + ' specified by ' + this.id + '.');

					case 94:
						context$2$0.next = 74;
						break;

					case 96:
						context$2$0.t6 = regeneratorRuntime.keys(this.files);

					case 97:
						if ((context$2$0.t7 = context$2$0.t6()).done) {
							context$2$0.next = 106;
							break;
						}

						fileName = context$2$0.t7.value;
						file = this.files[fileName];

						file.dependencies = {};

						if (!(file.basename === 'demo')) {
							context$2$0.next = 103;
							break;
						}

						return context$2$0.abrupt('continue', 97);

					case 103:

						for (dependencyName in this.dependencies) {
							dependencyFile = this.dependencies[dependencyName].files[file.name];

							if (dependencyFile) {
								file.dependencies[dependencyName] = dependencyFile;
							}
						}
						context$2$0.next = 97;
						break;

					case 106:

						this.getLastModified();
						return context$2$0.abrupt('return', this);

					case 108:
					case 'end':
						return context$2$0.stop();
				}
			}, null, this, [[11, 19], [35, 59, 63, 71], [64,, 66, 70]]);
		}
	}, {
		key: 'transform',
		value: function transform() {
			var withDemos = arguments[0] === undefined ? true : arguments[0];
			var forced = arguments[1] === undefined ? false : arguments[1];

			var demos, fs, list, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, listItem, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, formatName, fileName, file, formatConfig, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, environmentName, environmentData, environment, transforms, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, transform, fn, environmentConfig, applicationConfig, configuration;

			return regeneratorRuntime.async(function transform$(context$2$0) {
				while (1) switch (context$2$0.prev = context$2$0.next) {
					case 0:
						demos = {};

						if (!forced) {
							context$2$0.next = 68;
							break;
						}

						context$2$0.next = 4;
						return regeneratorRuntime.awrap(_qIoFs2['default'].mock(this.path));

					case 4:
						fs = context$2$0.sent;
						context$2$0.next = 7;
						return regeneratorRuntime.awrap(fs.makeTree(this.path));

					case 7:
						context$2$0.next = 9;
						return regeneratorRuntime.awrap(fs.listTree('/'));

					case 9:
						list = context$2$0.sent;
						_iteratorNormalCompletion3 = true;
						_didIteratorError3 = false;
						_iteratorError3 = undefined;
						context$2$0.prev = 13;
						_iterator3 = list[Symbol.iterator]();

					case 15:
						if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
							context$2$0.next = 25;
							break;
						}

						listItem = _step3.value;
						context$2$0.next = 19;
						return regeneratorRuntime.awrap(fs.isFile(listItem));

					case 19:
						if (!context$2$0.sent) {
							context$2$0.next = 22;
							break;
						}

						context$2$0.next = 22;
						return regeneratorRuntime.awrap(fs.rename(listItem, fs.join(this.path, fs.base(listItem))));

					case 22:
						_iteratorNormalCompletion3 = true;
						context$2$0.next = 15;
						break;

					case 25:
						context$2$0.next = 31;
						break;

					case 27:
						context$2$0.prev = 27;
						context$2$0.t0 = context$2$0['catch'](13);
						_didIteratorError3 = true;
						_iteratorError3 = context$2$0.t0;

					case 31:
						context$2$0.prev = 31;
						context$2$0.prev = 32;

						if (!_iteratorNormalCompletion3 && _iterator3['return']) {
							_iterator3['return']();
						}

					case 34:
						context$2$0.prev = 34;

						if (!_didIteratorError3) {
							context$2$0.next = 37;
							break;
						}

						throw _iteratorError3;

					case 37:
						return context$2$0.finish(34);

					case 38:
						return context$2$0.finish(31);

					case 39:
						_iteratorNormalCompletion4 = true;
						_didIteratorError4 = false;
						_iteratorError4 = undefined;
						context$2$0.prev = 42;
						_iterator4 = Object.keys(this.config.patterns.formats)[Symbol.iterator]();

					case 44:
						if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
							context$2$0.next = 52;
							break;
						}

						formatName = _step4.value;

						if (!this.config.patterns.formats[formatName].build) {
							context$2$0.next = 49;
							break;
						}

						context$2$0.next = 49;
						return regeneratorRuntime.awrap(fs.write((0, _path.resolve)(this.path, ['index', formatName].join('.')), '\n'));

					case 49:
						_iteratorNormalCompletion4 = true;
						context$2$0.next = 44;
						break;

					case 52:
						context$2$0.next = 58;
						break;

					case 54:
						context$2$0.prev = 54;
						context$2$0.t1 = context$2$0['catch'](42);
						_didIteratorError4 = true;
						_iteratorError4 = context$2$0.t1;

					case 58:
						context$2$0.prev = 58;
						context$2$0.prev = 59;

						if (!_iteratorNormalCompletion4 && _iterator4['return']) {
							_iterator4['return']();
						}

					case 61:
						context$2$0.prev = 61;

						if (!_didIteratorError4) {
							context$2$0.next = 64;
							break;
						}

						throw _iteratorError4;

					case 64:
						return context$2$0.finish(61);

					case 65:
						return context$2$0.finish(58);

					case 66:
						context$2$0.next = 68;
						return regeneratorRuntime.awrap(this.read(this.path, fs));

					case 68:
						if (!withDemos) {
							context$2$0.next = 81;
							break;
						}

						context$2$0.t2 = regeneratorRuntime.keys(this.files);

					case 70:
						if ((context$2$0.t3 = context$2$0.t2()).done) {
							context$2$0.next = 81;
							break;
						}

						fileName = context$2$0.t3.value;
						file = this.files[fileName];

						if (!(file.basename !== 'demo')) {
							context$2$0.next = 75;
							break;
						}

						return context$2$0.abrupt('continue', 70);

					case 75:
						formatConfig = this.config.patterns.formats[file.format];

						if (!(typeof formatConfig !== 'object')) {
							context$2$0.next = 78;
							break;
						}

						return context$2$0.abrupt('continue', 70);

					case 78:

						demos[formatConfig.name] = file;
						context$2$0.next = 70;
						break;

					case 81:
						_iteratorNormalCompletion5 = true;
						_didIteratorError5 = false;
						_iteratorError5 = undefined;
						context$2$0.prev = 84;
						_iterator5 = Object.keys(this.environments)[Symbol.iterator]();

					case 86:
						if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
							context$2$0.next = 148;
							break;
						}

						environmentName = _step5.value;
						environmentData = this.environments[environmentName];
						environment = environmentData.manifest.environment || {};
						context$2$0.t4 = regeneratorRuntime.keys(this.files);

					case 91:
						if ((context$2$0.t5 = context$2$0.t4()).done) {
							context$2$0.next = 145;
							break;
						}

						fileName = context$2$0.t5.value;
						file = this.files[fileName];

						if (!(file.basename === 'demo')) {
							context$2$0.next = 96;
							break;
						}

						return context$2$0.abrupt('continue', 91);

					case 96:
						formatConfig = this.config.patterns.formats[file.format];

						if (!(typeof formatConfig !== 'object')) {
							context$2$0.next = 99;
							break;
						}

						return context$2$0.abrupt('continue', 91);

					case 99:
						transforms = formatConfig.transforms || [];
						_iteratorNormalCompletion6 = true;
						_didIteratorError6 = false;
						_iteratorError6 = undefined;
						context$2$0.prev = 103;
						_iterator6 = transforms[Symbol.iterator]();

					case 105:
						if (_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done) {
							context$2$0.next = 127;
							break;
						}

						transform = _step6.value;
						fn = this.transforms[transform];
						environmentConfig = environment[transform] || {};
						applicationConfig = this.config.transforms[transform] || {};
						configuration = (0, _lodashMerge2['default'])({}, applicationConfig, environmentConfig);
						context$2$0.prev = 111;
						context$2$0.next = 114;
						return regeneratorRuntime.awrap(fn(file, demos[formatConfig.name], configuration, forced));

					case 114:
						file = context$2$0.sent;
						context$2$0.next = 124;
						break;

					case 117:
						context$2$0.prev = 117;
						context$2$0.t6 = context$2$0['catch'](111);

						context$2$0.t6.pattern = this.id;
						context$2$0.t6.file = context$2$0.t6.file || file.path;
						context$2$0.t6.transform = transform;
						console.error('Error while transforming file "' + context$2$0.t6.file + '" of pattern "' + context$2$0.t6.pattern + '" with transform "' + context$2$0.t6.transform + '".');
						throw context$2$0.t6;

					case 124:
						_iteratorNormalCompletion6 = true;
						context$2$0.next = 105;
						break;

					case 127:
						context$2$0.next = 133;
						break;

					case 129:
						context$2$0.prev = 129;
						context$2$0.t7 = context$2$0['catch'](103);
						_didIteratorError6 = true;
						_iteratorError6 = context$2$0.t7;

					case 133:
						context$2$0.prev = 133;
						context$2$0.prev = 134;

						if (!_iteratorNormalCompletion6 && _iterator6['return']) {
							_iterator6['return']();
						}

					case 136:
						context$2$0.prev = 136;

						if (!_didIteratorError6) {
							context$2$0.next = 139;
							break;
						}

						throw _iteratorError6;

					case 139:
						return context$2$0.finish(136);

					case 140:
						return context$2$0.finish(133);

					case 141:

						if (!this.results[environmentName]) {
							this.results[environmentName] = {};
						}

						this.results[environmentName][formatConfig.name] = file;
						context$2$0.next = 91;
						break;

					case 145:
						_iteratorNormalCompletion5 = true;
						context$2$0.next = 86;
						break;

					case 148:
						context$2$0.next = 154;
						break;

					case 150:
						context$2$0.prev = 150;
						context$2$0.t8 = context$2$0['catch'](84);
						_didIteratorError5 = true;
						_iteratorError5 = context$2$0.t8;

					case 154:
						context$2$0.prev = 154;
						context$2$0.prev = 155;

						if (!_iteratorNormalCompletion5 && _iterator5['return']) {
							_iterator5['return']();
						}

					case 157:
						context$2$0.prev = 157;

						if (!_didIteratorError5) {
							context$2$0.next = 160;
							break;
						}

						throw _iteratorError5;

					case 160:
						return context$2$0.finish(157);

					case 161:
						return context$2$0.finish(154);

					case 162:
					case 'end':
						return context$2$0.stop();
				}
			}, null, this, [[13, 27, 31, 39], [32,, 34, 38], [42, 54, 58, 66], [59,, 61, 65], [84, 150, 154, 162], [103, 129, 133, 141], [111, 117], [134,, 136, 140], [155,, 157, 161]]);
		}
	}, {
		key: 'getLastModified',
		value: function getLastModified() {
			var mtimes = [];

			if (this.dependencies) {
				for (var dependency in this.dependencies) {
					mtimes.push(this.dependencies[dependency].getLastModified());
				}
			}

			for (var fileName in this.files) {
				var file = this.files[fileName];
				mtimes.push(new Date(file.fs.node.mtime));
			}

			this.mtime = mtimes.sort(function (a, b) {
				return b - a;
			})[0];
			return this.mtime;
		}
	}, {
		key: 'toJSON',
		value: function toJSON() {
			var copy = Object.assign({}, this);

			if (copy.dependencies) {
				for (var dependency in copy.dependencies) {
					copy.dependencies[dependency] = copy.dependencies[dependency].toJSON();
				}
			}

			var _iteratorNormalCompletion7 = true;
			var _didIteratorError7 = false;
			var _iteratorError7 = undefined;

			try {
				for (var _iterator7 = Object.keys(copy.results)[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
					var environmentName = _step7.value;

					var environmentResult = copy.results[environmentName];
					var _iteratorNormalCompletion8 = true;
					var _didIteratorError8 = false;
					var _iteratorError8 = undefined;

					try {
						for (var _iterator8 = Object.keys(environmentResult)[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
							var resultName = _step8.value;

							var result = environmentResult[resultName];

							copy.results[environmentName][resultName] = {
								'name': resultName,
								'source': result.source.toString('utf-8'),
								'demoSource': result.demoSource ? result.demoSource.toString('utf-8') : '',
								'buffer': result.buffer.toString('utf-8'),
								'demoBuffer': result.demoBuffer ? result.demoBuffer.toString('utf-8') : '',
								'in': result['in'],
								'out': result.out
							};
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
				}
			} catch (err) {
				_didIteratorError7 = true;
				_iteratorError7 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion7 && _iterator7['return']) {
						_iterator7['return']();
					}
				} finally {
					if (_didIteratorError7) {
						throw _iteratorError7;
					}
				}
			}

			delete copy.cache;
			delete copy.files;
			delete copy.config;
			delete copy.base;
			delete copy.path;
			delete copy.transforms;

			return copy;
		}
	}], [{
		key: 'resolve',
		value: function resolve() {
			for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
			}

			return _path.resolve.apply(undefined, args);
		}
	}]);

	return Pattern;
})();

exports.Pattern = Pattern;

function patternFactory() {
	for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
		args[_key2] = arguments[_key2];
	}

	return regeneratorRuntime.async(function patternFactory$(context$1$0) {
		while (1) switch (context$1$0.prev = context$1$0.next) {
			case 0:
				context$1$0.next = 2;
				return regeneratorRuntime.awrap(new (_bind.apply(Pattern, [null].concat(args)))());

			case 2:
				return context$1$0.abrupt('return', context$1$0.sent);

			case 3:
			case 'end':
				return context$1$0.stop();
		}
	}, null, this);
}

// Add fake/virtual files if forced