import lrucache from 'lru-cache';
import sizeof from 'object-sizeof';

const SETTINGS = Symbol('settings');
const CACHE = Symbol('cache');

function patternCacheFactory (...args) {
	const namespace = new WeakMap();

	class PatternCache {
		static defaults = {
			'max': 50000
		};

		constructor (options = {}) {
			let settings = Object.assign({}, PatternCache.defaults, options.options);
			this.config = options;
			let cache = lrucache(settings);
			namespace.set(SETTINGS, settings);
			namespace.set(CACHE, cache);
		}

		set (key, mtime, value, meta) {
			let cache = namespace.get(CACHE);
			return cache.set(key, {mtime, value, meta});
		}

		get (key, mtime, meta) {
			let cache = namespace.get(CACHE);
			let stored = cache.get(key);

			if (typeof stored === 'undefined') {
				return null;
			}

			let {'mtime': storedMtime, 'meta': storedMeta, value} = stored;

			if (mtime === false) {
				return value;
			}

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
