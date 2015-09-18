import {resolve, basename, extname, dirname, join, sep} from 'path';

import qfs from 'q-io/fs';
import semver from 'semver';
import merge from 'lodash.merge';
import minimatch from 'minimatch';

// Find the newest mtime of a file dependency tree
function getLastModified(file) {
	let mtimes = [file.fs.node.mtime];

	for (let dependencyName of Object.keys(file.dependencies)) {
		mtimes.push(getLastModified(file.dependencies[dependencyName]));
	}

	return mtimes.sort((a, b) => b - a)[0];
}

export class Pattern {
	files = {};
	config = {};
	manifest = {};
	dependencies = {};
	results = {};
	mtime = null;

	constructor(patternPath, base, config = {}, transforms = {}, filters = {}, cache = null) {
		const id = patternPath.split(sep).join('/');

		Object.assign(this, {
			id, base, cache, config, transforms, filters,
			path: Pattern.resolve(base, id),
			environments: {
				'index': {
					'manifest': { 'name': 'index' }
				}
			},
			isEnvironment: id.includes('@environment')
		});
	}

	static resolve(...args) {
		return resolve(...args);
	}

	async readEnvironments() {
		let environmentsPath = resolve(this.base, '@environments');
		let results = this.environments;

		if ( !await qfs.exists(environmentsPath)) {
			return results;
		}

		let environments = await qfs.listTree(environmentsPath);
		let manifestPaths = environments
			.filter((environment) => basename(environment) === 'pattern.json');

		for (let manifestPath of manifestPaths) {
			let manifest = JSON.parse(await qfs.read(manifestPath));
			let environmentName = manifest.name || dirname(manifestPath);

			if (this.isEnvironment && environmentName !== basename(this.id)) {
				if (environmentName in this.environments) {
					delete this.environments[environmentName];
				}
				continue;
			}

			if (this.filters.environments && this.filters.environments.length > 0) {
				if (this.filters.environments.includes(environmentName)) {
					results[environmentName] = { manifest };
				}
			} else {
				results[environmentName] = { manifest };
			}
		}

		return results;
	}

	async readManifest(path = this.path, fs = qfs) {
		fs.exists = fs.exists.bind(fs);

		if ( await fs.exists(path) !== true ) {
			throw new Error(`Can not read pattern from ${this.path}, it does not exist.`, {
				'fileName': this.path,
				'pattern': this.id
			});
		}

		let manifestPath = resolve(this.path, 'pattern.json');

		if (!await fs.exists(manifestPath)) {
			throw new Error(`Can not read pattern.json from ${this.path}, it does not exist.`, {
				'fileName': this.path,
				'pattern': this.id
			});
		}

		try {
			let manifestData = JSON.parse(await fs.read(manifestPath));
			this.manifest = Object.assign({}, {
				'version': '0.1.0',
				'build': true,
				'display': true
			}, this.manifest, manifestData);
		} catch (error) {
			throw new Error(`Error while reading pattern.json from ${this.path}`, {
				'file': this.path,
				'pattern': this.id,
				'stack': error.stack
			});
		}

		if (this.isEnvironment && !this.manifest.patterns) {
			let list = await qfs.listTree(this.base);
			let range = this.manifest.range || '*';

			list = list
				.filter((item) => basename(item) === 'pattern.json')
				.filter((item) => !item.includes('@environment'))
				.map((item) => qfs.relativeFromDirectory(this.base, dirname(item)))
				.filter((item) => item !== this.id);

			if (this.manifest.include) {
				let include = Array.prototype.concat.call([], this.manifest.include, ['']);
				list = list.filter((item) => minimatch(item, `{${include.join(',')}}` ));
			}

			if (this.manifest.exclude) {
				let exclude = Array.prototype.concat.call([], this.manifest.exclude, ['']);
				list = list.filter((item) => !minimatch(item, `{${exclude.join(',')}}` ));
			}

			this.manifest.patterns = list.reduce((results, item) => Object.assign(results, {[item]: `${item}@${range}`}), {});
		}

		for (let patternName of Object.keys(this.manifest.patterns || {})) {
			let patternIDString = this.manifest.patterns[patternName];
			let patternBaseName = basename(patternIDString);
			let patternBaseNameFragments = patternBaseName.split('@');
			let patternRange = semver.validRange(patternBaseNameFragments[1]) || '*';

			if (!patternRange) {
				throw new Error(`${patternBaseNameFragments[1]} in ${patternIDString} is no valid semver range.`, {
					'file': this.path,
					'pattern': this.id
				});
			}

			let patternID = join(dirname(patternIDString), patternBaseNameFragments[0]);
			let pattern = new Pattern(patternID, this.base, this.config, this.transforms, this.filters, this.cache);

			this.dependencies[patternName] = await pattern.read(pattern.path);

			if (!semver.satisfies(pattern.manifest.version, patternRange)) {
				if (!this.isEnvironment) {
					throw new Error(`${pattern.id} at version ${pattern.manifest.version} does not satisfy range ${patternRange} specified by ${this.id}.`, {
						'file': pattern.path,
						'pattern': this.id
					});
				} else {
					delete this.dependencies[patternName];
					console.warn(`Omitting ${pattern.id} at version ${pattern.manifest.version} from build. It does not satisfy range ${patternRange} specified by ${this.id}.`);
				}
			}
		}

		await this.getLastModified();
		return this;
	}

