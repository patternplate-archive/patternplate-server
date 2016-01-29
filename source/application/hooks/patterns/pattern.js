import {resolve, basename, extname, dirname, sep} from 'path';

import qfs from 'q-io/fs';
import merge from 'lodash.merge';
import {flattenDeep, uniq, find} from 'lodash';
import minimatch from 'minimatch';
import chalk from 'chalk';
import memoize from 'memoize-promise';
import throat from 'throat';

async function getPatternManifests(base, patterns = {}, fs = qfs) {
	return await* Object.values(patterns).map(async id => {
		const json = await fs.read(resolve(base, id, 'pattern.json'));
		const manifest = {...JSON.parse(json), __id: id};
		const subManifests = await getPatternManifests(base, manifest.patterns, fs);
		return [manifest, ...subManifests];
	});
}

function getDependenciesToRead(patterns = {}, pool = []) {
	return Object
		.values(patterns)
		.reduce((result, id) => {
			const dependency = find(pool, {id});
			const sub = getDependenciesToRead(dependency.manifest.patterns, pool);
			const add = [...sub, id].filter(item => result.indexOf(item) === -1);
			return [...result, ...add];
		}, []);
}

function constructDependencies(patterns = {}, pool = []) {
	return Object
		.entries(patterns)
		.reduce((result, entry) => {
			const [name, id] = entry;
			const dependency = find(pool, {id});
			return {
				...result,
				[name]: {
					...dependency,
					dependencies: constructDependencies(dependency.manifest.patterns, pool)
				}
			};
		}, {});
}

export class Pattern {
	files = {};
	config = {};
	manifest = {};
	dependencies = {};
	results = {};
	mtime = null;
	filters = {
		environments: [],
		formats: []
	};
	log = {
		error: function(...args) {
			console.error(...args);
		},
		warn: function(...args) {
			console.warn(...args);
		},
		info: function(...args) {
			console.log(...args);
		},
		debug: function(...args) {
			console.log(...args);
		},
		silly: function(...args) {
			console.log(...args);
		}
	};
	cache = {
		get() {
			return null;
		},
		set() {
			return null;
		}
	};

