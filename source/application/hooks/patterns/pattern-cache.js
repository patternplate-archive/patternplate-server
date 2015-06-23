import lrucache from 'lru-cache';

const SETTINGS = Symbol('settings');
const CACHE = Symbol('cache');

function patternCacheFactory (...args) {
	const namespace = new WeakMap();

	class PatternCache {
		static defaults = {
			'max': 50000
		};

		constructor (options = {}) {
			let settings = Object.assign({}, PatternCache.defaults, options);
			let cache = lrucache(Object.assign(settings, {
				'length': (n) => n.value.fs.size
			}));

			namespace.set(SETTINGS, settings);
			namespace.set(CACHE, cache);
		}

		set (key, mtime, value) {
			let cache = namespace.get(CACHE);
			return cache.set(key, {mtime, value});
		}

		get (key, mtime) {
			let cache = namespace.get(CACHE);
			let stored = cache.get(key);

			if (typeof stored === 'undefined') {
				return null;
			}

			let {'mtime': storedMtime, value} = stored;

			if (new Date(storedMtime) < new Date(mtime)) {
				cache.del(key);
				return null;
			}

			return value;
		}

		peek (key) {
			let cache = namespace.get(CACHE);
			return cache.peek(key);
		}

		get length() {
			let cache = namespace.get(CACHE);
			return cache.length;
		}

		get itemCount(){
			let cache = namespace.get(CACHE);
			return cache.itemCount;
		}
	}


	return new PatternCache(...args);
}

export default patternCacheFactory;