	async read(path = this.path, fs = qfs) {
		let readCacheID = `pattern:read:${this.id}`;

		// Use the fast-track read cache from get-patterns if applicable
		if (this.cache && this.cache.config.read && !this.isEnvironment) {
			let cached = this.cache.get(readCacheID, false);

			if (cached) {
				Object.assign(this, cached);
				return this;
			}
		}

		await this.readManifest(path, fs);

		let files = await fs.listTree(path);

		files = files.filter(function(fileName){
			let ext = extname(fileName);
			return ext && ['index', 'demo', 'pattern'].indexOf(basename(fileName, ext)) > -1;
		});

		for (let file of files) {
			let stat = await fs.stat(file);
			let mtime = stat.node.mtime;
			let name = basename(file);

			let data = this.cache ? this.cache.get(file, mtime) : null;

			if (!data) {
				let ext = extname(file);
				let buffer = await fs.read(file);

				data = {
					buffer,
					name,
					'basename': basename(name, ext),
					'ext': ext,
					'format': ext.replace('.', ''),
					'fs': stat,
					'path': file,
					'source': buffer
				};

				if (this.cache) {
					this.cache.set(file, mtime, data);
				}
			}

			this.files[name] = data;
		}

		for ( let fileName in this.files ) {
			let file = this.files[fileName];
			file.dependencies = {};

			if ( file.basename === 'demo' ) {
				continue;
			}

			for (let dependencyName in this.dependencies) {
				let dependencyFile = this.dependencies[dependencyName].files[file.name];

				if (dependencyFile) {
					file.dependencies[dependencyName] = dependencyFile;
				}
			}
		}

		this.getLastModified();
		return this;
	}