	constructor(patternPath, base, config = {}, transforms = {}, filters = {}, cache = null) {
		const id = patternPath.split(sep).join('/');

		const list = memoize(qfs.listTree).bind(qfs);
		const stat = memoize(qfs.stat).bind(qfs);
		const exists = memoize(qfs.exists).bind(qfs);
		const read = async file => {
			const stats = await stat(file);
			const cached = this.cache.get(file, stats.node.mtime);
			if (cached) {
				return cached;
			} else {
				const content = qfs.read(file);
				this.cache.set(file, stats.node.mtime, content);
				return content;
			}
		};

		merge(this, {
			id,
			base,
			cache,
			transforms,
			filters,
			path: Pattern.resolve(base, id),
			environments: {
				'index': {
					'manifest': { 'name': 'index' }
				}
			},
			isEnvironment: id.includes('@environment'),
			fs: {
				list,
				stat,
				exists,
				read,
				...(this.config.fs || {})
			},
			config: {
				parents: [],
				...config
			},
			log: config.log
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

	async readManifest(path = this.path, fs = this.fs) {
		if (this.config.parents.length === 0) {
			const manifestPath = resolve(this.path, 'pattern.json');

			if (!await this.fs.exists(manifestPath)) {
				throw new Error(`Can not read pattern.json from ${this.path}, it does not exist.`, {
					'fileName': this.path,
					'pattern': this.id
				});
			}

			try {
				const manifestString = await this.fs.read(manifestPath);
				const manifestData = JSON.parse(manifestString);
				this.manifest = {
					'version': '0.1.0',
					'build': true,
					'display': true,
					...this.manifest,
					...manifestData
				};
			} catch (error) {
				throw new Error(`Error while reading pattern.json from ${this.path}: ${error.message}`, {
					'file': this.path,
					'pattern': this.id,
					'stack': error.stack
				});
			}

			if (this.isEnvironment && !this.manifest.patterns) {
				let list = await this.fs.list(this.base);
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

				this.manifest.patterns = list
					.reduce((results, item) => Object.assign(results, {[item]: `${item}@${range}`}), {});
			}

			const manifests = await getPatternManifests(this.base, this.manifest.patterns, this.fs);
			const dependencies = uniq(flattenDeep(manifests), '__id');
			const dependencyPatterns = dependencies
				.map(manifest => {
					const {__id: id} = manifest;
					const config = {
						...this.config,
						parents: [...this.config.parents, this.id]
					};
					const pattern = new Pattern(
							id,
							this.base,
							config,
							this.transforms,
							this.filters,
							this.cache
						);
					pattern.manifest = manifest;
					return pattern;
				});

			const dependenciesToRead = getDependenciesToRead(this.manifest.patterns, dependencyPatterns);
			const readDependencies = await* dependenciesToRead.map(async id => {
				return find(dependencyPatterns, {id}).read(this.path, fs);
			});

			this.dependencies = constructDependencies(this.manifest.patterns, readDependencies);
		}

		return this;
	}

	async read(path = this.path, fs = this.fs) {
		const readStart = new Date();
		this.log.silly(`Reading files for ${this.id}`);

		// determine the current mtimes for this pattern
		const fileList = await this.fs.list(path);
		this.log.silly(`Listed files for ${this.id} ${chalk.grey('[' + (new Date() - readStart) + 'ms]')}`);

		// use filter, use all formats if none given
		const formats = this.filters.formats.length > 0 ?
			this.filters.formats :
			Object.keys(this.config.patterns.formats);

		// determine requested in formats
		const inFormats = formats
			.map(format => {
				const formatConfig = this.config.patterns.formats[format] || {};
				const transformNames = formatConfig.transforms || [];
				const firstTransform = this.config.transforms[transformNames[0]] || [];
				return firstTransform.inFormat || format;
			})
			.filter(Boolean);

		// get the relevant pattern files
		const files = fileList
			.filter(file => {
				const fileExtension = extname(file);
				const fileRumpName = basename(file, fileExtension);
				return fileExtension && ['index', 'demo'].indexOf(fileRumpName) > -1;
			})
			.filter(Boolean);

		// determine the formats available for request
		const outFormats = files
			.map(file => {
				const inFileFormat = extname(file).slice(1);
				const formatConfig = this.config.patterns.formats[inFileFormat] || {};
				const transformNames = formatConfig.transforms || [];
				const lastTransform = this.config.transforms[transformNames[transformNames.length - 1]] || {};

				return {
					name: formatConfig.name,
					type: formatConfig.name.toLowerCase(),
					extension: lastTransform.outFormat || inFileFormat
				};
			});

		this.outFormats = outFormats;
		this.inFormats = inFormats;

		// get the files matching our current filter
		const matchingFiles = files
			.filter(file =>
				inFormats.indexOf(extname(file).slice(1)) > -1
			);

		if (matchingFiles.length) {
			this.log.silly(`Using ${matchingFiles.length} of ${files.length} files for ${this.id}: ${chalk.grey('[' + matchingFiles.map(file => basename(file)) + ']')}`);
		}

		const manifestStart = new Date();
		await this.readManifest(path, fs);

		// read manifest information
		if (this.config.parents.length === 0) {
			this.log.silly(`Read manifest for ${this.id} ${chalk.grey('[' + (new Date() - manifestStart) + 'ms]')}`);
		}

		// read in relevant file information
		const fileData = await* matchingFiles.map(throat(5, async file => {
			const fileFs = await this.fs.stat(file);
			const fileExt = extname(file);
			const fileBaseName = basename(file);
			const fileRumpName = basename(file, fileExt);
			const fileFormat = fileExt.slice(1);

			// check if the format/transform config requires us to fetch the buffer
			const formatConfig = this.config.patterns.formats[fileFormat] || {};
			const transformNames = formatConfig.transforms || [];
			const transforms = transformNames.map(name => this.config.transforms[name] || {});
			const resolveDependencies = transforms.some(transform => transform.resolveDependencies !== false);
			const isRoot = this.config.parents.length === 0;
			// const fileContents = isRoot || resolveDependencies ? await this.fs.read(file) : new Buffer('');
			const fileContents = await this.fs.read(file);

			// collect data in format expected by transforms
			const data = {
				buffer: fileContents,
				source: fileContents,
				name: fileBaseName,
				basename: fileRumpName,
				ext: fileExt,
				format: fileFormat,
				fs: fileFs,
				path: file,
				pattern: this,
				meta: {
					dependencies: [],
					devDependencies: []
				}
			};

			// determine dependencies on file level, currently only for index.*
			const dependencies = Object.entries(this.dependencies)
				.reduce((results, entry) => {
					const [dependencyName, dependencyPattern] = entry;
					const dependencyFile = dependencyPattern.files[data.name] || {};
					return dependencyFile.path ? {...results, [dependencyName]: dependencyFile} : {...results};
				}, {});

			return {...data, dependencies};
		}));

		// convert to consumable format
		this.files = fileData.reduce((results, data) => {
			return {...results, [data.name]: data};
		}, {});

		// read last-modified
		this.getLastModified();
		this.log.silly(`Read files for ${this.id}. ${chalk.grey('[' + new Date() - readStart + ']')}`);
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

				const formatDependencies = formatConfig.dependencies || [];
				const transforms = formatConfig.transforms || [];
				let lastTransform = this.config.transforms[transforms[transforms.length - 1]] || {};

				file.meta.devDependencies = [
					...file.meta.devDependencies,
					...formatDependencies
				];

				for (let transform of transforms) {
					let demo = demos[formatConfig.name];

					let fn = this.transforms[transform];
					let environmentConfig = environment[transform] || {};
					let applicationConfig = this.config.transforms[transform] || {};
					let configuration = merge({}, applicationConfig, environmentConfig);

					try {
						file = await fn({...file}, demo, configuration, forced);
					} catch (error) {
						error.pattern = this.id;
						error.file = error.file || error.fileName || file.path;
						error.transform = transform;
						this.log.error(`Error while transforming file "${error.file}" of pattern "${error.pattern}" with transform "${error.transform}".`);
						throw error;
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
		const fileMtimes = Object.values(this.files || {})
			.map(file => new Date(file.fs.node.mtime));

		this.mtime = fileMtimes.sort((a, b) => b - a)[0];
		return this;
	}

	toJSON() {
		const copy = {...this};

		Object.entries(copy.results).forEach(([environmentName, environmentResult]) => {
			Object.entries(environmentResult).forEach(resultEntry => {
				const [resultName, result] = resultEntry;

				copy.results[environmentName][resultName] = {
					'name': resultName,
					'source': result.source.toString('utf-8'),
					'demoSource': result.demoSource ? result.demoSource.toString('utf-8') : '',
					'buffer': result.buffer.toString('utf-8'),
					'demoBuffer': result.demoBuffer ? result.demoBuffer.toString('utf-8') : '',
					'in': result.in,
					'out': result.out
				};
			});
		});

		copy.meta = Object.entries(copy.files).reduce((results, entry) => {
			const [, file] = entry;
			const meta = file.meta || {};
			const dependencies = meta.dependencies || [];
			const devDependencies = meta.devDependencies || [];
			return {
				...results,
				dependencies: [...(results.dependencies || []), ...dependencies],
				devDependencies: [...(results.devDependencies || []), ...devDependencies]
			};
		}, {});

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
