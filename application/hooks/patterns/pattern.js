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

		_classCallCheck(this, Pattern);

		this.__initializeProperties();

		this.id = id;
		this.base = base;
		this.path = Pattern.resolve(this.base, this.id);
		this.config = config;
		this.transforms = transforms;
	}

	_createClass(Pattern, [{
		key: 'read',
		value: function read() {
			var path = arguments[0] === undefined ? this.path : arguments[0];

			var files, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, file, fileBasename, ext, buffer, manifest, patternName, pattern;

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
							context$2$0.next = 32;
							break;
						}

						file = _step.value;
						fileBasename = (0, _path.basename)(file);
						ext = (0, _path.extname)(file);
						context$2$0.next = 21;
						return _qIoFs2['default'].read(file);

					case 21:
						buffer = context$2$0.sent;
						context$2$0.t1 = (0, _path.basename)(fileBasename, ext);
						context$2$0.t2 = ext.substr(1, ext.length);
						context$2$0.next = 26;
						return _qIoFs2['default'].stat(file);

					case 26:
						context$2$0.t3 = context$2$0.sent;
						this.files[fileBasename] = {
							'source': buffer,
							'path': file,
							'ext': ext,
							'name': fileBasename,
							'basename': context$2$0.t1,
							'format': context$2$0.t2,
							'fs': context$2$0.t3
						};

						this.files[fileBasename].buffer = this.files[fileBasename].source;

					case 29:
						_iteratorNormalCompletion = true;
						context$2$0.next = 15;
						break;

					case 32:
						context$2$0.next = 38;
						break;

					case 34:
						context$2$0.prev = 34;
						context$2$0.t4 = context$2$0['catch'](13);
						_didIteratorError = true;
						_iteratorError = context$2$0.t4;

					case 38:
						context$2$0.prev = 38;
						context$2$0.prev = 39;

						if (!_iteratorNormalCompletion && _iterator['return']) {
							_iterator['return']();
						}

					case 41:
						context$2$0.prev = 41;

						if (!_didIteratorError) {
							context$2$0.next = 44;
							break;
						}

						throw _iteratorError;

					case 44:
						return context$2$0.finish(41);

					case 45:
						return context$2$0.finish(38);

					case 46:
						manifest = this.files['pattern.json'];

						if (!(typeof manifest === 'undefined')) {
							context$2$0.next = 49;
							break;
						}

						throw new Error('Can not read pattern.json from ' + this.path + ', it does not exist.');

					case 49:
						context$2$0.prev = 49;

						this.manifest = JSON.parse(manifest.source.toString('utf-8'));
						delete this.files['pattern.json'];
						context$2$0.next = 57;
						break;

					case 54:
						context$2$0.prev = 54;
						context$2$0.t5 = context$2$0['catch'](49);
						throw new Error('Error while reading pattern.json from ' + this.path + ':', context$2$0.t5);

					case 57:
						if (!(typeof this.manifest.patterns !== 'object')) {
							context$2$0.next = 59;
							break;
						}

						return context$2$0.abrupt('return', this);

					case 59:
						context$2$0.t6 = regeneratorRuntime.keys(this.manifest.patterns);

					case 60:
						if ((context$2$0.t7 = context$2$0.t6()).done) {
							context$2$0.next = 68;
							break;
						}

						patternName = context$2$0.t7.value;
						pattern = new Pattern(this.manifest.patterns[patternName], this.base, this.config, this.transforms);
						context$2$0.next = 65;
						return pattern.read();

					case 65:
						this.dependencies[patternName] = context$2$0.sent;
						context$2$0.next = 60;
						break;

					case 68:

						this.getLastModified();
						return context$2$0.abrupt('return', this);

					case 70:
					case 'end':
						return context$2$0.stop();
				}
			}, null, this, [[13, 34, 38, 46], [39,, 41, 45], [49, 54]]);
		}
	}, {
		key: 'transform',
		value: function transform() {
			var dependency, demos, fileName, file, formatConfig, transforms, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, transform, fn, dependencyName, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3;

			return regeneratorRuntime.async(function transform$(context$2$0) {
				while (1) switch (context$2$0.prev = context$2$0.next) {
					case 0:
						if (!this.dependencies) {
							context$2$0.next = 8;
							break;
						}

						context$2$0.t8 = regeneratorRuntime.keys(this.dependencies);

					case 2:
						if ((context$2$0.t9 = context$2$0.t8()).done) {
							context$2$0.next = 8;
							break;
						}

						dependency = context$2$0.t9.value;
						context$2$0.next = 6;
						return this.dependencies[dependency].transform();

					case 6:
						context$2$0.next = 2;
						break;

					case 8:
						demos = {};
						context$2$0.t10 = regeneratorRuntime.keys(this.files);

					case 10:
						if ((context$2$0.t11 = context$2$0.t10()).done) {
							context$2$0.next = 41;
							break;
						}

						fileName = context$2$0.t11.value;
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
						transforms = formatConfig.transforms || [];
						_iteratorNormalCompletion2 = true;
						_didIteratorError2 = false;
						_iteratorError2 = undefined;
						context$2$0.prev = 22;

						for (_iterator2 = transforms[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
							transform = _step2.value;
							fn = this.transforms[transform];
						}

						context$2$0.next = 30;
						break;

					case 26:
						context$2$0.prev = 26;
						context$2$0.t12 = context$2$0['catch'](22);
						_didIteratorError2 = true;
						_iteratorError2 = context$2$0.t12;

					case 30:
						context$2$0.prev = 30;
						context$2$0.prev = 31;

						if (!_iteratorNormalCompletion2 && _iterator2['return']) {
							_iterator2['return']();
						}

					case 33:
						context$2$0.prev = 33;

						if (!_didIteratorError2) {
							context$2$0.next = 36;
							break;
						}

						throw _iteratorError2;

					case 36:
						return context$2$0.finish(33);

					case 37:
						return context$2$0.finish(30);

					case 38:
						demos[formatConfig.name] = file;
						context$2$0.next = 10;
						break;

					case 41:
						context$2$0.t13 = regeneratorRuntime.keys(this.files);

					case 42:
						if ((context$2$0.t14 = context$2$0.t13()).done) {
							context$2$0.next = 84;
							break;
						}

						fileName = context$2$0.t14.value;
						file = this.files[fileName];

						if (!(file.basename === 'demo')) {
							context$2$0.next = 47;
							break;
						}

						return context$2$0.abrupt('continue', 42);

					case 47:
						formatConfig = this.config.formats[file.format];

						if (!(typeof formatConfig !== 'object')) {
							context$2$0.next = 50;
							break;
						}

						return context$2$0.abrupt('continue', 42);

					case 50:
						transforms = formatConfig.transforms || [];

						file.dependencies = {};

						for (dependencyName in this.dependencies) {
							file.dependencies[dependencyName] = this.dependencies[dependencyName].results[formatConfig.name];
						}

						_iteratorNormalCompletion3 = true;
						_didIteratorError3 = false;
						_iteratorError3 = undefined;
						context$2$0.prev = 56;
						_iterator3 = transforms[Symbol.iterator]();

					case 58:
						if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
							context$2$0.next = 67;
							break;
						}

						transform = _step3.value;
						fn = this.transforms[transform];
						context$2$0.next = 63;
						return fn(file, demos[formatConfig.name]);

					case 63:
						file = context$2$0.sent;

					case 64:
						_iteratorNormalCompletion3 = true;
						context$2$0.next = 58;
						break;

					case 67:
						context$2$0.next = 73;
						break;

					case 69:
						context$2$0.prev = 69;
						context$2$0.t15 = context$2$0['catch'](56);
						_didIteratorError3 = true;
						_iteratorError3 = context$2$0.t15;

					case 73:
						context$2$0.prev = 73;
						context$2$0.prev = 74;

						if (!_iteratorNormalCompletion3 && _iterator3['return']) {
							_iterator3['return']();
						}

					case 76:
						context$2$0.prev = 76;

						if (!_didIteratorError3) {
							context$2$0.next = 79;
							break;
						}

						throw _iteratorError3;

					case 79:
						return context$2$0.finish(76);

					case 80:
						return context$2$0.finish(73);

					case 81:

						this.results[formatConfig.name] = file;
						context$2$0.next = 42;
						break;

					case 84:
					case 'end':
						return context$2$0.stop();
				}
			}, null, this, [[22, 26, 30, 38], [31,, 33, 37], [56, 69, 73, 81], [74,, 76, 80]]);
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

			var _iteratorNormalCompletion4 = true;
			var _didIteratorError4 = false;
			var _iteratorError4 = undefined;

			try {
				for (var _iterator4 = Object.keys(this.results)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
					var resultName = _step4.value;

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