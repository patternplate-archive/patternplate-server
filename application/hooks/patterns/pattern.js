'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
var _bind = Function.prototype.bind;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports['default'] = patternFactory;

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

			var manifestPath, manifestCacheID, manifestData, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, patternName, patternIDString, patternBaseName, patternBaseNameFragments, patternRange, patternID, pattern;

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
						manifestCacheID = 'pattern:read:manifest:' + this.id;
						manifestData = undefined;

						if (this.cache && this.cache.config.read) {
							manifestData = this.cache.get(manifestCacheID, false);
						}

						if (manifestData) {
							context$2$0.next = 22;
							break;
						}

						context$2$0.t1 = JSON;
						context$2$0.next = 19;
						return regeneratorRuntime.awrap(fs.read(manifestPath));

					case 19:
						context$2$0.t2 = context$2$0.sent;
						manifestData = context$2$0.t1.parse.call(context$2$0.t1, context$2$0.t2);

						if (this.cache && this.cache.config.read) {
							this.cache.set(manifestCacheID, null, manifestData);
						}

					case 22:

						this.manifest = Object.assign({}, {
							'version': '0.1.0',
							'build': true,
							'display': true
						}, this.manifest, manifestData);

						context$2$0.next = 28;
						break;

					case 25:
						context$2$0.prev = 25;
						context$2$0.t3 = context$2$0['catch'](11);
						throw new Error('Error while reading pattern.json from ' + this.path, {
							'file': this.path,
							'pattern': this.id,
							'stack': context$2$0.t3.stack
						});

					case 28:
						if (!(this.isEnvironment && !this.manifest.patterns)) {
							context$2$0.next = 31;
							break;
						}

						context$2$0.next = 31;
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

					case 31:
						_iteratorNormalCompletion3 = true;
						_didIteratorError3 = false;
						_iteratorError3 = undefined;
						context$2$0.prev = 34;
						_iterator3 = Object.keys(this.manifest.patterns || {})[Symbol.iterator]();

					case 36:
						if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
							context$2$0.next = 59;
							break;
						}

						patternName = _step3.value;
						patternIDString = this.manifest.patterns[patternName];
						patternBaseName = (0, _path.basename)(patternIDString);
						patternBaseNameFragments = patternBaseName.split('@');
						patternRange = _semver2['default'].validRange(patternBaseNameFragments[1]) || '*';

						if (patternRange) {
							context$2$0.next = 44;
							break;
						}

						throw new Error(patternBaseNameFragments[1] + ' in ' + patternIDString + ' is no valid semver range.', {
							'file': this.path,
							'pattern': this.id
						});

					case 44:
						patternID = (0, _path.join)((0, _path.dirname)(patternIDString), patternBaseNameFragments[0]);
						pattern = new Pattern(patternID, this.base, this.config, this.transforms, this.filters, this.cache);
						context$2$0.next = 48;
						return regeneratorRuntime.awrap(pattern.read(pattern.path));

					case 48:
						this.dependencies[patternName] = context$2$0.sent;

						if (_semver2['default'].satisfies(pattern.manifest.version, patternRange)) {
							context$2$0.next = 56;
							break;
						}

						if (this.isEnvironment) {
							context$2$0.next = 54;
							break;
						}

						throw new Error(pattern.id + ' at version ' + pattern.manifest.version + ' does not satisfy range ' + patternRange + ' specified by ' + this.id + '.', {
							'file': pattern.path,
							'pattern': this.id
						});

					case 54:
						delete this.dependencies[patternName];
						console.warn('Omitting ' + pattern.id + ' at version ' + pattern.manifest.version + ' from build. It does not satisfy range ' + patternRange + ' specified by ' + this.id + '.');

					case 56:
						_iteratorNormalCompletion3 = true;
						context$2$0.next = 36;
						break;

					case 59:
						context$2$0.next = 65;
						break;

					case 61:
						context$2$0.prev = 61;
						context$2$0.t4 = context$2$0['catch'](34);
						_didIteratorError3 = true;
						_iteratorError3 = context$2$0.t4;

					case 65:
						context$2$0.prev = 65;
						context$2$0.prev = 66;

						if (!_iteratorNormalCompletion3 && _iterator3['return']) {
							_iterator3['return']();
						}

					case 68:
						context$2$0.prev = 68;

						if (!_didIteratorError3) {
							context$2$0.next = 71;
							break;
						}

						throw _iteratorError3;

					case 71:
						return context$2$0.finish(68);

					case 72:
						return context$2$0.finish(65);

					case 73:
						context$2$0.next = 75;
						return regeneratorRuntime.awrap(this.getLastModified());

					case 75:
						return context$2$0.abrupt('return', this);

					case 76:
					case 'end':
						return context$2$0.stop();
				}
			}, null, this, [[11, 25], [34, 61, 65, 73], [66,, 68, 72]]);
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
						if (!('files' in this.filters && !this.filters.files)) {
							context$2$0.next = 11;
							break;
						}

						this.getLastModified();
						return context$2$0.abrupt('return', this);

					case 11:
						context$2$0.next = 13;
						return regeneratorRuntime.awrap(fs.listTree(path));

					case 13:
						files = context$2$0.sent;

						files = files.filter(function (fileName) {
							var ext = (0, _path.extname)(fileName);
							return ext && ['index', 'demo', 'pattern'].indexOf((0, _path.basename)(fileName, ext)) > -1;
						});

						_iteratorNormalCompletion4 = true;
						_didIteratorError4 = false;
						_iteratorError4 = undefined;
						context$2$0.prev = 18;
						_iterator4 = files[Symbol.iterator]();

					case 20:
						if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
							context$2$0.next = 39;
							break;
						}

						file = _step4.value;
						context$2$0.next = 24;
						return regeneratorRuntime.awrap(fs.stat(file));

					case 24:
						stat = context$2$0.sent;
						mtime = stat.node.mtime;
						_name = (0, _path.basename)(file);
						data = this.cache ? this.cache.get(file, mtime) : null;

						if (data) {
							context$2$0.next = 35;
							break;
						}

						ext = (0, _path.extname)(file);
						context$2$0.next = 32;
						return regeneratorRuntime.awrap(fs.read(file));

					case 32:
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

						if (this.cache && !('files' in this.filters) && !('transforms' in this.filters)) {
							this.cache.set(file, mtime, data);
						}

					case 35:

						this.files[_name] = data;

					case 36:
						_iteratorNormalCompletion4 = true;
						context$2$0.next = 20;
						break;

					case 39:
						context$2$0.next = 45;
						break;

					case 41:
						context$2$0.prev = 41;
						context$2$0.t0 = context$2$0['catch'](18);
						_didIteratorError4 = true;
						_iteratorError4 = context$2$0.t0;

					case 45:
						context$2$0.prev = 45;
						context$2$0.prev = 46;

						if (!_iteratorNormalCompletion4 && _iterator4['return']) {
							_iterator4['return']();
						}

					case 48:
						context$2$0.prev = 48;

						if (!_didIteratorError4) {
							context$2$0.next = 51;
							break;
						}

						throw _iteratorError4;

					case 51:
						return context$2$0.finish(48);

					case 52:
						return context$2$0.finish(45);

					case 53:
						context$2$0.t1 = regeneratorRuntime.keys(this.files);

					case 54:
						if ((context$2$0.t2 = context$2$0.t1()).done) {
							context$2$0.next = 63;
							break;
						}

						fileName = context$2$0.t2.value;
						file = this.files[fileName];

						file.dependencies = {};

						if (!(file.basename === 'demo')) {
							context$2$0.next = 60;
							break;
						}

						return context$2$0.abrupt('continue', 54);

					case 60:

						for (dependencyName in this.dependencies) {
							dependencyFile = this.dependencies[dependencyName].files[file.name];

							if (dependencyFile) {
								file.dependencies[dependencyName] = dependencyFile;
							}
						}
						context$2$0.next = 54;
						break;

					case 63:

						this.getLastModified();
						return context$2$0.abrupt('return', this);

					case 65:
					case 'end':
						return context$2$0.stop();
				}
			}, null, this, [[18, 41, 45, 53], [46,, 48, 52]]);
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
						if (!('transforms' in this.filters && !this.filters.transforms)) {
							context$2$0.next = 4;
							break;
						}

						return context$2$0.abrupt('return', this);

					case 4:
						demos = {};

						if (!forced) {
							context$2$0.next = 72;
							break;
						}

						context$2$0.next = 8;
						return regeneratorRuntime.awrap(_qIoFs2['default'].mock(this.path));

					case 8:
						fs = context$2$0.sent;
						context$2$0.next = 11;
						return regeneratorRuntime.awrap(fs.makeTree(this.path));

					case 11:
						context$2$0.next = 13;
						return regeneratorRuntime.awrap(fs.listTree('/'));

					case 13:
						list = context$2$0.sent;
						_iteratorNormalCompletion5 = true;
						_didIteratorError5 = false;
						_iteratorError5 = undefined;
						context$2$0.prev = 17;
						_iterator5 = list[Symbol.iterator]();

					case 19:
						if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
							context$2$0.next = 29;
							break;
						}

						listItem = _step5.value;
						context$2$0.next = 23;
						return regeneratorRuntime.awrap(fs.isFile(listItem));

					case 23:
						if (!context$2$0.sent) {
							context$2$0.next = 26;
							break;
						}

						context$2$0.next = 26;
						return regeneratorRuntime.awrap(fs.rename(listItem, fs.join(this.path, fs.base(listItem))));

					case 26:
						_iteratorNormalCompletion5 = true;
						context$2$0.next = 19;
						break;

					case 29:
						context$2$0.next = 35;
						break;

					case 31:
						context$2$0.prev = 31;
						context$2$0.t0 = context$2$0['catch'](17);
						_didIteratorError5 = true;
						_iteratorError5 = context$2$0.t0;

					case 35:
						context$2$0.prev = 35;
						context$2$0.prev = 36;

						if (!_iteratorNormalCompletion5 && _iterator5['return']) {
							_iterator5['return']();
						}

					case 38:
						context$2$0.prev = 38;

						if (!_didIteratorError5) {
							context$2$0.next = 41;
							break;
						}

						throw _iteratorError5;

					case 41:
						return context$2$0.finish(38);

					case 42:
						return context$2$0.finish(35);

					case 43:
						_iteratorNormalCompletion6 = true;
						_didIteratorError6 = false;
						_iteratorError6 = undefined;
						context$2$0.prev = 46;
						_iterator6 = Object.keys(this.config.patterns.formats)[Symbol.iterator]();

					case 48:
						if (_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done) {
							context$2$0.next = 56;
							break;
						}

						formatName = _step6.value;

						if (!this.config.patterns.formats[formatName].build) {
							context$2$0.next = 53;
							break;
						}

						context$2$0.next = 53;
						return regeneratorRuntime.awrap(fs.write((0, _path.resolve)(this.path, ['index', formatName].join('.')), '\n'));

					case 53:
						_iteratorNormalCompletion6 = true;
						context$2$0.next = 48;
						break;

					case 56:
						context$2$0.next = 62;
						break;

					case 58:
						context$2$0.prev = 58;
						context$2$0.t1 = context$2$0['catch'](46);
						_didIteratorError6 = true;
						_iteratorError6 = context$2$0.t1;

					case 62:
						context$2$0.prev = 62;
						context$2$0.prev = 63;

						if (!_iteratorNormalCompletion6 && _iterator6['return']) {
							_iterator6['return']();
						}

					case 65:
						context$2$0.prev = 65;

						if (!_didIteratorError6) {
							context$2$0.next = 68;
							break;
						}

						throw _iteratorError6;

					case 68:
						return context$2$0.finish(65);

					case 69:
						return context$2$0.finish(62);

					case 70:
						context$2$0.next = 72;
						return regeneratorRuntime.awrap(this.read(this.path, fs));

					case 72:
						if (!withDemos) {
							context$2$0.next = 85;
							break;
						}

						context$2$0.t2 = regeneratorRuntime.keys(this.files);

					case 74:
						if ((context$2$0.t3 = context$2$0.t2()).done) {
							context$2$0.next = 85;
							break;
						}

						fileName = context$2$0.t3.value;
						file = this.files[fileName];

						if (!(file.basename !== 'demo')) {
							context$2$0.next = 79;
							break;
						}

						return context$2$0.abrupt('continue', 74);

					case 79:
						formatConfig = this.config.patterns.formats[file.format];

						if (!(typeof formatConfig !== 'object')) {
							context$2$0.next = 82;
							break;
						}

						return context$2$0.abrupt('continue', 74);

					case 82:

						demos[formatConfig.name] = file;
						context$2$0.next = 74;
						break;

					case 85:
						_iteratorNormalCompletion7 = true;
						_didIteratorError7 = false;
						_iteratorError7 = undefined;
						context$2$0.prev = 88;
						_iterator7 = Object.keys(this.environments)[Symbol.iterator]();

					case 90:
						if (_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done) {
							context$2$0.next = 182;
							break;
						}

						environmentName = _step7.value;
						environmentData = this.environments[environmentName];
						environment = environmentData.manifest.environment || {};
						_iteratorNormalCompletion8 = true;
						_didIteratorError8 = false;
						_iteratorError8 = undefined;
						context$2$0.prev = 97;
						_iterator8 = Object.keys(this.files)[Symbol.iterator]();

					case 99:
						if (_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done) {
							context$2$0.next = 165;
							break;
						}

						fileName = _step8.value;
						file = this.files[fileName];

						if (!(file.basename === 'demo')) {
							context$2$0.next = 104;
							break;
						}

						return context$2$0.abrupt('continue', 162);

					case 104:
						formatConfig = this.config.patterns.formats[file.format];

						if (!(typeof formatConfig !== 'object')) {
							context$2$0.next = 107;
							break;
						}

						return context$2$0.abrupt('continue', 162);

					case 107:
						transforms = formatConfig.transforms || [];
						lastTransform = this.config.transforms[transforms[transforms.length - 1]] || {};

						if (!(!this.filters.formats || !this.filters.formats.length || this.filters.formats.includes(lastTransform.outFormat))) {
							context$2$0.next = 159;
							break;
						}

						_iteratorNormalCompletion9 = true;
						_didIteratorError9 = false;
						_iteratorError9 = undefined;
						context$2$0.prev = 113;
						_iterator9 = transforms[Symbol.iterator]();

					case 115:
						if (_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done) {
							context$2$0.next = 145;
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
							context$2$0.next = 142;
							break;
						}

						fn = this.transforms[transform];
						environmentConfig = environment[transform] || {};
						applicationConfig = this.config.transforms[transform] || {};
						configuration = (0, _lodashMerge2['default'])({}, applicationConfig, environmentConfig);
						context$2$0.prev = 128;
						context$2$0.next = 131;
						return regeneratorRuntime.awrap(fn(Object.assign({}, file), demo, configuration, forced));

					case 131:
						file = context$2$0.sent;

						if (this.cache && this.cache.config.transform && !this.isEnvironment) {
							this.cache.set(cacheID, mtime, file);
						}
						context$2$0.next = 142;
						break;

					case 135:
						context$2$0.prev = 135;
						context$2$0.t4 = context$2$0['catch'](128);

						context$2$0.t4.pattern = this.id;
						context$2$0.t4.file = context$2$0.t4.file || file.path;
						context$2$0.t4.transform = transform;
						console.error('Error while transforming file "' + context$2$0.t4.file + '" of pattern "' + context$2$0.t4.pattern + '" with transform "' + context$2$0.t4.transform + '".');
						throw context$2$0.t4;

					case 142:
						_iteratorNormalCompletion9 = true;
						context$2$0.next = 115;
						break;

					case 145:
						context$2$0.next = 151;
						break;

					case 147:
						context$2$0.prev = 147;
						context$2$0.t5 = context$2$0['catch'](113);
						_didIteratorError9 = true;
						_iteratorError9 = context$2$0.t5;

					case 151:
						context$2$0.prev = 151;
						context$2$0.prev = 152;

						if (!_iteratorNormalCompletion9 && _iterator9['return']) {
							_iterator9['return']();
						}

					case 154:
						context$2$0.prev = 154;

						if (!_didIteratorError9) {
							context$2$0.next = 157;
							break;
						}

						throw _iteratorError9;

					case 157:
						return context$2$0.finish(154);

					case 158:
						return context$2$0.finish(151);

					case 159:

						if (!this.results[environmentName]) {
							this.results[environmentName] = {};
						}

						file.out = file.out || lastTransform.outFormat || file.format;
						this.results[environmentName][formatConfig.name] = file;

					case 162:
						_iteratorNormalCompletion8 = true;
						context$2$0.next = 99;
						break;

					case 165:
						context$2$0.next = 171;
						break;

					case 167:
						context$2$0.prev = 167;
						context$2$0.t6 = context$2$0['catch'](97);
						_didIteratorError8 = true;
						_iteratorError8 = context$2$0.t6;

					case 171:
						context$2$0.prev = 171;
						context$2$0.prev = 172;

						if (!_iteratorNormalCompletion8 && _iterator8['return']) {
							_iterator8['return']();
						}

					case 174:
						context$2$0.prev = 174;

						if (!_didIteratorError8) {
							context$2$0.next = 177;
							break;
						}

						throw _iteratorError8;

					case 177:
						return context$2$0.finish(174);

					case 178:
						return context$2$0.finish(171);

					case 179:
						_iteratorNormalCompletion7 = true;
						context$2$0.next = 90;
						break;

					case 182:
						context$2$0.next = 188;
						break;

					case 184:
						context$2$0.prev = 184;
						context$2$0.t7 = context$2$0['catch'](88);
						_didIteratorError7 = true;
						_iteratorError7 = context$2$0.t7;

					case 188:
						context$2$0.prev = 188;
						context$2$0.prev = 189;

						if (!_iteratorNormalCompletion7 && _iterator7['return']) {
							_iterator7['return']();
						}

					case 191:
						context$2$0.prev = 191;

						if (!_didIteratorError7) {
							context$2$0.next = 194;
							break;
						}

						throw _iteratorError7;

					case 194:
						return context$2$0.finish(191);

					case 195:
						return context$2$0.finish(188);

					case 196:
						return context$2$0.abrupt('return', this);

					case 197:
					case 'end':
						return context$2$0.stop();
				}
			}, null, this, [[17, 31, 35, 43], [36,, 38, 42], [46, 58, 62, 70], [63,, 65, 69], [88, 184, 188, 196], [97, 167, 171, 179], [113, 147, 151, 159], [128, 135], [152,, 154, 158], [172,, 174, 178], [189,, 191, 195]]);
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

function patternFactory() {
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
}

// Use the fast-track read cache from get-patterns if applicable

// Add fake/virtual files if forced

// Skip file transform if format filters present and not matching