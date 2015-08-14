import lrucache from 'lru-cache';

const namespace = new WeakMap();

class PatternCache {
	static defaults = {
		'max': 50000
	};

	constructor (options = {}) {
		let settings = Object.assign({}, PatternCache.defaults, options.options);
		this.config = options;
		let cache = lrucache(settings);
		namespace.set(this, { settings, cache });
	}

	set (key, mtime, value, meta) {
		let { cache } = namespace.get(this);
		return cache.set(key, {mtime, value, meta});
	}

	get (key, mtime, meta) {
		let { cache } = namespace.get(this);
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
		let { cache } = namespace.get(this);
		return cache.peek(key);
	}

	get length() {
		let { cache } = namespace.get(this);
		return cache.length;
	}

	get itemCount(){
		let { cache } = namespace.get(this);
		return cache.itemCount;
	}
}

function patternCacheFactory (...args) {
	return new PatternCache(...args);
}

export default patternCacheFactory;
export { PatternCache as PatternCache };
