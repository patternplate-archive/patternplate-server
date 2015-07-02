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

var _objectSizeof = require('object-sizeof');

var _objectSizeof2 = _interopRequireDefault(_objectSizeof);

var SETTINGS = Symbol('settings');
var CACHE = Symbol('cache');

function patternCacheFactory() {
	var namespace = new WeakMap();

	var PatternCache = (function () {
		function PatternCache() {
			var options = arguments[0] === undefined ? {} : arguments[0];

			_classCallCheck(this, PatternCache);

			var settings = Object.assign({}, PatternCache.defaults, options.options);
			this.config = options;

			if (settings.max !== Infinity) {
				settings.length = function (n) {
					return (0, _objectSizeof2['default'])(n.value) / 4;
				};
			}

			var cache = (0, _lruCache2['default'])(settings);

			namespace.set(SETTINGS, settings);
			namespace.set(CACHE, cache);
		}

		_createClass(PatternCache, [{
			key: 'set',
			value: function set(key, mtime, value, meta) {
				var cache = namespace.get(CACHE);
				return cache.set(key, { mtime: mtime, value: value, meta: meta });
			}
		}, {
			key: 'get',
			value: function get(key, mtime, meta) {
				var cache = namespace.get(CACHE);
				var stored = cache.get(key);

				if (typeof stored === 'undefined') {
					return null;
				}

				var storedMtime = stored['mtime'];
				var storedMeta = stored['meta'];
				var value = stored.value;

				/*if (meta && storedMeta) {
    	let matchesEnvironments = storedMeta.environments.length === 0;
    	let matchesFormats = storedMeta.environments.length === 0;
    		if (storedMeta.environments.length > 0) {
    		matchesEnvironments = meta.environments.filter((env) => storedMeta.environments.includes(env)).length > 0;
    	}
    		if (!matchesEnvironments) {
    		return null;
    	}
    		if (storedMeta.formats.length > 0) {
    		matchesFormats = meta.environments.filter((env) => storedMeta.formats.includes(env)).length > 0;
    	}
    		if (!matchesFormats) {
    		return null;
    	}
    } */

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
				var cache = namespace.get(CACHE);
				return cache.peek(key);
			}
		}, {
			key: 'length',
			get: function get() {
				var cache = namespace.get(CACHE);
				return cache.length;
			}
		}, {
			key: 'itemCount',
			get: function get() {
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

	for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
		args[_key] = arguments[_key];
	}

	return new (_bind.apply(PatternCache, [null].concat(args)))();
}

exports['default'] = patternCacheFactory;
module.exports = exports['default'];