import path from 'path';
import {readdir, stat} from 'mz/fs';
import {flattenDeep} from 'lodash';
import exists from 'path-exists';

export default readTree;

const cacheShim = {
	peek() {
		return false;
	},
	get() {
		return null;
	},
	set() {
		return null;
	}
};

async function readTree(directoryPath, cache = cacheShim) {
	const treeExists = withCache(exists, cache, 'readTree:exists:', false);

	if (!await treeExists(directoryPath)) {
		return [];
	}

	const treeStats = withCache(stat, cache, 'readTree:stat:', false);
	const stats = await treeStats(directoryPath);

	if (stats.isFile()) {
		return [directoryPath];
	}

	const treeDir = withCache(readdir, cache, 'readTree:list:', stats.mtime);
	const list = await treeDir(directoryPath);

	const tree = withCache(readTree, cache, 'readTree', stats.mtime);

	const jobs = list.map(item => tree(path.resolve(directoryPath, item)));
	return flattenDeep(await Promise.all(jobs));
}

function withCache(fn, cache, key, mtime) {
	return async input => {
		const id = `${key}${input}`;
		const result = cache.get(id, mtime) || await fn(input);
		cache.set(id, mtime, result);
		return result;
	};
}
