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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NvdXJjZS9hcHBsaWNhdGlvbi9ob29rcy9wYXR0ZXJucy9wYXR0ZXJuLWNhY2hlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7d0JBQXFCLFdBQVc7Ozs7QUFFaEMsSUFBTSxTQUFTLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQzs7SUFFMUIsWUFBWTtjQUFaLFlBQVk7O1NBQ0M7QUFDakIsUUFBSyxFQUFFLEtBQUs7R0FDWjs7OztBQUVXLFVBTFAsWUFBWSxHQUtVO01BQWQsT0FBTyx5REFBRyxFQUFFOzt3QkFMcEIsWUFBWTs7QUFNaEIsTUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsWUFBWSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDekUsTUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUM7QUFDdEIsTUFBSSxLQUFLLEdBQUcsMkJBQVMsUUFBUSxDQUFDLENBQUM7QUFDL0IsV0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFFLEtBQUssRUFBTCxLQUFLLEVBQUUsQ0FBQyxDQUFDO0VBQ3pDOztjQVZJLFlBQVk7O1NBWWIsYUFBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUU7d0JBQ2IsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUM7O09BQTdCLEtBQUssa0JBQUwsS0FBSzs7QUFDWCxVQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEVBQUMsS0FBSyxFQUFMLEtBQUssRUFBRSxLQUFLLEVBQUwsS0FBSyxFQUFFLElBQUksRUFBSixJQUFJLEVBQUMsQ0FBQyxDQUFDO0dBQzVDOzs7U0FFRyxhQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFO3lCQUNOLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDOztPQUE3QixLQUFLLG1CQUFMLEtBQUs7O0FBQ1gsT0FBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFNUIsT0FBSSxPQUFPLE1BQU0sS0FBSyxXQUFXLEVBQUU7QUFDbEMsV0FBTyxJQUFJLENBQUM7SUFDWjs7T0FFYSxXQUFXLEdBQStCLE1BQU0sQ0FBekQsT0FBTztPQUF1QixVQUFVLEdBQVcsTUFBTSxDQUFuQyxNQUFNO09BQWMsS0FBSyxHQUFJLE1BQU0sQ0FBZixLQUFLOztBQUVwRCxPQUFJLEtBQUssS0FBSyxLQUFLLEVBQUU7QUFDcEIsV0FBTyxLQUFLLENBQUM7SUFDYjs7QUFFRCxPQUFJLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQzVDLFNBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDZixXQUFPLElBQUksQ0FBQztJQUNaOztBQUVELFVBQU8sS0FBSyxDQUFDO0dBQ2I7OztTQUVJLGNBQUMsR0FBRyxFQUFFO3lCQUNNLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDOztPQUE3QixLQUFLLG1CQUFMLEtBQUs7O0FBQ1gsVUFBTyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0dBQ3ZCOzs7T0FFUyxlQUFHO3lCQUNJLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDOztPQUE3QixLQUFLLG1CQUFMLEtBQUs7O0FBQ1gsVUFBTyxLQUFLLENBQUMsTUFBTSxDQUFDO0dBQ3BCOzs7T0FFWSxlQUFFO3lCQUNFLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDOztPQUE3QixLQUFLLG1CQUFMLEtBQUs7O0FBQ1gsVUFBTyxLQUFLLENBQUMsU0FBUyxDQUFDO0dBQ3ZCOzs7UUFwREksWUFBWTs7O0FBdURsQixTQUFTLG1CQUFtQixHQUFXO21DQUFOLElBQUk7QUFBSixNQUFJOzs7QUFDcEMseUJBQVcsWUFBWSxnQkFBSSxJQUFJLE1BQUU7Q0FDakM7O3FCQUVjLG1CQUFtQjtRQUNULFlBQVksR0FBNUIsWUFBWSIsImZpbGUiOiJwYXR0ZXJuLWNhY2hlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGxydWNhY2hlIGZyb20gJ2xydS1jYWNoZSc7XG5cbmNvbnN0IG5hbWVzcGFjZSA9IG5ldyBXZWFrTWFwKCk7XG5cbmNsYXNzIFBhdHRlcm5DYWNoZSB7XG5cdHN0YXRpYyBkZWZhdWx0cyA9IHtcblx0XHQnbWF4JzogNTAwMDBcblx0fTtcblxuXHRjb25zdHJ1Y3RvciAob3B0aW9ucyA9IHt9KSB7XG5cdFx0bGV0IHNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgUGF0dGVybkNhY2hlLmRlZmF1bHRzLCBvcHRpb25zLm9wdGlvbnMpO1xuXHRcdHRoaXMuY29uZmlnID0gb3B0aW9ucztcblx0XHRsZXQgY2FjaGUgPSBscnVjYWNoZShzZXR0aW5ncyk7XG5cdFx0bmFtZXNwYWNlLnNldCh0aGlzLCB7IHNldHRpbmdzLCBjYWNoZSB9KTtcblx0fVxuXG5cdHNldCAoa2V5LCBtdGltZSwgdmFsdWUsIG1ldGEpIHtcblx0XHRsZXQgeyBjYWNoZSB9ID0gbmFtZXNwYWNlLmdldCh0aGlzKTtcblx0XHRyZXR1cm4gY2FjaGUuc2V0KGtleSwge210aW1lLCB2YWx1ZSwgbWV0YX0pO1xuXHR9XG5cblx0Z2V0IChrZXksIG10aW1lLCBtZXRhKSB7XG5cdFx0bGV0IHsgY2FjaGUgfSA9IG5hbWVzcGFjZS5nZXQodGhpcyk7XG5cdFx0bGV0IHN0b3JlZCA9IGNhY2hlLmdldChrZXkpO1xuXG5cdFx0aWYgKHR5cGVvZiBzdG9yZWQgPT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cblx0XHRsZXQgeydtdGltZSc6IHN0b3JlZE10aW1lLCAnbWV0YSc6IHN0b3JlZE1ldGEsIHZhbHVlfSA9IHN0b3JlZDtcblxuXHRcdGlmIChtdGltZSA9PT0gZmFsc2UpIHtcblx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHR9XG5cblx0XHRpZiAobmV3IERhdGUoc3RvcmVkTXRpbWUpIDwgbmV3IERhdGUobXRpbWUpKSB7XG5cdFx0XHRjYWNoZS5kZWwoa2V5KTtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdHJldHVybiB2YWx1ZTtcblx0fVxuXG5cdHBlZWsgKGtleSkge1xuXHRcdGxldCB7IGNhY2hlIH0gPSBuYW1lc3BhY2UuZ2V0KHRoaXMpO1xuXHRcdHJldHVybiBjYWNoZS5wZWVrKGtleSk7XG5cdH1cblxuXHRnZXQgbGVuZ3RoKCkge1xuXHRcdGxldCB7IGNhY2hlIH0gPSBuYW1lc3BhY2UuZ2V0KHRoaXMpO1xuXHRcdHJldHVybiBjYWNoZS5sZW5ndGg7XG5cdH1cblxuXHRnZXQgaXRlbUNvdW50KCl7XG5cdFx0bGV0IHsgY2FjaGUgfSA9IG5hbWVzcGFjZS5nZXQodGhpcyk7XG5cdFx0cmV0dXJuIGNhY2hlLml0ZW1Db3VudDtcblx0fVxufVxuXG5mdW5jdGlvbiBwYXR0ZXJuQ2FjaGVGYWN0b3J5ICguLi5hcmdzKSB7XG5cdHJldHVybiBuZXcgUGF0dGVybkNhY2hlKC4uLmFyZ3MpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBwYXR0ZXJuQ2FjaGVGYWN0b3J5O1xuZXhwb3J0IHsgUGF0dGVybkNhY2hlIGFzIFBhdHRlcm5DYWNoZSB9O1xuIl19