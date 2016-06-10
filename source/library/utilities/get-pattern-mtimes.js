import {dirname, basename, resolve} from 'path';
import {readFile, stat} from 'fs';
import fs from 'q-io/fs';
import denodeify from 'denodeify';
import {find} from 'lodash';
import {pathToId} from 'patternplate-transforms-core';

const fsStat = denodeify(stat);
const read = denodeify(readFile);

async function readManifest(path) {
	return await read(resolve(path, 'pattern.json'))
		.then(content => JSON.parse(content.toString('utf-8')));
}

async function getPatternFilesMtime(files) {
	const tasks = files
		.map(async file => {
			const {mtime} = await fsStat(file);
			return mtime;
		});

	return await Promise.all(tasks);
}

async function getModifiedFiles(mtime, files) {
	const mtimes = await getPatternFilesMtime(files);
	return files.filter((file, index) => {
		return mtimes[index].getTime() > mtime;
	});
}

function getLatestMtime(mtimes) {
	const times = mtimes.map(mtime => {
		return {stamp: mtime.getTime(), date: mtime};
	});

	const latest = times.sort((a, b) => b.stamp - a.stamp)[0];
	return latest.date;
}

function getDependencyMtimes(pattern, patterns) {
	const manifest = pattern.manifest;
	const dependencyIds = Object.values(manifest.patterns || {});
	return dependencyIds
		.map(id => find(patterns, {id}))
		.reduce((mtimes, dependency) => {
			if (!dependency) {
				return mtimes;
			}

			return [...mtimes, dependency.mtime, ...getDependencyMtimes(dependency)];
		}, []);
}

const defaults = {
	resolveDependencies: false
};

async function getPatternMtimes(search, options) {
	const paths = await fs.listTree(search);
	const settings = {...defaults, ...options};

	const items = paths
		.filter(item => basename(item) === 'pattern.json')
		.filter(item => !item.includes('@environments'))
		.map(item => {
			const id = pathToId(search, item);
			const path = dirname(item);
			const files = fs.listTree(path);
			const manifest = readManifest(path);
			return {id, path, files, manifest};
		});

	const readTasks = items.map(async item => {
		const mtimes = await getPatternFilesMtime(await item.files);
		const mtime = await getLatestMtime(mtimes);

		return {
			...item,
			files: await item.files,
			mtime,
			mtimes
		};
	});

	const readPatterns = await Promise.all(readTasks);

	return await Promise.all(readPatterns.map(async readPattern => {
		readPattern.manifest = await readPattern.manifest;
		const dependencyMtimes = settings.resolveDependencies ?
			getDependencyMtimes(readPattern, readPatterns) :
			[];

		const mtime = getLatestMtime([readPattern.mtime, ...dependencyMtimes]);

		readPattern.mtime = mtime;
		return readPattern;
	}));
}

export default getPatternMtimes;
export {getModifiedFiles};
