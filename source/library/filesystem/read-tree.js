import path from 'path';
import {readdir, stat as fsStat} from 'mz/fs';
import {flattenDeep, memoize} from 'lodash';
import exists from 'path-exists';

export default readTree;

const read = memoize(readdir);
const stat = memoize(fsStat);

async function readTree(directoryPath) {
	if (!await exists(directoryPath)) {
		return [];
	}

	const stats = await stat(directoryPath);

	if (stats.isFile()) {
		return [directoryPath];
	}

	if (stats.isDirectory()) {
		const list = await read(directoryPath);
		const jobs = list.map(item => readTree(path.resolve(directoryPath, item)));
		return flattenDeep(await Promise.all(jobs));
	}
}
