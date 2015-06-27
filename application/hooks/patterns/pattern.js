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
		var filters = arguments[4] === undefined ? {} : arguments[4];
		var cache = arguments[5] === undefined ? null : arguments[5];

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
		this.filters = filters;
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
			var environmentsPath, results, environments, manifestPaths, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, manifestPath, _manifest, environmentName;

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
						manifestPaths = environments.filter(function (environment) {
							return (0, _path.basename)(environment) === 'pattern.json';
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
						environmentName = _manifest.name || (0, _path.dirname)(manifestPath);

						if (this.filters.environments && this.filters.environments.length > 0) {
							if (this.filters.environments.includes(environmentName)) {
								results[environmentName] = { manifest: _manifest };
							}
						} else {
							results[environmentName] = { manifest: _manifest };
						}

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
		key: 'readManifest',
		value: function readManifest() {
			var path = arguments[0] === undefined ? this.path : arguments[0];
			var fs = arguments[1] === undefined ? _qIoFs2['default'] : arguments[1];

			var manifestPath, manifestData, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, patternName, patternIDString, patternBaseName, patternBaseNameFragments, patternRange, patternID, pattern;

			return regeneratorRuntime.async(function readManifest$(context$2$0) {
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
						_iteratorNormalCompletion2 = true;
						_didIteratorError2 = false;
						_iteratorError2 = undefined;
						context$2$0.prev = 28;
						_iterator2 = Object.keys(this.manifest.patterns || {})[Symbol.iterator]();

					case 30:
						if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
							context$2$0.next = 53;
							break;
						}

						patternName = _step2.value;
						patternIDString = this.manifest.patterns[patternName];
						patternBaseName = (0, _path.basename)(patternIDString);
						patternBaseNameFragments = patternBaseName.split('@');
						patternRange = _semver2['default'].validRange(patternBaseNameFragments[1]) || '*';

						if (patternRange) {
							context$2$0.next = 38;
							break;
						}

						throw new Error('' + patternBaseNameFragments[1] + ' in ' + patternIDString + ' is no valid semver range.', {
							'file': this.path,
							'pattern': this.id
						});

					case 38:
						patternID = (0, _path.join)((0, _path.dirname)(patternIDString), patternBaseNameFragments[0]);
						pattern = new Pattern(patternID, this.base, this.config, this.transforms, this.filters, this.cache);
						context$2$0.next = 42;
						return regeneratorRuntime.awrap(pattern.read(pattern.path));

					case 42:
						this.dependencies[patternName] = context$2$0.sent;

						if (_semver2['default'].satisfies(pattern.manifest.version, patternRange)) {
							context$2$0.next = 50;
							break;
						}

						if (this.isEnvironment) {
							context$2$0.next = 48;
							break;
						}

						throw new Error('' + pattern.id + ' at version ' + pattern.manifest.version + ' does not satisfy range ' + patternRange + ' specified by ' + this.id + '.', {
							'file': pattern.path,
							'pattern': this.id
						});

					case 48:
						delete this.dependencies[patternName];
						console.warn('Omitting ' + pattern.id + ' at version ' + pattern.manifest.version + ' from build. It does not satisfy range ' + patternRange + ' specified by ' + this.id + '.');

					case 50:
						_iteratorNormalCompletion2 = true;
						context$2$0.next = 30;
						break;

					case 53:
						context$2$0.next = 59;
						break;

					case 55:
						context$2$0.prev = 55;
						context$2$0.t3 = context$2$0['catch'](28);
						_didIteratorError2 = true;
						_iteratorError2 = context$2$0.t3;

					case 59:
						context$2$0.prev = 59;
						context$2$0.prev = 60;

						if (!_iteratorNormalCompletion2 && _iterator2['return']) {
							_iterator2['return']();
						}

					case 62:
						context$2$0.prev = 62;

						if (!_didIteratorError2) {
							context$2$0.next = 65;
							break;
						}

						throw _iteratorError2;

					case 65:
						return context$2$0.finish(62);

					case 66:
						return context$2$0.finish(59);

					case 67:
						context$2$0.next = 69;
						return regeneratorRuntime.awrap(this.getLastModified());

					case 69:
						return context$2$0.abrupt('return', this);

					case 70:
					case 'end':
						return context$2$0.stop();
				}
			}, null, this, [[11, 19], [28, 55, 59, 67], [60,, 62, 66]]);
		}
	}, {
		key: 'read',
		value: function read() {
			var path = arguments[0] === undefined ? this.path : arguments[0];
			var fs = arguments[1] === undefined ? _qIoFs2['default'] : arguments[1];

			var readCacheID, cached, files, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, file, stat, _mtime, _name, data, ext, buffer, fileName, dependencyName, dependencyFile;

			return regeneratorRuntime.async(function read$(context$2$0) {
				while (1) switch (context$2$0.prev = context$2$0.next) {
					case 0:
						readCacheID = 'pattern:read:' + this.id;

						if (!(this.cache && this.cache.config.read)) {
							context$2$0.next = 6;
							break;
						}

						cached = this.cache.get(readCacheID, false);

						if (!cached) {
							context$2$0.next = 6;
							break;
						}

						Object.assign(this, cached);
						return context$2$0.abrupt('return', this);

					case 6:
						context$2$0.next = 8;
						return regeneratorRuntime.awrap(this.readManifest(path, fs));

					case 8:
						context$2$0.next = 10;
						return regeneratorRuntime.awrap(fs.listTree(path));

					case 10:
						files = context$2$0.sent;

						files = files.filter(function (fileName) {
							var ext = (0, _path.extname)(fileName);
							return ext && ['index', 'demo', 'pattern'].indexOf((0, _path.basename)(fileName, ext)) > -1;
						});

						_iteratorNormalCompletion3 = true;
						_didIteratorError3 = false;
						_iteratorError3 = undefined;
						context$2$0.prev = 15;
						_iterator3 = files[Symbol.iterator]();

					case 17:
						if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
							context$2$0.next = 36;
							break;
						}

						file = _step3.value;
						context$2$0.next = 21;
						return regeneratorRuntime.awrap(fs.stat(file));

					case 21:
						stat = context$2$0.sent;
						_mtime = stat.node.mtime;
						_name = (0, _path.basename)(file);
						data = this.cache ? this.cache.get(file, _mtime) : null;

						if (data) {
							context$2$0.next = 32;
							break;
						}

						ext = (0, _path.extname)(file);
						context$2$0.next = 29;
						return regeneratorRuntime.awrap(fs.read(file));

					case 29:
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

					case 32:

						this.files[_name] = data;

					case 33:
						_iteratorNormalCompletion3 = true;
						context$2$0.next = 17;
						break;

					case 36:
						context$2$0.next = 42;
						break;

					case 38:
						context$2$0.prev = 38;
						context$2$0.t0 = context$2$0['catch'](15);
						_didIteratorError3 = true;
						_iteratorError3 = context$2$0.t0;

					case 42:
						context$2$0.prev = 42;
						context$2$0.prev = 43;

						if (!_iteratorNormalCompletion3 && _iterator3['return']) {
							_iterator3['return']();
						}

					case 45:
						context$2$0.prev = 45;

						if (!_didIteratorError3) {
							context$2$0.next = 48;
							break;
						}

						throw _iteratorError3;

					case 48:
						return context$2$0.finish(45);

					case 49:
						return context$2$0.finish(42);

					case 50:
						context$2$0.t1 = regeneratorRuntime.keys(this.files);

					case 51:
						if ((context$2$0.t2 = context$2$0.t1()).done) {
							context$2$0.next = 60;
							break;
						}

						fileName = context$2$0.t2.value;
						file = this.files[fileName];

						file.dependencies = {};

						if (!(file.basename === 'demo')) {
							context$2$0.next = 57;
							break;
						}

						return context$2$0.abrupt('continue', 51);

					case 57:

						for (dependencyName in this.dependencies) {
							dependencyFile = this.dependencies[dependencyName].files[file.name];

							if (dependencyFile) {
								file.dependencies[dependencyName] = dependencyFile;
							}
						}
						context$2$0.next = 51;
						break;

					case 60:

						this.getLastModified();
						return context$2$0.abrupt('return', this);

					case 62:
					case 'end':
						return context$2$0.stop();
				}
			}, null, this, [[15, 38, 42, 50], [43,, 45, 49]]);
		}
	}, {
		key: 'transform',
		value: function transform() {
			var withDemos = arguments[0] === undefined ? true : arguments[0];
			var forced = arguments[1] === undefined ? false : arguments[1];

			var demos, fs, list, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, listItem, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, formatName, fileName, file, formatConfig, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, environmentName, environmentData, environment, _iteratorNormalCompletion7, _didIteratorError7, _iteratorError7, _iterator7, _step7, transforms, lastTransform, _iteratorNormalCompletion8, _didIteratorError8, _iteratorError8, _iterator8, _step8, transform, cacheID, cached, _mtime2, fn, environmentConfig, applicationConfig, configuration;

			return regeneratorRuntime.async(function transform$(context$2$0) {
				while (1) switch (context$2$0.prev = context$2$0.next) {
					case 0:
						context$2$0.next = 2;
						return regeneratorRuntime.awrap(this.readEnvironments());

					case 2:
						demos = {};

						if (!forced) {
							context$2$0.next = 70;
							break;
						}

						context$2$0.next = 6;
						return regeneratorRuntime.awrap(_qIoFs2['default'].mock(this.path));

					case 6:
						fs = context$2$0.sent;
						context$2$0.next = 9;
						return regeneratorRuntime.awrap(fs.makeTree(this.path));

					case 9:
						context$2$0.next = 11;
						return regeneratorRuntime.awrap(fs.listTree('/'));

					case 11:
						list = context$2$0.sent;
						_iteratorNormalCompletion4 = true;
						_didIteratorError4 = false;
						_iteratorError4 = undefined;
						context$2$0.prev = 15;
						_iterator4 = list[Symbol.iterator]();

					case 17:
						if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
							context$2$0.next = 27;
							break;
						}

						listItem = _step4.value;
						context$2$0.next = 21;
						return regeneratorRuntime.awrap(fs.isFile(listItem));

					case 21:
						if (!context$2$0.sent) {
							context$2$0.next = 24;
							break;
						}

						context$2$0.next = 24;
						return regeneratorRuntime.awrap(fs.rename(listItem, fs.join(this.path, fs.base(listItem))));

					case 24:
						_iteratorNormalCompletion4 = true;
						context$2$0.next = 17;
						break;

					case 27:
						context$2$0.next = 33;
						break;

					case 29:
						context$2$0.prev = 29;
						context$2$0.t0 = context$2$0['catch'](15);
						_didIteratorError4 = true;
						_iteratorError4 = context$2$0.t0;

					case 33:
						context$2$0.prev = 33;
						context$2$0.prev = 34;

						if (!_iteratorNormalCompletion4 && _iterator4['return']) {
							_iterator4['return']();
						}

					case 36:
						context$2$0.prev = 36;

						if (!_didIteratorError4) {
							context$2$0.next = 39;
							break;
						}

						throw _iteratorError4;

					case 39:
						return context$2$0.finish(36);

					case 40:
						return context$2$0.finish(33);

					case 41:
						_iteratorNormalCompletion5 = true;
						_didIteratorError5 = false;
						_iteratorError5 = undefined;
						context$2$0.prev = 44;
						_iterator5 = Object.keys(this.config.patterns.formats)[Symbol.iterator]();

					case 46:
						if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
							context$2$0.next = 54;
							break;
						}

						formatName = _step5.value;

						if (!this.config.patterns.formats[formatName].build) {
							context$2$0.next = 51;
							break;
						}

						context$2$0.next = 51;
						return regeneratorRuntime.awrap(fs.write((0, _path.resolve)(this.path, ['index', formatName].join('.')), '\n'));

					case 51:
						_iteratorNormalCompletion5 = true;
						context$2$0.next = 46;
						break;

					case 54:
						context$2$0.next = 60;
						break;

					case 56:
						context$2$0.prev = 56;
						context$2$0.t1 = context$2$0['catch'](44);
						_didIteratorError5 = true;
						_iteratorError5 = context$2$0.t1;

					case 60:
						context$2$0.prev = 60;
						context$2$0.prev = 61;

						if (!_iteratorNormalCompletion5 && _iterator5['return']) {
							_iterator5['return']();
						}

					case 63:
						context$2$0.prev = 63;

						if (!_didIteratorError5) {
							context$2$0.next = 66;
							break;
						}

						throw _iteratorError5;

					case 66:
						return context$2$0.finish(63);

					case 67:
						return context$2$0.finish(60);

					case 68:
						context$2$0.next = 70;
						return regeneratorRuntime.awrap(this.read(this.path, fs));

					case 70:
						if (!withDemos) {
							context$2$0.next = 83;
							break;
						}

						context$2$0.t2 = regeneratorRuntime.keys(this.files);

					case 72:
						if ((context$2$0.t3 = context$2$0.t2()).done) {
							context$2$0.next = 83;
							break;
						}

						fileName = context$2$0.t3.value;
						file = this.files[fileName];

						if (!(file.basename !== 'demo')) {
							context$2$0.next = 77;
							break;
						}

						return context$2$0.abrupt('continue', 72);

					case 77:
						formatConfig = this.config.patterns.formats[file.format];

						if (!(typeof formatConfig !== 'object')) {
							context$2$0.next = 80;
							break;
						}

						return context$2$0.abrupt('continue', 72);

					case 80:

						demos[formatConfig.name] = file;
						context$2$0.next = 72;
						break;

					case 83:
						_iteratorNormalCompletion6 = true;
						_didIteratorError6 = false;
						_iteratorError6 = undefined;
						context$2$0.prev = 86;
						_iterator6 = Object.keys(this.environments)[Symbol.iterator]();

					case 88:
						if (_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done) {
							context$2$0.next = 178;
							break;
						}

						environmentName = _step6.value;
						environmentData = this.environments[environmentName];
						environment = environmentData.manifest.environment || {};
						_iteratorNormalCompletion7 = true;
						_didIteratorError7 = false;
						_iteratorError7 = undefined;
						context$2$0.prev = 95;
						_iterator7 = Object.keys(this.files)[Symbol.iterator]();

					case 97:
						if (_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done) {
							context$2$0.next = 161;
							break;
						}

						fileName = _step7.value;
						file = this.files[fileName];

						if (!(file.basename === 'demo')) {
							context$2$0.next = 102;
							break;
						}

						return context$2$0.abrupt('continue', 158);

					case 102:
						formatConfig = this.config.patterns.formats[file.format];

						if (!(typeof formatConfig !== 'object')) {
							context$2$0.next = 105;
							break;
						}

						return context$2$0.abrupt('continue', 158);

					case 105:
						transforms = formatConfig.transforms || [];
						lastTransform = this.config.transforms[transforms[transforms.length - 1]] || {};

						if (!(!this.filters.formats || !this.filters.formats.length || this.filters.formats.includes(lastTransform.outFormat))) {
							context$2$0.next = 155;
							break;
						}

						_iteratorNormalCompletion8 = true;
						_didIteratorError8 = false;
						_iteratorError8 = undefined;
						context$2$0.prev = 111;
						_iterator8 = transforms[Symbol.iterator]();

					case 113:
						if (_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done) {
							context$2$0.next = 141;
							break;
						}

						transform = _step8.value;
						cacheID = 'file:transform:' + file.path + ':' + environmentName + ':' + transform;
						cached = undefined;
						_mtime2 = file.fs.node.mtime;

						if (this.cache && this.cache.config.transform) {
							cached = this.cache.get(cacheID, _mtime2);
							file = cached || file;
						}

						if (cached) {
							context$2$0.next = 138;
							break;
						}

						fn = this.transforms[transform];
						environmentConfig = environment[transform] || {};
						applicationConfig = this.config.transforms[transform] || {};
						configuration = (0, _lodashMerge2['default'])({}, applicationConfig, environmentConfig);
						context$2$0.prev = 124;
						context$2$0.next = 127;
						return regeneratorRuntime.awrap(fn(Object.assign({}, file), demos[formatConfig.name], configuration, forced));

					case 127:
						file = context$2$0.sent;

						if (this.cache && this.cache.config.transform) {
							this.cache.set(cacheID, _mtime2, file);
						}
						context$2$0.next = 138;
						break;

					case 131:
						context$2$0.prev = 131;
						context$2$0.t4 = context$2$0['catch'](124);

						context$2$0.t4.pattern = this.id;
						context$2$0.t4.file = context$2$0.t4.file || file.path;
						context$2$0.t4.transform = transform;
						console.error('Error while transforming file "' + context$2$0.t4.file + '" of pattern "' + context$2$0.t4.pattern + '" with transform "' + context$2$0.t4.transform + '".');
						throw context$2$0.t4;

					case 138:
						_iteratorNormalCompletion8 = true;
						context$2$0.next = 113;
						break;

					case 141:
						context$2$0.next = 147;
						break;

					case 143:
						context$2$0.prev = 143;
						context$2$0.t5 = context$2$0['catch'](111);
						_didIteratorError8 = true;
						_iteratorError8 = context$2$0.t5;

					case 147:
						context$2$0.prev = 147;
						context$2$0.prev = 148;

						if (!_iteratorNormalCompletion8 && _iterator8['return']) {
							_iterator8['return']();
						}

					case 150:
						context$2$0.prev = 150;

						if (!_didIteratorError8) {
							context$2$0.next = 153;
							break;
						}

						throw _iteratorError8;

					case 153:
						return context$2$0.finish(150);

					case 154:
						return context$2$0.finish(147);

					case 155:

						if (!this.results[environmentName]) {
							this.results[environmentName] = {};
						}

						file.out = file.out || lastTransform.outFormat || file.format;
						this.results[environmentName][formatConfig.name] = file;

					case 158:
						_iteratorNormalCompletion7 = true;
						context$2$0.next = 97;
						break;

					case 161:
						context$2$0.next = 167;
						break;

					case 163:
						context$2$0.prev = 163;
						context$2$0.t6 = context$2$0['catch'](95);
						_didIteratorError7 = true;
						_iteratorError7 = context$2$0.t6;

					case 167:
						context$2$0.prev = 167;
						context$2$0.prev = 168;

						if (!_iteratorNormalCompletion7 && _iterator7['return']) {
							_iterator7['return']();
						}

					case 170:
						context$2$0.prev = 170;

						if (!_didIteratorError7) {
							context$2$0.next = 173;
							break;
						}

						throw _iteratorError7;

					case 173:
						return context$2$0.finish(170);

					case 174:
						return context$2$0.finish(167);

					case 175:
						_iteratorNormalCompletion6 = true;
						context$2$0.next = 88;
						break;

					case 178:
						context$2$0.next = 184;
						break;

					case 180:
						context$2$0.prev = 180;
						context$2$0.t7 = context$2$0['catch'](86);
						_didIteratorError6 = true;
						_iteratorError6 = context$2$0.t7;

					case 184:
						context$2$0.prev = 184;
						context$2$0.prev = 185;

						if (!_iteratorNormalCompletion6 && _iterator6['return']) {
							_iterator6['return']();
						}

					case 187:
						context$2$0.prev = 187;

						if (!_didIteratorError6) {
							context$2$0.next = 190;
							break;
						}

						throw _iteratorError6;

					case 190:
						return context$2$0.finish(187);

					case 191:
						return context$2$0.finish(184);

					case 192:
						return context$2$0.abrupt('return', this);

					case 193:
					case 'end':
						return context$2$0.stop();
				}
			}, null, this, [[15, 29, 33, 41], [34,, 36, 40], [44, 56, 60, 68], [61,, 63, 67], [86, 180, 184, 192], [95, 163, 167, 175], [111, 143, 147, 155], [124, 131], [148,, 150, 154], [168,, 170, 174], [185,, 187, 191]]);
		}
	}, {
		key: 'getLastModified',
		value: function getLastModified() {
			var mtimes = [];

			// Already read
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
				for (var dependencyName in copy.dependencies) {
					var dependency = copy.dependencies[dependencyName];
					dependency = dependency.toJSON ? dependency.toJSON() : dependency;
				}
			}

			var _iteratorNormalCompletion9 = true;
			var _didIteratorError9 = false;
			var _iteratorError9 = undefined;

			try {
				for (var _iterator9 = Object.keys(copy.results)[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
					var environmentName = _step9.value;

					var environmentResult = copy.results[environmentName];
					var _iteratorNormalCompletion10 = true;
					var _didIteratorError10 = false;
					var _iteratorError10 = undefined;

					try {
						for (var _iterator10 = Object.keys(environmentResult)[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
							var resultName = _step10.value;

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
						_didIteratorError10 = true;
						_iteratorError10 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion10 && _iterator10['return']) {
								_iterator10['return']();
							}
						} finally {
							if (_didIteratorError10) {
								throw _iteratorError10;
							}
						}
					}
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

// Use the fast-track read cache from get-patterns if applicable

// Add fake/virtual files if forced

// Skip file transform if format filters present and not matching