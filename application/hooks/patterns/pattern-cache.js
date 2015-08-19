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

var namespace = new WeakMap();

var PatternCache = (function () {
	_createClass(PatternCache, null, [{
		key: 'defaults',
		value: {
			'max': 50000
		},
		enumerable: true
	}]);

	function PatternCache() {
		var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		_classCallCheck(this, PatternCache);

		var settings = Object.assign({}, PatternCache.defaults, options.options);
		this.config = options;
		var cache = (0, _lruCache2['default'])(settings);
		namespace.set(this, { settings: settings, cache: cache });
	}

	_createClass(PatternCache, [{
		key: 'set',
		value: function set(key, mtime, value, meta) {
			var _namespace$get = namespace.get(this);

			var cache = _namespace$get.cache;

			return cache.set(key, { mtime: mtime, value: value, meta: meta });
		}
	}, {
		key: 'get',
		value: function get(key, mtime, meta) {
			var _namespace$get2 = namespace.get(this);

			var cache = _namespace$get2.cache;

			var stored = cache.get(key);

			if (typeof stored === 'undefined') {
				return null;
			}

			var storedMtime = stored['mtime'];
			var storedMeta = stored['meta'];
			var value = stored.value;

			if (mtime === false) {
				return value;
			}

			if (new Date(storedMtime) < new Date(mtime)) {
				cache.del(key);
				return null;
			}

			return value;
		}
	}, {
		key: 'peek',
		value: function peek(key) {
			var _namespace$get3 = namespace.get(this);

			var cache = _namespace$get3.cache;

			return cache.peek(key);
		}
	}, {
		key: 'length',
		get: function get() {
			var _namespace$get4 = namespace.get(this);

			var cache = _namespace$get4.cache;

			return cache.length;
		}
	}, {
		key: 'itemCount',
		get: function get() {
			var _namespace$get5 = namespace.get(this);

			var cache = _namespace$get5.cache;

			return cache.itemCount;
		}
	}]);

	return PatternCache;
})();

function patternCacheFactory() {
	for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
		args[_key] = arguments[_key];
	}

	return new (_bind.apply(PatternCache, [null].concat(args)))();
}

exports['default'] = patternCacheFactory;
exports.PatternCache = PatternCache;