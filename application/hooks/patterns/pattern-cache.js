'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
var _bind = Function.prototype.bind;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lruCache = require('lru-cache');

var _lruCache2 = _interopRequireDefault(_lruCache);

var SETTINGS = Symbol('settings');
var CACHE = Symbol('cache');

function patternCacheFactory() {
	for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
		args[_key] = arguments[_key];
	}

	var namespace = new WeakMap();

	var PatternCache = (function () {
		function PatternCache() {
			var options = arguments[0] === undefined ? {} : arguments[0];

			_classCallCheck(this, PatternCache);

			var settings = Object.assign({}, PatternCache.defaults, options);
			var cache = (0, _lruCache2['default'])(Object.assign(settings, {
				'length': function length(n) {
					return n.value.fs.size;
				}
			}));

			namespace.set(SETTINGS, settings);
			namespace.set(CACHE, cache);
		}

		_createClass(PatternCache, [{
			key: 'set',
			value: function set(key, mtime, value) {
				var cache = namespace.get(CACHE);
				return cache.set(key, { mtime: mtime, value: value });
			}
		}, {
			key: 'get',
			value: function get(key, mtime) {
				var cache = namespace.get(CACHE);
				var stored = cache.get(key);

				if (typeof stored === 'undefined') {
					return;
				}

				var storedMtime = stored['mtime'];
				var value = stored.value;

				if (new Date(storedMtime) < new Date(mtime)) {
					cache.del(key);
					return;
				}

				return value;
			}
		}, {
			key: 'peek',
			value: function peek(key) {
				var cache = namespace.get(CACHE);
				return cache.peek(key);
			}
		}, {
			key: 'length',
			get: function () {
				var cache = namespace.get(CACHE);
				return cache.length;
			}
		}, {
			key: 'itemCount',
			get: function () {
				var cache = namespace.get(CACHE);
				return cache.itemCount;
			}
		}], [{
			key: 'defaults',
			value: {
				'max': 50000
			},
			enumerable: true
		}]);

		return PatternCache;
	})();

	return new (_bind.apply(PatternCache, [null].concat(args)))();
}

exports['default'] = patternCacheFactory;
module.exports = exports['default'];