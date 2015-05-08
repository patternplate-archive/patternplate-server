'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
var _bind = Function.prototype.bind;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports['default'] = patternFactory;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/* eslint ignore */

var _path = require('path');

var _qIoFs = require('q-io/fs');

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
			var files, file, fileBasename, ext, manifest, patternName, pattern;
			return regeneratorRuntime.async(function read$(context$2$0) {
				while (1) switch (context$2$0.prev = context$2$0.next) {
					case 0:
						context$2$0.next = 2;
						return _qIoFs.exists(path);

					case 2:
						context$2$0.t0 = context$2$0.sent;

						if (!(context$2$0.t0 !== true)) {
							context$2$0.next = 5;
							break;
						}

						throw new Error('Can not read pattern from ' + this.path + ', it does not exist.');

					case 5:
						context$2$0.next = 7;
						return _qIoFs.toObject(path);

					case 7:
						files = context$2$0.sent;
						context$2$0.t1 = regeneratorRuntime.keys(files);

					case 9:
						if ((context$2$0.t2 = context$2$0.t1()).done) {
							context$2$0.next = 23;
							break;
						}

						file = context$2$0.t2.value;
						fileBasename = _path.basename(file);
						ext = _path.extname(file);
						context$2$0.t3 = files[file];
						context$2$0.t4 = files[file];
						context$2$0.t5 = _path.basename(fileBasename, ext);
						context$2$0.t6 = ext.substr(1, ext.length);
						context$2$0.next = 19;
						return _qIoFs.stat(file);

					case 19:
						context$2$0.t7 = context$2$0.sent;
						this.files[fileBasename] = {
							'buffer': context$2$0.t3,
							'source': context$2$0.t4,
							'path': file,
							'ext': ext,
							'name': fileBasename,
							'basename': context$2$0.t5,
							'format': context$2$0.t6,
							'stat': context$2$0.t7
						};
						context$2$0.next = 9;
						break;

					case 23:
						manifest = this.files['pattern.json'];

						if (!(typeof manifest === 'undefined')) {
							context$2$0.next = 26;
							break;
						}

						throw new Error('Can not read pattern.json from ' + this.path + ', it does not exist.');

					case 26:
						context$2$0.prev = 26;

						this.manifest = JSON.parse(manifest.source.toString('utf-8'));
						delete this.files['pattern.json'];
						context$2$0.next = 34;
						break;

					case 31:
						context$2$0.prev = 31;
						context$2$0.t8 = context$2$0['catch'](26);
						throw new Error('Error while reading pattern.json from ' + this.path + ':', context$2$0.t8);

					case 34:
						if (!(typeof this.manifest.patterns !== 'object')) {
							context$2$0.next = 36;
							break;
						}

						return context$2$0.abrupt('return', this);

					case 36:
						context$2$0.t9 = regeneratorRuntime.keys(this.manifest.patterns);

					case 37:
						if ((context$2$0.t10 = context$2$0.t9()).done) {
							context$2$0.next = 45;
							break;
						}

						patternName = context$2$0.t10.value;
						pattern = new Pattern(this.manifest.patterns[patternName], this.base, this.config, this.transforms);
						context$2$0.next = 42;
						return pattern.read();

					case 42:
						this.dependencies[patternName] = context$2$0.sent;
						context$2$0.next = 37;
						break;

					case 45:

						this.getLastModified();
						return context$2$0.abrupt('return', this);

					case 47:
					case 'end':
						return context$2$0.stop();
				}
			}, null, this, [[26, 31]]);
		}
	}, {
		key: 'transform',
		value: function transform() {
			var dependency, demos, fileName, file, formatConfig, transforms, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, transform, fn, dependencyName, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2;

			return regeneratorRuntime.async(function transform$(context$2$0) {
				while (1) switch (context$2$0.prev = context$2$0.next) {
					case 0:
						if (!this.dependencies) {
							context$2$0.next = 8;
							break;
						}

						context$2$0.t11 = regeneratorRuntime.keys(this.dependencies);

					case 2:
						if ((context$2$0.t12 = context$2$0.t11()).done) {
							context$2$0.next = 8;
							break;
						}

						dependency = context$2$0.t12.value;
						context$2$0.next = 6;
						return this.dependencies[dependency].transform();

					case 6:
						context$2$0.next = 2;
						break;

					case 8:
						demos = {};
						context$2$0.t13 = regeneratorRuntime.keys(this.files);

					case 10:
						if ((context$2$0.t14 = context$2$0.t13()).done) {
							context$2$0.next = 41;
							break;
						}

						fileName = context$2$0.t14.value;
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
						_iteratorNormalCompletion = true;
						_didIteratorError = false;
						_iteratorError = undefined;
						context$2$0.prev = 22;

						for (_iterator = transforms[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
							transform = _step.value;
							fn = this.transforms[transform];
						}

						context$2$0.next = 30;
						break;

					case 26:
						context$2$0.prev = 26;
						context$2$0.t15 = context$2$0['catch'](22);
						_didIteratorError = true;
						_iteratorError = context$2$0.t15;

					case 30:
						context$2$0.prev = 30;
						context$2$0.prev = 31;

						if (!_iteratorNormalCompletion && _iterator['return']) {
							_iterator['return']();
						}

					case 33:
						context$2$0.prev = 33;

						if (!_didIteratorError) {
							context$2$0.next = 36;
							break;
						}

						throw _iteratorError;

					case 36:
						return context$2$0.finish(33);

					case 37:
						return context$2$0.finish(30);

					case 38:
						demos[formatConfig.name] = file;
						context$2$0.next = 10;
						break;

					case 41:
						context$2$0.t16 = regeneratorRuntime.keys(this.files);

					case 42:
						if ((context$2$0.t17 = context$2$0.t16()).done) {
							context$2$0.next = 84;
							break;
						}

						fileName = context$2$0.t17.value;
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

						_iteratorNormalCompletion2 = true;
						_didIteratorError2 = false;
						_iteratorError2 = undefined;
						context$2$0.prev = 56;
						_iterator2 = transforms[Symbol.iterator]();

					case 58:
						if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
							context$2$0.next = 67;
							break;
						}

						transform = _step2.value;
						fn = this.transforms[transform];
						context$2$0.next = 63;
						return fn(file, demos[formatConfig.name]);

					case 63:
						file = context$2$0.sent;

					case 64:
						_iteratorNormalCompletion2 = true;
						context$2$0.next = 58;
						break;

					case 67:
						context$2$0.next = 73;
						break;

					case 69:
						context$2$0.prev = 69;
						context$2$0.t18 = context$2$0['catch'](56);
						_didIteratorError2 = true;
						_iteratorError2 = context$2$0.t18;

					case 73:
						context$2$0.prev = 73;
						context$2$0.prev = 74;

						if (!_iteratorNormalCompletion2 && _iterator2['return']) {
							_iterator2['return']();
						}

					case 76:
						context$2$0.prev = 76;

						if (!_didIteratorError2) {
							context$2$0.next = 79;
							break;
						}

						throw _iteratorError2;

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
				mtimes.push(new Date(file.stat.node.mtime));
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