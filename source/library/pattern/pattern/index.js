/* eslint-disable max-len*/
import path from 'path';
import {merge} from 'lodash';
import fauxCache from './faux-cache';
import fauxLog from './faux-log';
import inject from './inject';
import read from './read';
import readManifest from './read-manifest';
import transform from './transform';

const defaultFilters = {environments: [], inFormats: [], outFormats: []};

export class Pattern {
	constructor(patternPath, base, config = {}, transforms = {}, filters = {}, cache = null) {
		const id = patternPath.split(path.sep).join('/');

		merge(this, {
			base,
			cache: cache || fauxCache,
			config: {parents: [], ...config},
			dependencies: {},
			environments: {index: {manifest: {name: 'index'}}},
			files: {},
			filters: merge({}, defaultFilters, filters),
			id,
			isEnvironment: id.includes('@environment'),
			log: config.log || fauxLog,
			manifest: {},
			path: path.resolve(base, id),
			results: {},
			transforms
		});
	}

	inject(args) {
		inject(...[this, ...args]);
		return this;
	}

	async read(path = this.path) {
		await read(...[this, path]);
		return this;
	}

	async readManifest(path = this.path) {
		await readManifest(...[this, path]);
		return this;
	}

	async transform(...args) {
		await transform(...[this, ...args]);
		return this;
	}
}

export default async function patternFactory(...args) {
	return await new Pattern(...args);
}
