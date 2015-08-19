'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
var _bind = Function.prototype.bind;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

// Find the newest mtime of a file dependency tree
function getLastModified(file) {
	var mtimes = [file.fs.node.mtime];

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = Object.keys(file.dependencies)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var dependencyName = _step.value;

			mtimes.push(getLastModified(file.dependencies[dependencyName]));
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator['return']) {
				_iterator['return']();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	return mtimes.sort(function (a, b) {
		return b - a;
	})[0];
}

var Pattern = (function () {
	function Pattern(id, base) {
		var config = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
		var transforms = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];
		var filters = arguments.length <= 4 || arguments[4] === undefined ? {} : arguments[4];
		var cache = arguments.length <= 5 || arguments[5] === undefined ? null : arguments[5];

		_classCallCheck(this, Pattern);

		this.files = {};
		this.config = {};
		this.manifest = {};
		this.dependencies = {};
		this.results = {};
		this.mtime = null;

		Object.assign(this, {
			id: id, base: base, cache: cache, config: config, transforms: transforms, filters: filters,
			path: Pattern.resolve(base, id),
			environments: {
				'index': {
					'manifest': { 'name': 'index' }
				}
			},
			isEnvironment: id.includes('@environment')
		});
	}

	_createClass(Pattern, [{
		key: 'readEnvironments',
		value: function readEnvironments() {
			var environmentsPath, results, environments, manifestPaths, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, manifestPath, manifest, environmentName;

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
						_iteratorNormalCompletion2 = true;
						_didIteratorError2 = false;
						_iteratorError2 = undefined;
						context$2$0.prev = 13;
						_iterator2 = manifestPaths[Symbol.iterator]();

					case 15:
						if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
							context$2$0.next = 30;
							break;
						}

						manifestPath = _step2.value;
						context$2$0.t0 = JSON;
						context$2$0.next = 20;
						return regeneratorRuntime.awrap(_qIoFs2['default'].read(manifestPath));

					case 20:
						context$2$0.t1 = context$2$0.sent;
						manifest = context$2$0.t0.parse.call(context$2$0.t0, context$2$0.t1);
						environmentName = manifest.name || (0, _path.dirname)(manifestPath);

						if (!(this.isEnvironment && environmentName !== (0, _path.basename)(this.id))) {
							context$2$0.next = 26;
							break;
						}

						if (environmentName in this.environments) {
							delete this.environments[environmentName];
						}
						return context$2$0.abrupt('continue', 27);

					case 26:

						if (this.filters.environments && this.filters.environments.length > 0) {
							if (this.filters.environments.includes(environmentName)) {
								results[environmentName] = { manifest: manifest };
							}
						} else {
							results[environmentName] = { manifest: manifest };
						}

					case 27:
						_iteratorNormalCompletion2 = true;
						context$2$0.next = 15;
						break;

					case 30:
						context$2$0.next = 36;
						break;

					case 32:
						context$2$0.prev = 32;
						context$2$0.t2 = context$2$0['catch'](13);
						_didIteratorError2 = true;
						_iteratorError2 = context$2$0.t2;

					case 36:
						context$2$0.prev = 36;
						context$2$0.prev = 37;

						if (!_iteratorNormalCompletion2 && _iterator2['return']) {
							_iterator2['return']();
						}

					case 39:
						context$2$0.prev = 39;

						if (!_didIteratorError2) {
							context$2$0.next = 42;
							break;
						}

						throw _iteratorError2;

					case 42:
						return context$2$0.finish(39);

					case 43:
						return context$2$0.finish(36);

					case 44:
						return context$2$0.abrupt('return', results);

					case 45:
					case 'end':
						return context$2$0.stop();
				}
			}, null, this, [[13, 32, 36, 44], [37,, 39, 43]]);
		}
	}, {
		key: 'readManifest',
		value: function readManifest() {
			var path = arguments.length <= 0 || arguments[0] === undefined ? this.path : arguments[0];
			var fs = arguments.length <= 1 || arguments[1] === undefined ? _qIoFs2['default'] : arguments[1];

			var manifestPath, manifestData, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, patternName, patternIDString, patternBaseName, patternBaseNameFragments, patternRange, patternID, pattern;

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
						context$2$0.t1 = JSON;
						context$2$0.next = 15;
						return regeneratorRuntime.awrap(fs.read(manifestPath));

					case 15:
						context$2$0.t2 = context$2$0.sent;
						manifestData = context$2$0.t1.parse.call(context$2$0.t1, context$2$0.t2);

						this.manifest = Object.assign({}, {
							'version': '0.1.0',
							'build': true,
							'display': true
						}, this.manifest, manifestData);
						context$2$0.next = 23;
						break;

					case 20:
						context$2$0.prev = 20;
						context$2$0.t3 = context$2$0['catch'](11);
						throw new Error('Error while reading pattern.json from ' + this.path, {
							'file': this.path,
							'pattern': this.id,
							'stack': context$2$0.t3.stack
						});

					case 23:
						if (!(this.isEnvironment && !this.manifest.patterns)) {
							context$2$0.next = 26;
							break;
						}

						context$2$0.next = 26;
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
											return Object.assign(results, _defineProperty({}, item, item + '@' + range));
										}, {});

									case 8:
									case 'end':
										return context$3$0.stop();
								}
							}, null, _this2);
						})());

					case 26:
						_iteratorNormalCompletion3 = true;
						_didIteratorError3 = false;
						_iteratorError3 = undefined;
						context$2$0.prev = 29;
						_iterator3 = Object.keys(this.manifest.patterns || {})[Symbol.iterator]();

					case 31:
						if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
							context$2$0.next = 54;
							break;
						}

						patternName = _step3.value;
						patternIDString = this.manifest.patterns[patternName];
						patternBaseName = (0, _path.basename)(patternIDString);
						patternBaseNameFragments = patternBaseName.split('@');
						patternRange = _semver2['default'].validRange(patternBaseNameFragments[1]) || '*';

						if (patternRange) {
							context$2$0.next = 39;
							break;
						}

						throw new Error(patternBaseNameFragments[1] + ' in ' + patternIDString + ' is no valid semver range.', {
							'file': this.path,
							'pattern': this.id
						});

					case 39:
						patternID = (0, _path.join)((0, _path.dirname)(patternIDString), patternBaseNameFragments[0]);
						pattern = new Pattern(patternID, this.base, this.config, this.transforms, this.filters, this.cache);
						context$2$0.next = 43;
						return regeneratorRuntime.awrap(pattern.read(pattern.path));

					case 43:
						this.dependencies[patternName] = context$2$0.sent;

						if (_semver2['default'].satisfies(pattern.manifest.version, patternRange)) {
							context$2$0.next = 51;
							break;
						}

						if (this.isEnvironment) {
							context$2$0.next = 49;
							break;
						}

						throw new Error(pattern.id + ' at version ' + pattern.manifest.version + ' does not satisfy range ' + patternRange + ' specified by ' + this.id + '.', {
							'file': pattern.path,
							'pattern': this.id
						});

					case 49:
						delete this.dependencies[patternName];
						console.warn('Omitting ' + pattern.id + ' at version ' + pattern.manifest.version + ' from build. It does not satisfy range ' + patternRange + ' specified by ' + this.id + '.');

					case 51:
						_iteratorNormalCompletion3 = true;
						context$2$0.next = 31;
						break;

					case 54:
						context$2$0.next = 60;
						break;

					case 56:
						context$2$0.prev = 56;
						context$2$0.t4 = context$2$0['catch'](29);
						_didIteratorError3 = true;
						_iteratorError3 = context$2$0.t4;

					case 60:
						context$2$0.prev = 60;
						context$2$0.prev = 61;

						if (!_iteratorNormalCompletion3 && _iterator3['return']) {
							_iterator3['return']();
						}

					case 63:
						context$2$0.prev = 63;

						if (!_didIteratorError3) {
							context$2$0.next = 66;
							break;
						}

						throw _iteratorError3;

					case 66:
						return context$2$0.finish(63);

					case 67:
						return context$2$0.finish(60);

					case 68:
						context$2$0.next = 70;
						return regeneratorRuntime.awrap(this.getLastModified());

					case 70:
						return context$2$0.abrupt('return', this);

					case 71:
					case 'end':
						return context$2$0.stop();
				}
			}, null, this, [[11, 20], [29, 56, 60, 68], [61,, 63, 67]]);
		}
	}, {
		key: 'read',
		value: function read() {
			var path = arguments.length <= 0 || arguments[0] === undefined ? this.path : arguments[0];
			var fs = arguments.length <= 1 || arguments[1] === undefined ? _qIoFs2['default'] : arguments[1];

			var readCacheID, cached, files, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, file, stat, mtime, _name, data, ext, buffer, fileName, dependencyName, dependencyFile;

			return regeneratorRuntime.async(function read$(context$2$0) {
				while (1) switch (context$2$0.prev = context$2$0.next) {
					case 0:
						readCacheID = 'pattern:read:' + this.id;

						if (!(this.cache && this.cache.config.read && !this.isEnvironment)) {
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

						_iteratorNormalCompletion4 = true;
						_didIteratorError4 = false;
						_iteratorError4 = undefined;
						context$2$0.prev = 15;
						_iterator4 = files[Symbol.iterator]();

					case 17:
						if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
							context$2$0.next = 36;
							break;
						}

						file = _step4.value;
						context$2$0.next = 21;
						return regeneratorRuntime.awrap(fs.stat(file));

					case 21:
						stat = context$2$0.sent;
						mtime = stat.node.mtime;
						_name = (0, _path.basename)(file);
						data = this.cache ? this.cache.get(file, mtime) : null;

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
							this.cache.set(file, mtime, data);
						}

					case 32:

						this.files[_name] = data;

					case 33:
						_iteratorNormalCompletion4 = true;
						context$2$0.next = 17;
						break;

					case 36:
						context$2$0.next = 42;
						break;

					case 38:
						context$2$0.prev = 38;
						context$2$0.t0 = context$2$0['catch'](15);
						_didIteratorError4 = true;
						_iteratorError4 = context$2$0.t0;

					case 42:
						context$2$0.prev = 42;
						context$2$0.prev = 43;

						if (!_iteratorNormalCompletion4 && _iterator4['return']) {
							_iterator4['return']();
						}

					case 45:
						context$2$0.prev = 45;

						if (!_didIteratorError4) {
							context$2$0.next = 48;
							break;
						}

						throw _iteratorError4;

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
			var withDemos = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
			var forced = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

			var demos, fs, list, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, listItem, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, formatName, fileName, file, formatConfig, _iteratorNormalCompletion7, _didIteratorError7, _iteratorError7, _iterator7, _step7, environmentName, environmentData, environment, _iteratorNormalCompletion8, _didIteratorError8, _iteratorError8, _iterator8, _step8, transforms, lastTransform, _iteratorNormalCompletion9, _didIteratorError9, _iteratorError9, _iterator9, _step9, transform, cacheID, cached, demo, mtime, fn, environmentConfig, applicationConfig, configuration;

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
						_iteratorNormalCompletion5 = true;
						_didIteratorError5 = false;
						_iteratorError5 = undefined;
						context$2$0.prev = 15;
						_iterator5 = list[Symbol.iterator]();

					case 17:
						if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
							context$2$0.next = 27;
							break;
						}

						listItem = _step5.value;
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
						_iteratorNormalCompletion5 = true;
						context$2$0.next = 17;
						break;

					case 27:
						context$2$0.next = 33;
						break;

					case 29:
						context$2$0.prev = 29;
						context$2$0.t0 = context$2$0['catch'](15);
						_didIteratorError5 = true;
						_iteratorError5 = context$2$0.t0;

					case 33:
						context$2$0.prev = 33;
						context$2$0.prev = 34;

						if (!_iteratorNormalCompletion5 && _iterator5['return']) {
							_iterator5['return']();
						}

					case 36:
						context$2$0.prev = 36;

						if (!_didIteratorError5) {
							context$2$0.next = 39;
							break;
						}

						throw _iteratorError5;

					case 39:
						return context$2$0.finish(36);

					case 40:
						return context$2$0.finish(33);

					case 41:
						_iteratorNormalCompletion6 = true;
						_didIteratorError6 = false;
						_iteratorError6 = undefined;
						context$2$0.prev = 44;
						_iterator6 = Object.keys(this.config.patterns.formats)[Symbol.iterator]();

					case 46:
						if (_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done) {
							context$2$0.next = 54;
							break;
						}

						formatName = _step6.value;

						if (!this.config.patterns.formats[formatName].build) {
							context$2$0.next = 51;
							break;
						}

						context$2$0.next = 51;
						return regeneratorRuntime.awrap(fs.write((0, _path.resolve)(this.path, ['index', formatName].join('.')), '\n'));

					case 51:
						_iteratorNormalCompletion6 = true;
						context$2$0.next = 46;
						break;

					case 54:
						context$2$0.next = 60;
						break;

					case 56:
						context$2$0.prev = 56;
						context$2$0.t1 = context$2$0['catch'](44);
						_didIteratorError6 = true;
						_iteratorError6 = context$2$0.t1;

					case 60:
						context$2$0.prev = 60;
						context$2$0.prev = 61;

						if (!_iteratorNormalCompletion6 && _iterator6['return']) {
							_iterator6['return']();
						}

					case 63:
						context$2$0.prev = 63;

						if (!_didIteratorError6) {
							context$2$0.next = 66;
							break;
						}

						throw _iteratorError6;

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
						_iteratorNormalCompletion7 = true;
						_didIteratorError7 = false;
						_iteratorError7 = undefined;
						context$2$0.prev = 86;
						_iterator7 = Object.keys(this.environments)[Symbol.iterator]();

					case 88:
						if (_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done) {
							context$2$0.next = 180;
							break;
						}

						environmentName = _step7.value;
						environmentData = this.environments[environmentName];
						environment = environmentData.manifest.environment || {};
						_iteratorNormalCompletion8 = true;
						_didIteratorError8 = false;
						_iteratorError8 = undefined;
						context$2$0.prev = 95;
						_iterator8 = Object.keys(this.files)[Symbol.iterator]();

					case 97:
						if (_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done) {
							context$2$0.next = 163;
							break;
						}

						fileName = _step8.value;
						file = this.files[fileName];

						if (!(file.basename === 'demo')) {
							context$2$0.next = 102;
							break;
						}

						return context$2$0.abrupt('continue', 160);

					case 102:
						formatConfig = this.config.patterns.formats[file.format];

						if (!(typeof formatConfig !== 'object')) {
							context$2$0.next = 105;
							break;
						}

						return context$2$0.abrupt('continue', 160);

					case 105:
						transforms = formatConfig.transforms || [];
						lastTransform = this.config.transforms[transforms[transforms.length - 1]] || {};

						if (!(!this.filters.formats || !this.filters.formats.length || this.filters.formats.includes(lastTransform.outFormat))) {
							context$2$0.next = 157;
							break;
						}

						_iteratorNormalCompletion9 = true;
						_didIteratorError9 = false;
						_iteratorError9 = undefined;
						context$2$0.prev = 111;
						_iterator9 = transforms[Symbol.iterator]();

					case 113:
						if (_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done) {
							context$2$0.next = 143;
							break;
						}

						transform = _step9.value;
						cacheID = 'file:transform:' + file.path + ':' + environmentName + ':' + transform;
						cached = undefined;
						demo = demos[formatConfig.name];
						mtime = getLastModified(file);

						// Use latest demo or file mtime
						if (demo) {
							mtime = Math.max(mtime, getLastModified(demo));
						}

						if (this.cache && this.cache.config.transform) {
							cached = this.cache.get(cacheID, mtime);
							file = cached || file;
						}

						if (cached) {
							context$2$0.next = 140;
							break;
						}

						fn = this.transforms[transform];
						environmentConfig = environment[transform] || {};
						applicationConfig = this.config.transforms[transform] || {};
						configuration = (0, _lodashMerge2['default'])({}, applicationConfig, environmentConfig);
						context$2$0.prev = 126;
						context$2$0.next = 129;
						return regeneratorRuntime.awrap(fn(Object.assign({}, file), demo, configuration, forced));

					case 129:
						file = context$2$0.sent;

						if (this.cache && this.cache.config.transform && !this.isEnvironment) {
							this.cache.set(cacheID, mtime, file);
						}
						context$2$0.next = 140;
						break;

					case 133:
						context$2$0.prev = 133;
						context$2$0.t4 = context$2$0['catch'](126);

						context$2$0.t4.pattern = this.id;
						context$2$0.t4.file = context$2$0.t4.file || file.path;
						context$2$0.t4.transform = transform;
						console.error('Error while transforming file "' + context$2$0.t4.file + '" of pattern "' + context$2$0.t4.pattern + '" with transform "' + context$2$0.t4.transform + '".');
						throw context$2$0.t4;

					case 140:
						_iteratorNormalCompletion9 = true;
						context$2$0.next = 113;
						break;

					case 143:
						context$2$0.next = 149;
						break;

					case 145:
						context$2$0.prev = 145;
						context$2$0.t5 = context$2$0['catch'](111);
						_didIteratorError9 = true;
						_iteratorError9 = context$2$0.t5;

					case 149:
						context$2$0.prev = 149;
						context$2$0.prev = 150;

						if (!_iteratorNormalCompletion9 && _iterator9['return']) {
							_iterator9['return']();
						}

					case 152:
						context$2$0.prev = 152;

						if (!_didIteratorError9) {
							context$2$0.next = 155;
							break;
						}

						throw _iteratorError9;

					case 155:
						return context$2$0.finish(152);

					case 156:
						return context$2$0.finish(149);

					case 157:

						if (!this.results[environmentName]) {
							this.results[environmentName] = {};
						}

						file.out = file.out || lastTransform.outFormat || file.format;
						this.results[environmentName][formatConfig.name] = file;

					case 160:
						_iteratorNormalCompletion8 = true;
						context$2$0.next = 97;
						break;

					case 163:
						context$2$0.next = 169;
						break;

					case 165:
						context$2$0.prev = 165;
						context$2$0.t6 = context$2$0['catch'](95);
						_didIteratorError8 = true;
						_iteratorError8 = context$2$0.t6;

					case 169:
						context$2$0.prev = 169;
						context$2$0.prev = 170;

						if (!_iteratorNormalCompletion8 && _iterator8['return']) {
							_iterator8['return']();
						}

					case 172:
						context$2$0.prev = 172;

						if (!_didIteratorError8) {
							context$2$0.next = 175;
							break;
						}

						throw _iteratorError8;

					case 175:
						return context$2$0.finish(172);

					case 176:
						return context$2$0.finish(169);

					case 177:
						_iteratorNormalCompletion7 = true;
						context$2$0.next = 88;
						break;

					case 180:
						context$2$0.next = 186;
						break;

					case 182:
						context$2$0.prev = 182;
						context$2$0.t7 = context$2$0['catch'](86);
						_didIteratorError7 = true;
						_iteratorError7 = context$2$0.t7;

					case 186:
						context$2$0.prev = 186;
						context$2$0.prev = 187;

						if (!_iteratorNormalCompletion7 && _iterator7['return']) {
							_iterator7['return']();
						}

					case 189:
						context$2$0.prev = 189;

						if (!_didIteratorError7) {
							context$2$0.next = 192;
							break;
						}

						throw _iteratorError7;

					case 192:
						return context$2$0.finish(189);

					case 193:
						return context$2$0.finish(186);

					case 194:
						return context$2$0.abrupt('return', this);

					case 195:
					case 'end':
						return context$2$0.stop();
				}
			}, null, this, [[15, 29, 33, 41], [34,, 36, 40], [44, 56, 60, 68], [61,, 63, 67], [86, 182, 186, 194], [95, 165, 169, 177], [111, 145, 149, 157], [126, 133], [150,, 152, 156], [170,, 172, 176], [187,, 189, 193]]);
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

			var _iteratorNormalCompletion10 = true;
			var _didIteratorError10 = false;
			var _iteratorError10 = undefined;

			try {
				for (var _iterator10 = Object.keys(copy.results)[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
					var environmentName = _step10.value;

					var environmentResult = copy.results[environmentName];
					var _iteratorNormalCompletion11 = true;
					var _didIteratorError11 = false;
					var _iteratorError11 = undefined;

					try {
						for (var _iterator11 = Object.keys(environmentResult)[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
							var resultName = _step11.value;

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
						_didIteratorError11 = true;
						_iteratorError11 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion11 && _iterator11['return']) {
								_iterator11['return']();
							}
						} finally {
							if (_didIteratorError11) {
								throw _iteratorError11;
							}
						}
					}
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
			return _path.resolve.apply(undefined, arguments);
		}
	}]);

	return Pattern;
})();