	async transform( withDemos = true, forced = false ) {
		await this.readEnvironments();

		let demos = {};

		if (forced) {
			// Add fake/virtual files if forced
			let fs = await qfs.mock(this.path);
			await fs.makeTree(this.path);

			let list = await fs.listTree('/');

			for (let listItem of list) {
				if (await fs.isFile(listItem)) {
					await fs.rename(listItem, fs.join(this.path, fs.base(listItem)));
				}
			}

			for (let formatName of Object.keys(this.config.patterns.formats)) {
				if ( this.config.patterns.formats[formatName].build) {
					await fs.write(resolve(this.path, ['index', formatName].join('.')), '\n');
				}
			}

			await this.read(this.path, fs);
		}

		if (withDemos) {
			for ( let fileName in this.files ) {
				let file = this.files[fileName];

				if ( file.basename !== 'demo' ) {
					continue;
				}

				let formatConfig = this.config.patterns.formats[file.format];

				if (typeof formatConfig !== 'object') {
					continue;
				}

				demos[formatConfig.name] = file;
			}
		}

		for (let environmentName of Object.keys(this.environments)) {
			let environmentData = this.environments[environmentName];
			let environment = environmentData.manifest.environment || {};

			for (let fileName of Object.keys(this.files)) {
				let file = this.files[fileName];

				if (file.basename === 'demo') {
					continue;
				}

				let formatConfig = this.config.patterns.formats[file.format];

				if (typeof formatConfig !== 'object') {
					continue;
				}

				let transforms = formatConfig.transforms || [];
				let lastTransform = this.config.transforms[transforms[transforms.length - 1]] || {};

				// Skip file transform if format filters present and not matching
				if (!this.filters.formats || !this.filters.formats.length || this.filters.formats.includes(lastTransform.outFormat)) {
					for (let transform of transforms) {
						let cacheID = `file:transform:${file.path}:${environmentName}:${transform}`;
						let cached;
						let demo = demos[formatConfig.name];
						let mtime = getLastModified(file);

						// Use latest demo or file mtime
						if (demo) {
							mtime = Math.max(mtime, getLastModified(demo));
						}

						if (this.cache && this.cache.config.transform) {
							cached = this.cache.get(cacheID, mtime);
							file = cached || file;
						}

						if (!cached) {
							let fn = this.transforms[transform];
							let environmentConfig = environment[transform] || {};
							let applicationConfig = this.config.transforms[transform] || {};
							let configuration = merge({}, applicationConfig, environmentConfig);

							try {
								file = await fn(Object.assign({}, file), demo, configuration, forced);
								if (this.cache && this.cache.config.transform && !this.isEnvironment) {
									this.cache.set(cacheID, mtime, file);
								}
							} catch (error) {
								error.pattern = this.id;
								error.file = error.file || file.path;
								error.transform = transform;
								console.error(`Error while transforming file "${error.file}" of pattern "${error.pattern}" with transform "${error.transform}".`);
								throw error;
							}
						}
					}
				}

				if (!this.results[environmentName]) {
					this.results[environmentName] = {};
				}

				file.out = file.out || lastTransform.outFormat || file.format;
				this.results[environmentName][formatConfig.name] = file;
			}
		}
		return this;
	}

	getLastModified() {
		let mtimes = [];

		// Already read
		if ( this.dependencies ) {
			for (let dependency in this.dependencies) {
				mtimes.push(this.dependencies[dependency].getLastModified());
			}
		}

		for (let fileName in this.files) {
			let file = this.files[fileName];
			mtimes.push(new Date(file.fs.node.mtime));
		}

		this.mtime = mtimes.sort((a, b) => b - a)[0];
		return this.mtime;
	}

	toJSON() {
		let copy = Object.assign({}, this);

		for (let environmentName of Object.keys(copy.results)) {
			let environmentResult = copy.results[environmentName];
				for (let resultName of Object.keys(environmentResult)) {
					let result = environmentResult[resultName];

					copy.results[environmentName][resultName] = {
						'name': resultName,
						'source': result.source.toString('utf-8'),
						'demoSource': result.demoSource ? result.demoSource.toString('utf-8') : '',
						'buffer': result.buffer.toString('utf-8'),
						'demoBuffer': result.demoBuffer ? result.demoBuffer.toString('utf-8') : '',
						'in': result.in,
						'out': result.out
					};
				}
		}

		delete copy.cache;
		delete copy.files;
		delete copy.config;
		delete copy.base;
		delete copy.path;
		delete copy.transforms;

		return copy;
	}
}


export default async function patternFactory(...args) {
	return await new Pattern(...args);
}
