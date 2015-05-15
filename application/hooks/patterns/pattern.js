'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
var _bind = Function.prototype.bind;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports['default'] = patternFactory;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/* eslint ignore */

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

			var files, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, file, stat, _mtime, _name, data, ext, buffer, manifest, patternName, pattern;

			return regeneratorRuntime.async(function read$(context$2$0) {
				while (1) switch (context$2$0.prev = context$2$0.next) {
					case 0:
						// TODO: Replace q-io/fs
						_qIoFs2['default'].exists = _qIoFs2['default'].exists.bind(_qIoFs2['default']);

						context$2$0.next = 3;
						return _qIoFs2['default'].exists(path);

					case 3:
						context$2$0.t457 = context$2$0.sent;

						if (!(context$2$0.t457 !== true)) {
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
						1;
						_iteratorNormalCompletion = true;
						_didIteratorError = false;
						_iteratorError = undefined;
						context$2$0.prev = 14;
						_iterator = files[Symbol.iterator]();

					case 16:
						if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
							context$2$0.next = 36;
							break;
						}

						file = _step.value;
						context$2$0.next = 20;
						return _qIoFs2['default'].stat(file);

					case 20:
						stat = context$2$0.sent;
						_mtime = stat.node.mtime;
						_name = (0, _path.basename)(file);
						data = undefined;

						if (this.cache) {
							data = this.cache.get(file, _mtime);
						}

						if (data) {
							context$2$0.next = 32;
							break;
						}

						ext = (0, _path.extname)(file);
						context$2$0.next = 29;
						return _qIoFs2['default'].read(file);

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
							'source': buffer };

						if (this.cache) {
							this.cache.set(file, _mtime, data);
						}

					case 32:

						this.files[_name] = data;

					case 33:
						_iteratorNormalCompletion = true;
						context$2$0.next = 16;
						break;

					case 36:
						context$2$0.next = 42;
						break;

					case 38:
						context$2$0.prev = 38;
						context$2$0.t458 = context$2$0['catch'](14);
						_didIteratorError = true;
						_iteratorError = context$2$0.t458;

					case 42:
						context$2$0.prev = 42;
						context$2$0.prev = 43;

						if (!_iteratorNormalCompletion && _iterator['return']) {
							_iterator['return']();
						}

					case 45:
						context$2$0.prev = 45;

						if (!_didIteratorError) {
							context$2$0.next = 48;
							break;
						}

						throw _iteratorError;

					case 48:
						return context$2$0.finish(45);

					case 49:
						return context$2$0.finish(42);

					case 50:
						manifest = this.files['pattern.json'];

						if (!(typeof manifest === 'undefined')) {
							context$2$0.next = 53;
							break;
						}

						throw new Error({
							'message': 'Can not read pattern.json from ' + this.path + ', it does not exist.',
							'file': this.path,
							'pattern': this.id
						});

					case 53:
						context$2$0.prev = 53;

						this.manifest = JSON.parse(manifest.source.toString('utf-8'));
						delete this.files['pattern.json'];
						context$2$0.next = 61;
						break;

					case 58:
						context$2$0.prev = 58;
						context$2$0.t459 = context$2$0['catch'](53);
						throw new Error({
							'message': 'Error while reading pattern.json from ' + this.path,
							'file': this.path,
							'pattern': this.id,
							'stack': context$2$0.t459.stack
						});

					case 61:
						if (!(typeof this.manifest.patterns !== 'object')) {
							context$2$0.next = 63;
							break;
						}

						return context$2$0.abrupt('return', this);

					case 63:
						context$2$0.t460 = regeneratorRuntime.keys(this.manifest.patterns);

					case 64:
						if ((context$2$0.t461 = context$2$0.t460()).done) {
							context$2$0.next = 72;
							break;
						}

						patternName = context$2$0.t461.value;
						pattern = new Pattern(this.manifest.patterns[patternName], this.base, this.config, this.transforms, this.cache);
						context$2$0.next = 69;
						return pattern.read();

					case 69:
						this.dependencies[patternName] = context$2$0.sent;
						context$2$0.next = 64;
						break;

					case 72:

						this.getLastModified();
						return context$2$0.abrupt('return', this);

					case 74:
					case 'end':
						return context$2$0.stop();
				}
			}, null, this, [[14, 38, 42, 50], [43,, 45, 49], [53, 58]]);
		}
	}, {
		key: 'transform',
		value: function transform() {
			var dependency, demos, fileName, file, formatConfig, transforms, dependencyName, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, transform, fn;

			return regeneratorRuntime.async(function transform$(context$2$0) {
				while (1) switch (context$2$0.prev = context$2$0.next) {
					case 0:
						if (!this.dependencies) {
							context$2$0.next = 8;
							break;
						}

						context$2$0.t462 = regeneratorRuntime.keys(this.dependencies);

					case 2:
						if ((context$2$0.t463 = context$2$0.t462()).done) {
							context$2$0.next = 8;
							break;
						}

						dependency = context$2$0.t463.value;
						context$2$0.next = 6;
						return this.dependencies[dependency].transform();

					case 6:
						context$2$0.next = 2;
						break;

					case 8:
						demos = {};
						context$2$0.t464 = regeneratorRuntime.keys(this.files);

					case 10:
						if ((context$2$0.t465 = context$2$0.t464()).done) {
							context$2$0.next = 21;
							break;
						}

						fileName = context$2$0.t465.value;
						file = this.files[fileName];

						if (!(file.basename !== 'demo')) {
							context$2$0.next = 15;
							break;
						}

						return context$2$0.abrupt('continue', 10);

					case 15:
						formatConfig = this.config.formats[file.format];

						if (!(typeof formatConfig !== 'object')) {
							context$2$0.next = 18;
							break;
						}

						return context$2$0.abrupt('continue', 10);

					case 18:

						demos[formatConfig.name] = file;
						context$2$0.next = 10;
						break;

					case 21:
						context$2$0.t466 = regeneratorRuntime.keys(this.files);

					case 22:
						if ((context$2$0.t467 = context$2$0.t466()).done) {
							context$2$0.next = 73;
							break;
						}

						fileName = context$2$0.t467.value;
						file = this.files[fileName];

						if (!(file.basename === 'demo')) {
							context$2$0.next = 27;
							break;
						}

						return context$2$0.abrupt('continue', 22);

					case 27:
						formatConfig = this.config.formats[file.format];

						if (!(typeof formatConfig !== 'object')) {
							context$2$0.next = 30;
							break;
						}

						return context$2$0.abrupt('continue', 22);

					case 30:
						transforms = formatConfig.transforms || [];

						file.dependencies = {};

						for (dependencyName in this.dependencies) {
							file.dependencies[dependencyName] = this.dependencies[dependencyName].results[formatConfig.name];
						}

						_iteratorNormalCompletion2 = true;
						_didIteratorError2 = false;
						_iteratorError2 = undefined;
						context$2$0.prev = 36;
						_iterator2 = transforms[Symbol.iterator]();

					case 38:
						if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
							context$2$0.next = 56;
							break;
						}

						transform = _step2.value;
						fn = this.transforms[transform];
						context$2$0.prev = 41;
						context$2$0.next = 44;
						return fn(file, demos[formatConfig.name]);

					case 44:
						file = context$2$0.sent;
						context$2$0.next = 53;
						break;

					case 47:
						context$2$0.prev = 47;
						context$2$0.t468 = context$2$0['catch'](41);

						context$2$0.t468.pattern = this.id;
						context$2$0.t468.file = context$2$0.t468.file || file.path;
						context$2$0.t468.transform = transform;
						throw context$2$0.t468;

					case 53:
						_iteratorNormalCompletion2 = true;
						context$2$0.next = 38;
						break;

					case 56:
						context$2$0.next = 62;
						break;

					case 58:
						context$2$0.prev = 58;
						context$2$0.t469 = context$2$0['catch'](36);
						_didIteratorError2 = true;
						_iteratorError2 = context$2$0.t469;

					case 62:
						context$2$0.prev = 62;
						context$2$0.prev = 63;

						if (!_iteratorNormalCompletion2 && _iterator2['return']) {
							_iterator2['return']();
						}

					case 65:
						context$2$0.prev = 65;

						if (!_didIteratorError2) {
							context$2$0.next = 68;
							break;
						}

						throw _iteratorError2;

					case 68:
						return context$2$0.finish(65);

					case 69:
						return context$2$0.finish(62);

					case 70:

						this.results[formatConfig.name] = file;
						context$2$0.next = 22;
						break;

					case 73:
					case 'end':
						return context$2$0.stop();
				}
			}, null, this, [[36, 58, 62, 70], [41, 47], [63,, 65, 69]]);
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
			for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
				args[_key2] = arguments[_key2];
			}

			return _path.resolve.apply(undefined, args);
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
				return new (_bind.apply(Pattern, [null].concat(args)))();

			case 2:
				return context$1$0.abrupt('return', context$1$0.sent);

			case 3:
			case 'end':
				return context$1$0.stop();
		}
	}, null, this);
}