exports.Pattern = Pattern;

exports['default'] = function patternFactory() {
	for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
		args[_key] = arguments[_key];
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
};

// Use the fast-track read cache from get-patterns if applicable

// Add fake/virtual files if forced

// Skip file transform if format filters present and not matching
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NvdXJjZS9hcHBsaWNhdGlvbi9ob29rcy9wYXR0ZXJucy9wYXR0ZXJuLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztvQkFBd0QsTUFBTTs7cUJBRTlDLFNBQVM7Ozs7c0JBQ04sUUFBUTs7OzsyQkFDVCxjQUFjOzs7O3lCQUNWLFdBQVc7Ozs7O0FBR2pDLFNBQVMsZUFBZSxDQUFDLElBQUksRUFBRTtBQUM5QixLQUFJLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDOzs7Ozs7O0FBRWxDLHVCQUEyQixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsOEhBQUU7T0FBbEQsY0FBYzs7QUFDdEIsU0FBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7R0FDaEU7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFRCxRQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQztTQUFLLENBQUMsR0FBRyxDQUFDO0VBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQ3ZDOztJQUVZLE9BQU87QUFRUixVQVJDLE9BQU8sQ0FRUCxFQUFFLEVBQUUsSUFBSSxFQUE0RDtNQUExRCxNQUFNLHlEQUFHLEVBQUU7TUFBRSxVQUFVLHlEQUFHLEVBQUU7TUFBRSxPQUFPLHlEQUFHLEVBQUU7TUFBRSxLQUFLLHlEQUFHLElBQUk7O3dCQVJsRSxPQUFPOztPQUNuQixLQUFLLEdBQUcsRUFBRTtPQUNWLE1BQU0sR0FBRyxFQUFFO09BQ1gsUUFBUSxHQUFHLEVBQUU7T0FDYixZQUFZLEdBQUcsRUFBRTtPQUNqQixPQUFPLEdBQUcsRUFBRTtPQUNaLEtBQUssR0FBRyxJQUFJOztBQUdYLFFBQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFO0FBQ25CLEtBQUUsRUFB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ZUFBZSxDQUFDLENBQUMsVUFBVSxDQUFDLEdBQUc7QUFDM0MsY0FBTSxFQUFFLFVBQVU7QUFDbEIsZ0JBQVEsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7QUFDekMsb0JBQVksRUFBRSxNQUFNLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUU7QUFDMUUsZ0JBQVEsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7QUFDekMsb0JBQVksRUFBRSxNQUFNLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUU7QUFDMUUsWUFBSSxFQUFFLE1BQU0sTUFBRztBQUNmLGFBQUssRUFBRSxNQUFNLENBQUMsR0FBRztRQUNqQixDQUFDO09BQ0Y7Ozs7Ozs7Ozs7Ozs7OztLQUNGOzs7Ozs7Ozs7Ozs7Ozs7O0FBRUQsVUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQ2xCLFVBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztBQUNsQixVQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDbkIsVUFBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ2pCLFVBQU8sSUFBSSxDQUFDLElBQUksQ0FBQztBQUNqQixVQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7O0FBRXZCLFVBQU8sSUFBSSxDQUFDO0dBQ1o7OztTQXBYYSxtQkFBVTtBQUN2QixVQUFPLHlDQUFnQixDQUFDO0dBQ3hCOzs7UUF2QlcsT0FBTzs7Ozs7cUJBNllMLFNBQWUsY0FBYzttQ0FBSSxJQUFJO0FBQUosTUFBSTs7Ozs7OztxREFDbEMsT0FBTyxnQkFBSSxJQUFJOzs7Ozs7Ozs7O0NBQ2hDIiwiZmlsZSI6InBhdHRlcm4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge3Jlc29sdmUsIGJhc2VuYW1lLCBleHRuYW1lLCBkaXJuYW1lLCBqb2lufSBmcm9tICdwYXRoJztcblxuaW1wb3J0IHFmcyBmcm9tICdxLWlvL2ZzJztcbmltcG9ydCBzZW12ZXIgZnJvbSAnc2VtdmVyJztcbmltcG9ydCBtZXJnZSBmcm9tICdsb2Rhc2gubWVyZ2UnO1xuaW1wb3J0IG1pbmltYXRjaCBmcm9tICdtaW5pbWF0Y2gnO1xuXG4vLyBGaW5kIHRoZSBuZXdlc3QgbXRpbWUgb2YgYSBmaWxlIGRlcGVuZGVuY3kgdHJlZVxuZnVuY3Rpb24gZ2V0TGFzdE1vZGlmaWVkKGZpbGUpIHtcblx0bGV0IG10aW1lcyA9IFtmaWxlLmZzLm5vZGUubXRpbWVdO1xuXG5cdGZvciAobGV0IGRlcGVuZGVuY3lOYW1lIG9mIE9iamVjdC5rZXlzKGZpbGUuZGVwZW5kZW5jaWVzKSkge1xuXHRcdG10aW1lcy5wdXNoKGdldExhc3RNb2RpZmllZChmaWxlLmRlcGVuZGVuY2llc1tkZXBlbmRlbmN5TmFtZV0pKTtcblx0fVxuXG5cdHJldHVybiBtdGltZXMuc29ydCgoYSwgYikgPT4gYiAtIGEpWzBdO1xufVxuXG5leHBvcnQgY2xhc3MgUGF0dGVybiB7XG5cdGZpbGVzID0ge307XG5cdGNvbmZpZyA9IHt9O1xuXHRtYW5pZmVzdCA9IHt9O1xuXHRkZXBlbmRlbmNpZXMgPSB7fTtcblx0cmVzdWx0cyA9IHt9O1xuXHRtdGltZSA9IG51bGw7XG5cblx0Y29uc3RydWN0b3IoaWQsIGJhc2UsIGNvbmZpZyA9IHt9LCB0cmFuc2Zvcm1zID0ge30sIGZpbHRlcnMgPSB7fSwgY2FjaGUgPSBudWxsKSB7XG5cdFx0T2JqZWN0LmFzc2lnbih0aGlzLCB7XG5cdFx0XHRpZCwgYmFzZSwgY2FjaGUsIGNvbmZpZywgdHJhbnNmb3JtcywgZmlsdGVycyxcblx0XHRcdHBhdGg6IFBhdHRlcm4ucmVzb2x2ZShiYXNlLCBpZCksXG5cdFx0XHRlbnZpcm9ubWVudHM6IHtcblx0XHRcdFx0J2luZGV4Jzoge1xuXHRcdFx0XHRcdCdtYW5pZmVzdCc6IHsgJ25hbWUnOiAnaW5kZXgnIH1cblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGlzRW52aXJvbm1lbnQ6IGlkLmluY2x1ZGVzKCdAZW52aXJvbm1lbnQnKVxuXHRcdH0pO1xuXHR9XG5cblx0c3RhdGljIHJlc29sdmUoLi4uYXJncykge1xuXHRcdHJldHVybiByZXNvbHZlKC4uLmFyZ3MpO1xuXHR9XG5cblx0YXN5bmMgcmVhZEVudmlyb25tZW50cygpIHtcblx0XHRsZXQgZW52aXJvbm1lbnRzUGF0aCA9IHJlc29sdmUodGhpcy5iYXNlLCAnQGVudmlyb25tZW50cycpO1xuXHRcdGxldCByZXN1bHRzID0gdGhpcy5lbnZpcm9ubWVudHM7XG5cblx0XHRpZiAoICFhd2FpdCBxZnMuZXhpc3RzKGVudmlyb25tZW50c1BhdGgpKSB7XG5cdFx0XHRyZXR1cm4gcmVzdWx0cztcblx0XHR9XG5cblx0XHRsZXQgZW52aXJvbm1lbnRzID0gYXdhaXQgcWZzLmxpc3RUcmVlKGVudmlyb25tZW50c1BhdGgpO1xuXHRcdGxldCBtYW5pZmVzdFBhdGhzID0gZW52aXJvbm1lbnRzXG5cdFx0XHQuZmlsdGVyKChlbnZpcm9ubWVudCkgPT4gYmFzZW5hbWUoZW52aXJvbm1lbnQpID09PSAncGF0dGVybi5qc29uJyk7XG5cblx0XHRmb3IgKGxldCBtYW5pZmVzdFBhdGggb2YgbWFuaWZlc3RQYXRocykge1xuXHRcdFx0bGV0IG1hbmlmZXN0ID0gSlNPTi5wYXJzZShhd2FpdCBxZnMucmVhZChtYW5pZmVzdFBhdGgpKTtcblx0XHRcdGxldCBlbnZpcm9ubWVudE5hbWUgPSBtYW5pZmVzdC5uYW1lIHx8IGRpcm5hbWUobWFuaWZlc3RQYXRoKTtcblxuXHRcdFx0aWYgKHRoaXMuaXNFbnZpcm9ubWVudCAmJiBlbnZpcm9ubWVudE5hbWUgIT09IGJhc2VuYW1lKHRoaXMuaWQpKSB7XG5cdFx0XHRcdGlmIChlbnZpcm9ubWVudE5hbWUgaW4gdGhpcy5lbnZpcm9ubWVudHMpIHtcblx0XHRcdFx0XHRkZWxldGUgdGhpcy5lbnZpcm9ubWVudHNbZW52aXJvbm1lbnROYW1lXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHRoaXMuZmlsdGVycy5lbnZpcm9ubWVudHMgJiYgdGhpcy5maWx0ZXJzLmVudmlyb25tZW50cy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdGlmICh0aGlzLmZpbHRlcnMuZW52aXJvbm1lbnRzLmluY2x1ZGVzKGVudmlyb25tZW50TmFtZSkpIHtcblx0XHRcdFx0XHRyZXN1bHRzW2Vudmlyb25tZW50TmFtZV0gPSB7IG1hbmlmZXN0IH07XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJlc3VsdHNbZW52aXJvbm1lbnROYW1lXSA9IHsgbWFuaWZlc3QgfTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzdWx0cztcblx0fVxuXG5cdGFzeW5jIHJlYWRNYW5pZmVzdChwYXRoID0gdGhpcy5wYXRoLCBmcyA9IHFmcykge1xuXHRcdGZzLmV4aXN0cyA9IGZzLmV4aXN0cy5iaW5kKGZzKTtcblxuXHRcdGlmICggYXdhaXQgZnMuZXhpc3RzKHBhdGgpICE9PSB0cnVlICkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBDYW4gbm90IHJlYWQgcGF0dGVybiBmcm9tICR7dGhpcy5wYXRofSwgaXQgZG9lcyBub3QgZXhpc3QuYCwge1xuXHRcdFx0XHQnZmlsZU5hbWUnOiB0aGlzLnBhdGgsXG5cdFx0XHRcdCdwYXR0ZXJuJzogdGhpcy5pZFxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0bGV0IG1hbmlmZXN0UGF0aCA9IHJlc29sdmUodGhpcy5wYXRoLCAncGF0dGVybi5qc29uJyk7XG5cblx0XHRpZiAoIWF3YWl0IGZzLmV4aXN0cyhtYW5pZmVzdFBhdGgpKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYENhbiBub3QgcmVhZCBwYXR0ZXJuLmpzb24gZnJvbSAke3RoaXMucGF0aH0sIGl0IGRvZXMgbm90IGV4aXN0LmAsIHtcblx0XHRcdFx0J2ZpbGVOYW1lJzogdGhpcy5wYXRoLFxuXHRcdFx0XHQncGF0dGVybic6IHRoaXMuaWRcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHRyeSB7XG5cdFx0XHRsZXQgbWFuaWZlc3REYXRhID0gSlNPTi5wYXJzZShhd2FpdCBmcy5yZWFkKG1hbmlmZXN0UGF0aCkpO1xuXHRcdFx0dGhpcy5tYW5pZmVzdCA9IE9iamVjdC5hc3NpZ24oe30sIHtcblx0XHRcdFx0J3ZlcnNpb24nOiAnMC4xLjAnLFxuXHRcdFx0XHQnYnVpbGQnOiB0cnVlLFxuXHRcdFx0XHQnZGlzcGxheSc6IHRydWVcblx0XHRcdH0sIHRoaXMubWFuaWZlc3QsIG1hbmlmZXN0RGF0YSk7XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgRXJyb3Igd2hpbGUgcmVhZGluZyBwYXR0ZXJuLmpzb24gZnJvbSAke3RoaXMucGF0aH1gLCB7XG5cdFx0XHRcdCdmaWxlJzogdGhpcy5wYXRoLFxuXHRcdFx0XHQncGF0dGVybic6IHRoaXMuaWQsXG5cdFx0XHRcdCdzdGFjayc6IGVycm9yLnN0YWNrXG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5pc0Vudmlyb25tZW50ICYmICF0aGlzLm1hbmlmZXN0LnBhdHRlcm5zKSB7XG5cdFx0XHRsZXQgbGlzdCA9IGF3YWl0IHFmcy5saXN0VHJlZSh0aGlzLmJhc2UpO1xuXHRcdFx0bGV0IHJhbmdlID0gdGhpcy5tYW5pZmVzdC5yYW5nZSB8fCAnKic7XG5cblx0XHRcdGxpc3QgPSBsaXN0XG5cdFx0XHRcdC5maWx0ZXIoKGl0ZW0pID0+IGJhc2VuYW1lKGl0ZW0pID09PSAncGF0dGVybi5qc29uJylcblx0XHRcdFx0LmZpbHRlcigoaXRlbSkgPT4gIWl0ZW0uaW5jbHVkZXMoJ0BlbnZpcm9ubWVudCcpKVxuXHRcdFx0XHQubWFwKChpdGVtKSA9PiBxZnMucmVsYXRpdmVGcm9tRGlyZWN0b3J5KHRoaXMuYmFzZSwgZGlybmFtZShpdGVtKSkpXG5cdFx0XHRcdC5maWx0ZXIoKGl0ZW0pID0+IGl0ZW0gIT09IHRoaXMuaWQpO1xuXG5cdFx0XHRpZiAodGhpcy5tYW5pZmVzdC5pbmNsdWRlKSB7XG5cdFx0XHRcdGxpc3QgPSBsaXN0LmZpbHRlcigoaXRlbSkgPT4gbWluaW1hdGNoKGl0ZW0sIHRoaXMubWFuaWZlc3QuaW5jbHVkZS5qb2luKCd8JykpKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHRoaXMubWFuaWZlc3QuZXhjbHVkZSkge1xuXHRcdFx0XHRsaXN0ID0gbGlzdC5maWx0ZXIoKGl0ZW0pID0+ICFtaW5pbWF0Y2goaXRlbSwgdGhpcy5tYW5pZmVzdC5leGNsdWRlLmpvaW4oJ3wnKSkpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLm1hbmlmZXN0LnBhdHRlcm5zID0gbGlzdC5yZWR1Y2UoKHJlc3VsdHMsIGl0ZW0pID0+IE9iamVjdC5hc3NpZ24ocmVzdWx0cywge1tpdGVtXTogYCR7aXRlbX1AJHtyYW5nZX1gfSksIHt9KTtcblx0XHR9XG5cblx0XHRmb3IgKGxldCBwYXR0ZXJuTmFtZSBvZiBPYmplY3Qua2V5cyh0aGlzLm1hbmlmZXN0LnBhdHRlcm5zIHx8IHt9KSkge1xuXHRcdFx0bGV0IHBhdHRlcm5JRFN0cmluZyA9IHRoaXMubWFuaWZlc3QucGF0dGVybnNbcGF0dGVybk5hbWVdO1xuXHRcdFx0bGV0IHBhdHRlcm5CYXNlTmFtZSA9IGJhc2VuYW1lKHBhdHRlcm5JRFN0cmluZyk7XG5cdFx0XHRsZXQgcGF0dGVybkJhc2VOYW1lRnJhZ21lbnRzID0gcGF0dGVybkJhc2VOYW1lLnNwbGl0KCdAJyk7XG5cdFx0XHRsZXQgcGF0dGVyblJhbmdlID0gc2VtdmVyLnZhbGlkUmFuZ2UocGF0dGVybkJhc2VOYW1lRnJhZ21lbnRzWzFdKSB8fCAnKic7XG5cblx0XHRcdGlmICghcGF0dGVyblJhbmdlKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgJHtwYXR0ZXJuQmFzZU5hbWVGcmFnbWVudHNbMV19IGluICR7cGF0dGVybklEU3RyaW5nfSBpcyBubyB2YWxpZCBzZW12ZXIgcmFuZ2UuYCwge1xuXHRcdFx0XHRcdCdmaWxlJzogdGhpcy5wYXRoLFxuXHRcdFx0XHRcdCdwYXR0ZXJuJzogdGhpcy5pZFxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0bGV0IHBhdHRlcm5JRCA9IGpvaW4oZGlybmFtZShwYXR0ZXJuSURTdHJpbmcpLCBwYXR0ZXJuQmFzZU5hbWVGcmFnbWVudHNbMF0pO1xuXHRcdFx0bGV0IHBhdHRlcm4gPSBuZXcgUGF0dGVybihwYXR0ZXJuSUQsIHRoaXMuYmFzZSwgdGhpcy5jb25maWcsIHRoaXMudHJhbnNmb3JtcywgdGhpcy5maWx0ZXJzLCB0aGlzLmNhY2hlKTtcblxuXHRcdFx0dGhpcy5kZXBlbmRlbmNpZXNbcGF0dGVybk5hbWVdID0gYXdhaXQgcGF0dGVybi5yZWFkKHBhdHRlcm4ucGF0aCk7XG5cblx0XHRcdGlmICghc2VtdmVyLnNhdGlzZmllcyhwYXR0ZXJuLm1hbmlmZXN0LnZlcnNpb24sIHBhdHRlcm5SYW5nZSkpIHtcblx0XHRcdFx0aWYgKCF0aGlzLmlzRW52aXJvbm1lbnQpIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYCR7cGF0dGVybi5pZH0gYXQgdmVyc2lvbiAke3BhdHRlcm4ubWFuaWZlc3QudmVyc2lvbn0gZG9lcyBub3Qgc2F0aXNmeSByYW5nZSAke3BhdHRlcm5SYW5nZX0gc3BlY2lmaWVkIGJ5ICR7dGhpcy5pZH0uYCwge1xuXHRcdFx0XHRcdFx0J2ZpbGUnOiBwYXR0ZXJuLnBhdGgsXG5cdFx0XHRcdFx0XHQncGF0dGVybic6IHRoaXMuaWRcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRkZWxldGUgdGhpcy5kZXBlbmRlbmNpZXNbcGF0dGVybk5hbWVdO1xuXHRcdFx0XHRcdGNvbnNvbGUud2FybihgT21pdHRpbmcgJHtwYXR0ZXJuLmlkfSBhdCB2ZXJzaW9uICR7cGF0dGVybi5tYW5pZmVzdC52ZXJzaW9ufSBmcm9tIGJ1aWxkLiBJdCBkb2VzIG5vdCBzYXRpc2Z5IHJhbmdlICR7cGF0dGVyblJhbmdlfSBzcGVjaWZpZWQgYnkgJHt0aGlzLmlkfS5gKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGF3YWl0IHRoaXMuZ2V0TGFzdE1vZGlmaWVkKCk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHRhc3luYyByZWFkKHBhdGggPSB0aGlzLnBhdGgsIGZzID0gcWZzKSB7XG5cdFx0bGV0IHJlYWRDYWNoZUlEID0gYHBhdHRlcm46cmVhZDoke3RoaXMuaWR9YDtcblxuXHRcdC8vIFVzZSB0aGUgZmFzdC10cmFjayByZWFkIGNhY2hlIGZyb20gZ2V0LXBhdHRlcm5zIGlmIGFwcGxpY2FibGVcblx0XHRpZiAodGhpcy5jYWNoZSAmJiB0aGlzLmNhY2hlLmNvbmZpZy5yZWFkICYmICF0aGlzLmlzRW52aXJvbm1lbnQpIHtcblx0XHRcdGxldCBjYWNoZWQgPSB0aGlzLmNhY2hlLmdldChyZWFkQ2FjaGVJRCwgZmFsc2UpO1xuXG5cdFx0XHRpZiAoY2FjaGVkKSB7XG5cdFx0XHRcdE9iamVjdC5hc3NpZ24odGhpcywgY2FjaGVkKTtcblx0XHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0YXdhaXQgdGhpcy5yZWFkTWFuaWZlc3QocGF0aCwgZnMpO1xuXG5cdFx0bGV0IGZpbGVzID0gYXdhaXQgZnMubGlzdFRyZWUocGF0aCk7XG5cblx0XHRmaWxlcyA9IGZpbGVzLmZpbHRlcihmdW5jdGlvbihmaWxlTmFtZSl7XG5cdFx0XHRsZXQgZXh0ID0gZXh0bmFtZShmaWxlTmFtZSk7XG5cdFx0XHRyZXR1cm4gZXh0ICYmIFsnaW5kZXgnLCAnZGVtbycsICdwYXR0ZXJuJ10uaW5kZXhPZihiYXNlbmFtZShmaWxlTmFtZSwgZXh0KSkgPiAtMTtcblx0XHR9KTtcblxuXHRcdGZvciAobGV0IGZpbGUgb2YgZmlsZXMpIHtcblx0XHRcdGxldCBzdGF0ID0gYXdhaXQgZnMuc3RhdChmaWxlKTtcblx0XHRcdGxldCBtdGltZSA9IHN0YXQubm9kZS5tdGltZTtcblx0XHRcdGxldCBuYW1lID0gYmFzZW5hbWUoZmlsZSk7XG5cblx0XHRcdGxldCBkYXRhID0gdGhpcy5jYWNoZSA/IHRoaXMuY2FjaGUuZ2V0KGZpbGUsIG10aW1lKSA6IG51bGw7XG5cblx0XHRcdGlmICghZGF0YSkge1xuXHRcdFx0XHRsZXQgZXh0ID0gZXh0bmFtZShmaWxlKTtcblx0XHRcdFx0bGV0IGJ1ZmZlciA9IGF3YWl0IGZzLnJlYWQoZmlsZSk7XG5cblx0XHRcdFx0ZGF0YSA9IHtcblx0XHRcdFx0XHRidWZmZXIsXG5cdFx0XHRcdFx0bmFtZSxcblx0XHRcdFx0XHQnYmFzZW5hbWUnOiBiYXNlbmFtZShuYW1lLCBleHQpLFxuXHRcdFx0XHRcdCdleHQnOiBleHQsXG5cdFx0XHRcdFx0J2Zvcm1hdCc6IGV4dC5yZXBsYWNlKCcuJywgJycpLFxuXHRcdFx0XHRcdCdmcyc6IHN0YXQsXG5cdFx0XHRcdFx0J3BhdGgnOiBmaWxlLFxuXHRcdFx0XHRcdCdzb3VyY2UnOiBidWZmZXJcblx0XHRcdFx0fTtcblxuXHRcdFx0XHRpZiAodGhpcy5jYWNoZSkge1xuXHRcdFx0XHRcdHRoaXMuY2FjaGUuc2V0KGZpbGUsIG10aW1lLCBkYXRhKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLmZpbGVzW25hbWVdID0gZGF0YTtcblx0XHR9XG5cblx0XHRmb3IgKCBsZXQgZmlsZU5hbWUgaW4gdGhpcy5maWxlcyApIHtcblx0XHRcdGxldCBmaWxlID0gdGhpcy5maWxlc1tmaWxlTmFtZV07XG5cdFx0XHRmaWxlLmRlcGVuZGVuY2llcyA9IHt9O1xuXG5cdFx0XHRpZiAoIGZpbGUuYmFzZW5hbWUgPT09ICdkZW1vJyApIHtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdGZvciAobGV0IGRlcGVuZGVuY3lOYW1lIGluIHRoaXMuZGVwZW5kZW5jaWVzKSB7XG5cdFx0XHRcdGxldCBkZXBlbmRlbmN5RmlsZSA9IHRoaXMuZGVwZW5kZW5jaWVzW2RlcGVuZGVuY3lOYW1lXS5maWxlc1tmaWxlLm5hbWVdO1xuXG5cdFx0XHRcdGlmIChkZXBlbmRlbmN5RmlsZSkge1xuXHRcdFx0XHRcdGZpbGUuZGVwZW5kZW5jaWVzW2RlcGVuZGVuY3lOYW1lXSA9IGRlcGVuZGVuY3lGaWxlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy5nZXRMYXN0TW9kaWZpZWQoKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdGFzeW5jIHRyYW5zZm9ybSggd2l0aERlbW9zID0gdHJ1ZSwgZm9yY2VkID0gZmFsc2UgKSB7XG5cdFx0YXdhaXQgdGhpcy5yZWFkRW52aXJvbm1lbnRzKCk7XG5cblx0XHRsZXQgZGVtb3MgPSB7fTtcblxuXHRcdGlmIChmb3JjZWQpIHtcblx0XHRcdC8vIEFkZCBmYWtlL3ZpcnR1YWwgZmlsZXMgaWYgZm9yY2VkXG5cdFx0XHRsZXQgZnMgPSBhd2FpdCBxZnMubW9jayh0aGlzLnBhdGgpO1xuXHRcdFx0YXdhaXQgZnMubWFrZVRyZWUodGhpcy5wYXRoKTtcblxuXHRcdFx0bGV0IGxpc3QgPSBhd2FpdCBmcy5saXN0VHJlZSgnLycpO1xuXG5cdFx0XHRmb3IgKGxldCBsaXN0SXRlbSBvZiBsaXN0KSB7XG5cdFx0XHRcdGlmIChhd2FpdCBmcy5pc0ZpbGUobGlzdEl0ZW0pKSB7XG5cdFx0XHRcdFx0YXdhaXQgZnMucmVuYW1lKGxpc3RJdGVtLCBmcy5qb2luKHRoaXMucGF0aCwgZnMuYmFzZShsaXN0SXRlbSkpKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRmb3IgKGxldCBmb3JtYXROYW1lIG9mIE9iamVjdC5rZXlzKHRoaXMuY29uZmlnLnBhdHRlcm5zLmZvcm1hdHMpKSB7XG5cdFx0XHRcdGlmICggdGhpcy5jb25maWcucGF0dGVybnMuZm9ybWF0c1tmb3JtYXROYW1lXS5idWlsZCkge1xuXHRcdFx0XHRcdGF3YWl0IGZzLndyaXRlKHJlc29sdmUodGhpcy5wYXRoLCBbJ2luZGV4JywgZm9ybWF0TmFtZV0uam9pbignLicpKSwgJ1xcbicpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGF3YWl0IHRoaXMucmVhZCh0aGlzLnBhdGgsIGZzKTtcblx0XHR9XG5cblx0XHRpZiAod2l0aERlbW9zKSB7XG5cdFx0XHRmb3IgKCBsZXQgZmlsZU5hbWUgaW4gdGhpcy5maWxlcyApIHtcblx0XHRcdFx0bGV0IGZpbGUgPSB0aGlzLmZpbGVzW2ZpbGVOYW1lXTtcblxuXHRcdFx0XHRpZiAoIGZpbGUuYmFzZW5hbWUgIT09ICdkZW1vJyApIHtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGxldCBmb3JtYXRDb25maWcgPSB0aGlzLmNvbmZpZy5wYXR0ZXJucy5mb3JtYXRzW2ZpbGUuZm9ybWF0XTtcblxuXHRcdFx0XHRpZiAodHlwZW9mIGZvcm1hdENvbmZpZyAhPT0gJ29iamVjdCcpIHtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGRlbW9zW2Zvcm1hdENvbmZpZy5uYW1lXSA9IGZpbGU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Zm9yIChsZXQgZW52aXJvbm1lbnROYW1lIG9mIE9iamVjdC5rZXlzKHRoaXMuZW52aXJvbm1lbnRzKSkge1xuXHRcdFx0bGV0IGVudmlyb25tZW50RGF0YSA9IHRoaXMuZW52aXJvbm1lbnRzW2Vudmlyb25tZW50TmFtZV07XG5cdFx0XHRsZXQgZW52aXJvbm1lbnQgPSBlbnZpcm9ubWVudERhdGEubWFuaWZlc3QuZW52aXJvbm1lbnQgfHwge307XG5cblx0XHRcdGZvciAobGV0IGZpbGVOYW1lIG9mIE9iamVjdC5rZXlzKHRoaXMuZmlsZXMpKSB7XG5cdFx0XHRcdGxldCBmaWxlID0gdGhpcy5maWxlc1tmaWxlTmFtZV07XG5cblx0XHRcdFx0aWYgKGZpbGUuYmFzZW5hbWUgPT09ICdkZW1vJykge1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0bGV0IGZvcm1hdENvbmZpZyA9IHRoaXMuY29uZmlnLnBhdHRlcm5zLmZvcm1hdHNbZmlsZS5mb3JtYXRdO1xuXG5cdFx0XHRcdGlmICh0eXBlb2YgZm9ybWF0Q29uZmlnICE9PSAnb2JqZWN0Jykge1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0bGV0IHRyYW5zZm9ybXMgPSBmb3JtYXRDb25maWcudHJhbnNmb3JtcyB8fCBbXTtcblx0XHRcdFx0bGV0IGxhc3RUcmFuc2Zvcm0gPSB0aGlzLmNvbmZpZy50cmFuc2Zvcm1zW3RyYW5zZm9ybXNbdHJhbnNmb3Jtcy5sZW5ndGggLSAxXV0gfHwge307XG5cblx0XHRcdFx0Ly8gU2tpcCBmaWxlIHRyYW5zZm9ybSBpZiBmb3JtYXQgZmlsdGVycyBwcmVzZW50IGFuZCBub3QgbWF0Y2hpbmdcblx0XHRcdFx0aWYgKCF0aGlzLmZpbHRlcnMuZm9ybWF0cyB8fCAhdGhpcy5maWx0ZXJzLmZvcm1hdHMubGVuZ3RoIHx8IHRoaXMuZmlsdGVycy5mb3JtYXRzLmluY2x1ZGVzKGxhc3RUcmFuc2Zvcm0ub3V0Rm9ybWF0KSkge1xuXHRcdFx0XHRcdGZvciAobGV0IHRyYW5zZm9ybSBvZiB0cmFuc2Zvcm1zKSB7XG5cdFx0XHRcdFx0XHRsZXQgY2FjaGVJRCA9IGBmaWxlOnRyYW5zZm9ybToke2ZpbGUucGF0aH06JHtlbnZpcm9ubWVudE5hbWV9OiR7dHJhbnNmb3JtfWA7XG5cdFx0XHRcdFx0XHRsZXQgY2FjaGVkO1xuXHRcdFx0XHRcdFx0bGV0IGRlbW8gPSBkZW1vc1tmb3JtYXRDb25maWcubmFtZV07XG5cdFx0XHRcdFx0XHRsZXQgbXRpbWUgPSBnZXRMYXN0TW9kaWZpZWQoZmlsZSk7XG5cblx0XHRcdFx0XHRcdC8vIFVzZSBsYXRlc3QgZGVtbyBvciBmaWxlIG10aW1lXG5cdFx0XHRcdFx0XHRpZiAoZGVtbykge1xuXHRcdFx0XHRcdFx0XHRtdGltZSA9IE1hdGgubWF4KG10aW1lLCBnZXRMYXN0TW9kaWZpZWQoZGVtbykpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRpZiAodGhpcy5jYWNoZSAmJiB0aGlzLmNhY2hlLmNvbmZpZy50cmFuc2Zvcm0pIHtcblx0XHRcdFx0XHRcdFx0Y2FjaGVkID0gdGhpcy5jYWNoZS5nZXQoY2FjaGVJRCwgbXRpbWUpO1xuXHRcdFx0XHRcdFx0XHRmaWxlID0gY2FjaGVkIHx8IGZpbGU7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmICghY2FjaGVkKSB7XG5cdFx0XHRcdFx0XHRcdGxldCBmbiA9IHRoaXMudHJhbnNmb3Jtc1t0cmFuc2Zvcm1dO1xuXHRcdFx0XHRcdFx0XHRsZXQgZW52aXJvbm1lbnRDb25maWcgPSBlbnZpcm9ubWVudFt0cmFuc2Zvcm1dIHx8IHt9O1xuXHRcdFx0XHRcdFx0XHRsZXQgYXBwbGljYXRpb25Db25maWcgPSB0aGlzLmNvbmZpZy50cmFuc2Zvcm1zW3RyYW5zZm9ybV0gfHwge307XG5cdFx0XHRcdFx0XHRcdGxldCBjb25maWd1cmF0aW9uID0gbWVyZ2Uoe30sIGFwcGxpY2F0aW9uQ29uZmlnLCBlbnZpcm9ubWVudENvbmZpZyk7XG5cblx0XHRcdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdFx0XHRmaWxlID0gYXdhaXQgZm4oT2JqZWN0LmFzc2lnbih7fSwgZmlsZSksIGRlbW8sIGNvbmZpZ3VyYXRpb24sIGZvcmNlZCk7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKHRoaXMuY2FjaGUgJiYgdGhpcy5jYWNoZS5jb25maWcudHJhbnNmb3JtICYmICF0aGlzLmlzRW52aXJvbm1lbnQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHRoaXMuY2FjaGUuc2V0KGNhY2hlSUQsIG10aW1lLCBmaWxlKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdFx0XHRcdFx0ZXJyb3IucGF0dGVybiA9IHRoaXMuaWQ7XG5cdFx0XHRcdFx0XHRcdFx0ZXJyb3IuZmlsZSA9IGVycm9yLmZpbGUgfHwgZmlsZS5wYXRoO1xuXHRcdFx0XHRcdFx0XHRcdGVycm9yLnRyYW5zZm9ybSA9IHRyYW5zZm9ybTtcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yKGBFcnJvciB3aGlsZSB0cmFuc2Zvcm1pbmcgZmlsZSBcIiR7ZXJyb3IuZmlsZX1cIiBvZiBwYXR0ZXJuIFwiJHtlcnJvci5wYXR0ZXJufVwiIHdpdGggdHJhbnNmb3JtIFwiJHtlcnJvci50cmFuc2Zvcm19XCIuYCk7XG5cdFx0XHRcdFx0XHRcdFx0dGhyb3cgZXJyb3I7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIXRoaXMucmVzdWx0c1tlbnZpcm9ubWVudE5hbWVdKSB7XG5cdFx0XHRcdFx0dGhpcy5yZXN1bHRzW2Vudmlyb25tZW50TmFtZV0gPSB7fTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGZpbGUub3V0ID0gZmlsZS5vdXQgfHwgbGFzdFRyYW5zZm9ybS5vdXRGb3JtYXQgfHwgZmlsZS5mb3JtYXQ7XG5cdFx0XHRcdHRoaXMucmVzdWx0c1tlbnZpcm9ubWVudE5hbWVdW2Zvcm1hdENvbmZpZy5uYW1lXSA9IGZpbGU7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0Z2V0TGFzdE1vZGlmaWVkKCkge1xuXHRcdGxldCBtdGltZXMgPSBbXTtcblxuXHRcdC8vIEFscmVhZHkgcmVhZFxuXHRcdGlmICggdGhpcy5kZXBlbmRlbmNpZXMgKSB7XG5cdFx0XHRmb3IgKGxldCBkZXBlbmRlbmN5IGluIHRoaXMuZGVwZW5kZW5jaWVzKSB7XG5cdFx0XHRcdG10aW1lcy5wdXNoKHRoaXMuZGVwZW5kZW5jaWVzW2RlcGVuZGVuY3ldLmdldExhc3RNb2RpZmllZCgpKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmb3IgKGxldCBmaWxlTmFtZSBpbiB0aGlzLmZpbGVzKSB7XG5cdFx0XHRsZXQgZmlsZSA9IHRoaXMuZmlsZXNbZmlsZU5hbWVdO1xuXHRcdFx0bXRpbWVzLnB1c2gobmV3IERhdGUoZmlsZS5mcy5ub2RlLm10aW1lKSk7XG5cdFx0fVxuXG5cdFx0dGhpcy5tdGltZSA9IG10aW1lcy5zb3J0KChhLCBiKSA9PiBiIC0gYSlbMF07XG5cdFx0cmV0dXJuIHRoaXMubXRpbWU7XG5cdH1cblxuXHR0b0pTT04oKSB7XG5cdFx0bGV0IGNvcHkgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzKTtcblxuXHRcdGlmIChjb3B5LmRlcGVuZGVuY2llcykge1xuXHRcdFx0Zm9yIChsZXQgZGVwZW5kZW5jeU5hbWUgaW4gY29weS5kZXBlbmRlbmNpZXMpIHtcblx0XHRcdFx0bGV0IGRlcGVuZGVuY3kgPSBjb3B5LmRlcGVuZGVuY2llc1tkZXBlbmRlbmN5TmFtZV07XG5cdFx0XHRcdGRlcGVuZGVuY3kgPSBkZXBlbmRlbmN5LnRvSlNPTiA/IGRlcGVuZGVuY3kudG9KU09OKCkgOiBkZXBlbmRlbmN5O1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZvciAobGV0IGVudmlyb25tZW50TmFtZSBvZiBPYmplY3Qua2V5cyhjb3B5LnJlc3VsdHMpKSB7XG5cdFx0XHRsZXQgZW52aXJvbm1lbnRSZXN1bHQgPSBjb3B5LnJlc3VsdHNbZW52aXJvbm1lbnROYW1lXTtcblx0XHRcdFx0Zm9yIChsZXQgcmVzdWx0TmFtZSBvZiBPYmplY3Qua2V5cyhlbnZpcm9ubWVudFJlc3VsdCkpIHtcblx0XHRcdFx0XHRsZXQgcmVzdWx0ID0gZW52aXJvbm1lbnRSZXN1bHRbcmVzdWx0TmFtZV07XG5cblx0XHRcdFx0XHRjb3B5LnJlc3VsdHNbZW52aXJvbm1lbnROYW1lXVtyZXN1bHROYW1lXSA9IHtcblx0XHRcdFx0XHRcdCduYW1lJzogcmVzdWx0TmFtZSxcblx0XHRcdFx0XHRcdCdzb3VyY2UnOiByZXN1bHQuc291cmNlLnRvU3RyaW5nKCd1dGYtOCcpLFxuXHRcdFx0XHRcdFx0J2RlbW9Tb3VyY2UnOiByZXN1bHQuZGVtb1NvdXJjZSA/IHJlc3VsdC5kZW1vU291cmNlLnRvU3RyaW5nKCd1dGYtOCcpIDogJycsXG5cdFx0XHRcdFx0XHQnYnVmZmVyJzogcmVzdWx0LmJ1ZmZlci50b1N0cmluZygndXRmLTgnKSxcblx0XHRcdFx0XHRcdCdkZW1vQnVmZmVyJzogcmVzdWx0LmRlbW9CdWZmZXIgPyByZXN1bHQuZGVtb0J1ZmZlci50b1N0cmluZygndXRmLTgnKSA6ICcnLFxuXHRcdFx0XHRcdFx0J2luJzogcmVzdWx0LmluLFxuXHRcdFx0XHRcdFx0J291dCc6IHJlc3VsdC5vdXRcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZGVsZXRlIGNvcHkuY2FjaGU7XG5cdFx0ZGVsZXRlIGNvcHkuZmlsZXM7XG5cdFx0ZGVsZXRlIGNvcHkuY29uZmlnO1xuXHRcdGRlbGV0ZSBjb3B5LmJhc2U7XG5cdFx0ZGVsZXRlIGNvcHkucGF0aDtcblx0XHRkZWxldGUgY29weS50cmFuc2Zvcm1zO1xuXG5cdFx0cmV0dXJuIGNvcHk7XG5cdH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBwYXR0ZXJuRmFjdG9yeSguLi5hcmdzKSB7XG5cdHJldHVybiBhd2FpdCBuZXcgUGF0dGVybiguLi5hcmdzKTtcbn1cbiJdfQ==