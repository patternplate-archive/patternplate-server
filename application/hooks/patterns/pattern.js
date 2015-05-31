/* eslint ignore */
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
var _bind = Function.prototype.bind;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports['default'] = patternFactory;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _path = require('path');

var _qIoFs = require('q-io/fs');

var _qIoFs2 = _interopRequireDefault(_qIoFs);

var Pattern = (function () {
	function Pattern(id, base) {
		var config = arguments[2] === undefined ? {} : arguments[2];
		var transforms = arguments[3] === undefined ? {} : arguments[3];
		var cache = arguments[4] === undefined ? null : arguments[4];

		_classCallCheck(this, Pattern);

		this.__initializeProperties();

		this.id = id;
		this.cache = cache;
		this.base = base;
		this.path = Pattern.resolve(this.base, this.id);
		this.config = config;
		this.transforms = transforms;
	}

	_createClass(Pattern, [{
		key: 'read',
		value: function read() {
			var path = arguments[0] === undefined ? this.path : arguments[0];

			var files, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, file, stat, _mtime, _name, data, ext, buffer, manifest, patternName, pattern, fileName, dependencyName, dependencyFile;

			return regeneratorRuntime.async(function read$(context$2$0) {
				while (1) switch (context$2$0.prev = context$2$0.next) {
					case 0:
						// TODO: Replace q-io/fs
						_qIoFs2['default'].exists = _qIoFs2['default'].exists.bind(_qIoFs2['default']);

						context$2$0.next = 3;
						return _qIoFs2['default'].exists(path);

					case 3:
						context$2$0.t0 = context$2$0.sent;

						if (!(context$2$0.t0 !== true)) {
							context$2$0.next = 6;
							break;
						}

						throw new Error('Can not read pattern from ' + this.path + ', it does not exist.');

					case 6:
						context$2$0.next = 8;
						return _qIoFs2['default'].listTree(path);

					case 8:
						files = context$2$0.sent;

						files = files.filter(function (fileName) {
							var ext = (0, _path.extname)(fileName);
							return ext && ['index', 'demo', 'pattern'].indexOf((0, _path.basename)(fileName, ext)) > -1;
						});

						_iteratorNormalCompletion = true;
						_didIteratorError = false;
						_iteratorError = undefined;
						context$2$0.prev = 13;
						_iterator = files[Symbol.iterator]();

					case 15:
						if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
							context$2$0.next = 35;
							break;
						}

						file = _step.value;
						context$2$0.next = 19;
						return _qIoFs2['default'].stat(file);

					case 19:
						stat = context$2$0.sent;
						_mtime = stat.node.mtime;
						_name = (0, _path.basename)(file);
						data = undefined;

						if (this.cache) {
							data = this.cache.get(file, _mtime);
						}

						if (data) {
							context$2$0.next = 31;
							break;
						}

						ext = (0, _path.extname)(file);
						context$2$0.next = 28;
						return _qIoFs2['default'].read(file);

					case 28:
						buffer = context$2$0.sent;

						data = {
							buffer: buffer,
							name: _name,
							'basename': (0, _path.basename)(_name, ext),
							'ext': ext,
							'format': ext.replace('.', ''),
							'fs': stat,
							'path': file,
							'source': buffer };

						if (this.cache) {
							this.cache.set(file, _mtime, data);
						}

					case 31:

						this.files[_name] = data;

					case 32:
						_iteratorNormalCompletion = true;
						context$2$0.next = 15;
						break;

					case 35:
						context$2$0.next = 41;
						break;

					case 37:
						context$2$0.prev = 37;
						context$2$0.t1 = context$2$0['catch'](13);
						_didIteratorError = true;
						_iteratorError = context$2$0.t1;

					case 41:
						context$2$0.prev = 41;
						context$2$0.prev = 42;

						if (!_iteratorNormalCompletion && _iterator['return']) {
							_iterator['return']();
						}

					case 44:
						context$2$0.prev = 44;

						if (!_didIteratorError) {
							context$2$0.next = 47;
							break;
						}

						throw _iteratorError;

					case 47:
						return context$2$0.finish(44);

					case 48:
						return context$2$0.finish(41);

					case 49:
						manifest = this.files['pattern.json'];

						if (!(typeof manifest === 'undefined')) {
							context$2$0.next = 52;
							break;
						}

						throw new Error({
							'message': 'Can not read pattern.json from ' + this.path + ', it does not exist.',
							'file': this.path,
							'pattern': this.id
						});

					case 52:
						context$2$0.prev = 52;

						this.manifest = JSON.parse(manifest.source.toString('utf-8'));
						delete this.files['pattern.json'];
						context$2$0.next = 60;
						break;

					case 57:
						context$2$0.prev = 57;
						context$2$0.t2 = context$2$0['catch'](52);
						throw new Error({
							'message': 'Error while reading pattern.json from ' + this.path,
							'file': this.path,
							'pattern': this.id,
							'stack': context$2$0.t2.stack
						});

					case 60:
						if (!(typeof this.manifest.patterns !== 'object')) {
							context$2$0.next = 62;
							break;
						}

						return context$2$0.abrupt('return', this);

					case 62:
						context$2$0.t3 = regeneratorRuntime.keys(this.manifest.patterns);

					case 63:
						if ((context$2$0.t4 = context$2$0.t3()).done) {
							context$2$0.next = 71;
							break;
						}

						patternName = context$2$0.t4.value;
						pattern = new Pattern(this.manifest.patterns[patternName], this.base, this.config, this.transforms, this.cache);
						context$2$0.next = 68;
						return pattern.read();

					case 68:
						this.dependencies[patternName] = context$2$0.sent;
						context$2$0.next = 63;
						break;

					case 71:
						context$2$0.t5 = regeneratorRuntime.keys(this.files);

					case 72:
						if ((context$2$0.t6 = context$2$0.t5()).done) {
							context$2$0.next = 81;
							break;
						}

						fileName = context$2$0.t6.value;
						file = this.files[fileName];

						file.dependencies = {};

						if (!(file.basename === 'demo')) {
							context$2$0.next = 78;
							break;
						}

						return context$2$0.abrupt('continue', 72);

					case 78:

						for (dependencyName in this.dependencies) {
							dependencyFile = this.dependencies[dependencyName].files[file.name];

							if (dependencyFile) {
								file.dependencies[dependencyName] = dependencyFile;
							}
						}
						context$2$0.next = 72;
						break;

					case 81:

						this.getLastModified();
						return context$2$0.abrupt('return', this);

					case 83:
					case 'end':
						return context$2$0.stop();
				}
			}, null, this, [[13, 37, 41, 49], [42,, 44, 48], [52, 57]]);
		}
	}, {
		key: 'transform',
		value: function transform() {
			var withDemos = arguments[0] === undefined ? true : arguments[0];

			var demos, fileName, file, formatConfig, transforms, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, transform, fn;

			return regeneratorRuntime.async(function transform$(context$2$0) {
				while (1) switch (context$2$0.prev = context$2$0.next) {
					case 0:
						demos = {};

						if (!withDemos) {
							context$2$0.next = 14;
							break;
						}

						context$2$0.t0 = regeneratorRuntime.keys(this.files);

					case 3:
						if ((context$2$0.t1 = context$2$0.t0()).done) {
							context$2$0.next = 14;
							break;
						}

						fileName = context$2$0.t1.value;
						file = this.files[fileName];

						if (!(file.basename !== 'demo')) {
							context$2$0.next = 8;
							break;
						}

						return context$2$0.abrupt('continue', 3);

					case 8:
						formatConfig = this.config.formats[file.format];

						if (!(typeof formatConfig !== 'object')) {
							context$2$0.next = 11;
							break;
						}

						return context$2$0.abrupt('continue', 3);

					case 11:

						demos[formatConfig.name] = file;
						context$2$0.next = 3;
						break;

					case 14:
						context$2$0.t2 = regeneratorRuntime.keys(this.files);

					case 15:
						if ((context$2$0.t3 = context$2$0.t2()).done) {
							context$2$0.next = 64;
							break;
						}

						fileName = context$2$0.t3.value;
						file = this.files[fileName];

						if (!(file.basename === 'demo')) {
							context$2$0.next = 20;
							break;
						}

						return context$2$0.abrupt('continue', 15);

					case 20:
						formatConfig = this.config.formats[file.format];

						if (!(typeof formatConfig !== 'object')) {
							context$2$0.next = 23;
							break;
						}

						return context$2$0.abrupt('continue', 15);

					case 23:
						transforms = formatConfig.transforms || [];
						_iteratorNormalCompletion2 = true;
						_didIteratorError2 = false;
						_iteratorError2 = undefined;
						context$2$0.prev = 27;
						_iterator2 = transforms[Symbol.iterator]();

					case 29:
						if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
							context$2$0.next = 47;
							break;
						}

						transform = _step2.value;
						fn = this.transforms[transform];
						context$2$0.prev = 32;
						context$2$0.next = 35;
						return fn(file, demos[formatConfig.name]);

					case 35:
						file = context$2$0.sent;
						context$2$0.next = 44;
						break;

					case 38:
						context$2$0.prev = 38;
						context$2$0.t4 = context$2$0['catch'](32);

						context$2$0.t4.pattern = this.id;
						context$2$0.t4.file = context$2$0.t4.file || file.path;
						context$2$0.t4.transform = transform;
						throw context$2$0.t4;

					case 44:
						_iteratorNormalCompletion2 = true;
						context$2$0.next = 29;
						break;

					case 47:
						context$2$0.next = 53;
						break;

					case 49:
						context$2$0.prev = 49;
						context$2$0.t5 = context$2$0['catch'](27);
						_didIteratorError2 = true;
						_iteratorError2 = context$2$0.t5;

					case 53:
						context$2$0.prev = 53;
						context$2$0.prev = 54;

						if (!_iteratorNormalCompletion2 && _iterator2['return']) {
							_iterator2['return']();
						}

					case 56:
						context$2$0.prev = 56;

						if (!_didIteratorError2) {
							context$2$0.next = 59;
							break;
						}

						throw _iteratorError2;

					case 59:
						return context$2$0.finish(56);

					case 60:
						return context$2$0.finish(53);

					case 61:

						this.results[formatConfig.name] = file;
						context$2$0.next = 15;
						break;

					case 64:
					case 'end':
						return context$2$0.stop();
				}
			}, null, this, [[27, 49, 53, 61], [32, 38], [54,, 56, 60]]);
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

			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = Object.keys(this.results)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var resultName = _step3.value;

					this.results[resultName] = {
						'source': this.results[resultName].source.toString('utf-8'),
						'demoSource': this.results[resultName].demoSource ? this.results[resultName].demoSource.toString('utf-8') : '',
						'buffer': this.results[resultName].buffer.toString('utf-8'),
						'demoBuffer': this.results[resultName].demoBuffer ? this.results[resultName].demoBuffer.toString('utf-8') : '',
						'in': this.results[resultName]['in'],
						'out': this.results[resultName].out
					};
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

			delete copy.files;
			delete copy.config;
			delete copy.base;
			delete copy.path;
			delete copy.transforms;

			return copy;
		}
	}, {
		key: '__initializeProperties',
		value: function __initializeProperties() {
			this.files = {};
			this.config = {};
			this.manifest = {};
			this.dependencies = {};
			this.results = {};
			this.mtime = null;
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
				return new (_bind.apply(Pattern, [null].concat(args)))();

			case 2:
				return context$1$0.abrupt('return', context$1$0.sent);

			case 3:
			case 'end':
				return context$1$0.stop();
		}
	}, null, this);
}