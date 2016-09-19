import lrucache from 'lru-cache';

const namespace = new WeakMap();

class PatternCache {
	static defaults = {
		max: 50000
	};

	constructor(options = {}) {
		const settings = {...PatternCache.defaults, ...options.options};
		this.config = settings;
		const cache = lrucache(settings);
		namespace.set(this, {settings, cache});
	}

	set(key, mtime, value, meta) {
		const {cache} = namespace.get(this);
		return cache.set(key, {mtime, value, meta});
	}

	get(key, mtime) {
		const {cache} = namespace.get(this);
		const stored = cache.get(key);

		if (typeof stored === 'undefined') {
			return null;
		}

		const {'mtime': storedMtime, value} = stored;

		if (mtime === false) {
			return value;
		}

		if (new Date(storedMtime) < new Date(mtime)) {
			cache.del(key);
			return null;
		}

		return value;
	}

	peek(key) {
		const {cache} = namespace.get(this);
		return cache.peek(key);
	}

	get length() {
		const {cache} = namespace.get(this);
		return cache.length;
	}

	get itemCount() {
		const {cache} = namespace.get(this);
		return cache.itemCount;
	}
}

function patternCacheFactory(...args) {
	return new PatternCache(...args);
}

export default patternCacheFactory;
export {PatternCache as PatternCache};
