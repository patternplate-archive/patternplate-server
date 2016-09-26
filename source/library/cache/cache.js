import lrucache from 'lru-cache';
import {get} from 'lodash';

const namespace = new WeakMap();

function select(instance, keyPath) {
	const context = namespace.get(instance) || {};
	return get(context, keyPath);
}

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
		const cache = select(this, 'cache');

		if (!cache) {
			return;
		}

		return cache.set(key, {mtime, value, meta});
	}

	get(key, mtime) {
		const cache = select(this, 'cache');

		if (!cache) {
			return null;
		}

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
		const cache = select(this, 'cache');
		return cache ? cache.peek(key) : false;
	}

	get length() {
		const cache = select(this, 'cache');
		return cache ? cache.length : 0;
	}

	get itemCount() {
		const cache = select(this, 'cache');
		return cache ? cache.itemCount : 0;
	}
}

function patternCacheFactory(...args) {
	return new PatternCache(...args);
}

export default patternCacheFactory;
export {PatternCache as PatternCache};
