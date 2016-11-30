import path from 'path';
import {readdir, stat} from 'mz/fs';
import {flattenDeep} from 'lodash';
import exists from 'path-exists';

export default readTree;

async function readTree(directoryPath) {
	if (!await exists(directoryPath)) {
		return [];
	}

	const stats = await stat(directoryPath);

	if (stats.isFile()) {
		return [directoryPath];
	}

	if (stats.isDirectory()) {
		const list = await readdir(directoryPath);
		const jobs = list.map(item => readTree(path.resolve(directoryPath, item)));
		return flattenDeep(await Promise.all(jobs));
	}
}
