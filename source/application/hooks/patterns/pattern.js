import {
	basename,
	extname,
	dirname,
	resolve,
	sep
} from 'path';

import chalk from 'chalk';
import memoize from 'memoize-promise';
import {
	find,
	flattenDeep,
	invert,
	omit,
	uniq
} from 'lodash';
import merge from 'lodash.merge';
import minimatch from 'minimatch';
import qfs from 'q-io/fs';
import throat from 'throat';

import getReadFile from '../../../library/filesystem/readFile.js';

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
			dependency.dependencies = constructDependencies(dependency.manifest.patterns, pool);
			result[name] = dependency;
			return result;
		}, {});
}

function constructFileDependencies(dependencies, search) {
	return Object
		.entries(dependencies)
		.reduce((results, entry) => {
			const [dependencyName, dependencyPattern] = entry;
			const searchResults = Object.keys(dependencyPattern.files)
				.filter(file => {
					return search.indexOf(file) > -1;
				});
			const dependencyFileName = searchResults[0];
			const dependencyFile = dependencyPattern.files[dependencyFileName] || {};
			if (dependencyFile.path) {
				dependencyFile.dependencies = constructFileDependencies(dependencyPattern.dependencies, search);
				results[dependencyName] = dependencyFile;
			}
			return results;
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
		inFormats: [],
		outFormats: []
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
		const read = getReadFile({cache});

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

	async readManifest() {
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
					'patterns': {},
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

			this.manifest.patterns.Pattern = this.id; // should be set for demos only?

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
							{
								...this.filters,
								baseNames: ['index'] // dependencies are index-only
							},
							this.cache
						);
					pattern.manifest = manifest;
					return pattern;
				});

			const dependenciesToRead = getDependenciesToRead(this.manifest.patterns, dependencyPatterns);

			this.log.silly(`Determined dependency chain for ${this.id}`);

			dependenciesToRead.forEach(item => {
				const name = invert(this.manifest.patterns)[item];
				this.log.silly(`↳  ${chalk.bold(name)} → ${item}`);
			});

			const readDependencies = await* dependenciesToRead.map(async id => {
				return find(dependencyPatterns, {id}).read();
			});

			this.dependencies = constructDependencies(this.manifest.patterns, readDependencies);
		}

		return this;
	}

	async read(path = this.path, fs = this.fs) {
		const readStart = new Date();
		this.log.silly(`Reading files for ${this.id}`);

		// determine the current mtimes for this pattern
		const fileList = await qfs.list(path);
		this.log.silly(`Listed ${fileList.length} files for ${this.id} ${chalk.grey('[' + (new Date() - readStart) + 'ms]')}`);

		// use filter, use all formats if none given
		const inFormats = this.filters.inFormats.length > 0 ?
			this.filters.inFormats :
			Object.keys(this.config.patterns.formats);

		// determine available requested out formats
		const outFormats = inFormats
			.reduce((result, format) => {
				// if there are no transforms configured
				// fall back to formatName
				const formatConfig = this.config.patterns.formats[format] || {};
				if (formatConfig.transforms && formatConfig.transforms.length === 0) {
					return [...result, format];
				}

				const transforms = Object.entries(this.config.transforms)
					.map(entry => {
						const [name, config] = entry;
						return config.outFormat === format ? name : null;
					})
					.filter(Boolean);

				const formatNames = Object.entries(this.config.patterns.formats)
					.map(entry => {
						const [name, config] = entry;
						return transforms.indexOf(
							config.transforms[config.transforms.length - 1]) > -1 ?
								name : null;
					})
					.filter(Boolean);

				return [...result, ...formatNames];
			}, [])
			.filter(outFormat => {
				if (this.filters.outFormats.length === 0) {
					return true;
				} else {
					return this.filters.outFormats.indexOf(outFormat) > -1;
				}
			});

		// determine in formats for available out formats
		const inOutFormats = outFormats
			.reduce((result, format) => {
				const transforms = Object.entries(this.config.transforms)
					.map(entry => {
						const [name, config] = entry;
						return config.outFormat === format ? name : null;
					})
					.filter(Boolean);

				const formatNames = Object.entries(this.config.patterns.formats)
					.map(entry => {
						const [name, config] = entry;
						return transforms.indexOf(
							config.transforms[config.transforms.length - 1]) > -1 ?
								name : null;
					})
					.filter(Boolean);

				return [...result, ...formatNames];
			}, []);

		const filteredFormats = this.filters.outFormats.length > 0 ?
			inOutFormats : inFormats;

		this.log.silly(`${this.id} has ${filteredFormats.length} formats available: ${chalk.grey(filteredFormats)}`);

		// determine which basenames to read
		const baseNames = this.filters.baseNames && this.filters.baseNames.length > 0 ? this.filters.baseNames : ['index', 'demo'];

		// get the relevant pattern files
		const rawFiles = fileList
			.filter(file => {
				// filter for allowed basenames, this will be configurable in the future
				const fileExtension = extname(file);
				const fileRumpName = basename(file, fileExtension);
				return fileExtension && baseNames.indexOf(fileRumpName) > -1;
			});

		// only use demos for any format if there is an index-demo pair
		const files = rawFiles
			.filter(file => {
				const fileExtension = extname(file);
				const fileRumpName = basename(file, fileExtension);
				const correspondingDemo = `demo${fileExtension}`;
				const isDemo = fileRumpName === 'demo';
				const hasDemo = rawFiles.indexOf(correspondingDemo) > -1;
				return isDemo || !hasDemo;
			})
			.filter(Boolean);

		// determine the formats available for request
		const out = files
			.map(file => {
				const inFileFormat = extname(file).slice(1);
				const formatConfig = this.config.patterns.formats[inFileFormat] || {};
				const name = formatConfig.name || '';
				const transformNames = formatConfig.transforms || [];
				const lastTransform = this.config.transforms[transformNames[transformNames.length - 1]] || {};

				return {
					name,
					type: name.toLowerCase(),
					extension: lastTransform.outFormat || inFileFormat
				};
			});

		// provide meta data about formats
		this.outFormats = out;
		this.inFormats = inFormats;

		// get the files matching our current filter
		const matchingFiles = files
			.filter(file =>
				filteredFormats.indexOf(extname(file).slice(1)) > -1
			)
			.map(file => resolve(this.base, this.id, file));

		this.log.silly(`Using ${matchingFiles.length} of ${files.length} files for ${this.id}: ${chalk.grey('[' + matchingFiles.map(file => basename(file)) + ']')}`);

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
			const fileContents = isRoot || resolveDependencies ? await this.fs.read(file) : new Buffer('');

			if (isRoot === false && resolveDependencies) {
				this.log.silly(`Reading ${this.id} as dependeny of ${this.config.parents[this.config.parents.length - 1]}`);
			}

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

			const dependencies = constructFileDependencies(this.dependencies, [`index${data.ext}`]);
			return {
				...data,
				dependencies
			};
		}));

		// convert to consumable format
		this.files = fileData.reduce((results, data) => {
			return {...results, [data.name]: data};
		}, {});

		// read last-modified
		this.getLastModified();
		this.log.silly(`Read files for ${this.id}. ${chalk.grey('[' + (new Date() - readStart) + 'ms]')}`);
		return this;
	}

	async transform( withDemos = true, forced = false ) {
		for (const fileName of Object.keys(this.files)) {
			const file = this.files[fileName];
			const formatConfig = this.config.patterns.formats[file.format];

			if (typeof formatConfig !== 'object') {
				continue;
			}

			const formatDependencies = formatConfig.dependencies || [];
			const transforms = formatConfig.transforms || [];
			const lastTransform = this.config.transforms[transforms[transforms.length - 1]] || {};

			// Blend file dependencies with
			// formatDependencies
			file.meta.devDependencies = [
				...file.meta.devDependencies,
				...formatDependencies
			];

			for (const transform of transforms) {
				const transformStart = new Date();
				const signet = chalk.yellow('[⚠ Faulty transform ⚠ ]');
				const transformName = `"${chalk.bold(transform)}"`;
				const fileBaseName = `"${chalk.bold(file.name)}"`;
				const patternName = `"${chalk.bold(this.id)}"`;

				const transformFunction = this.transforms[transform];
				const configuration = merge({}, this.config.transforms[transform] || {});

				this.log.debug(`Transforming ${fileBaseName} of ${patternName} via ${transformName}`);
				try {
					const result = await transformFunction(file, null, configuration, forced);
					if (result) {
						// deprecate the use of file.demoBuffer
						if (result.demoBuffer) {
							const deprecation = chalk.yellow('[Deprecation]');
							this.log.warn(`${deprecation}    Transform ${transformName} uses ${chalk.bold('file.demoBuffer')}, which is deprecated.`);
						}
						// backwards compatibility
						// - transforms do not receive demo buffers anymore
						// - instead they receive the demo as file.buffer, too
						// - when the basename is demo, map buffer to demoBuffer
						if (basename(file, extname(file)) === 'demo') {
							this.log.debug(`Using the results of ${transformName} for ${fileBaseName} of ${patternName} as demo`);
							file.demoBuffer = result.demoBuffer || result.buffer;
						} else {
							file.buffer = result.buffer;
							this.log.debug(`Using the results of ${transformName} for ${fileBaseName} of ${patternName} as index`);
						}
						// set the in and out format for transforms
						// this makes the corresponding lines in transforms obsolete
						file.in = configuration.inFormat;
						file.out = configuration.outFormat;
						// make sure we pass a string to the outer world
						file.buffer = file.buffer instanceof Buffer ? file.buffer.toString('utf-8') : file.buffer;
					} else {
						this.log.warn(`${signet}    Transform ${transformName} did not return a file object for ${fileBaseName} of ${patternName}`);
					}
				} catch (error) {
					error.pattern = this.id;
					error.file = error.file || error.fileName || file.path;
					error.transform = transform;
					this.log.error(`Error while transforming file "${error.file}" of pattern "${error.pattern}" with transform "${error.transform}".`);
					throw error;
				}

				const stamp = chalk.grey(`[${new Date() - transformStart}ms]`);
				this.log.silly(`Transformed ${fileBaseName} of ${patternName} via ${transformName} ${stamp}`);
			}


			file.out = file.out || lastTransform.outFormat || file.format;
			this.results[formatConfig.name] = file;
		}

		return this;
	}

	getLastModified() {
		const fileMtimes = Object.values(this.files || {})
			.map(file => new Date(file.fs.mtime));

		this.mtime = fileMtimes.sort((a, b) => b - a)[0];
		return this;
	}

	toJSON() {
		const copy = merge({}, this);

		Object.entries(this.results).forEach(resultEntry => {
			const [resultName, result] = resultEntry;

			copy.dependencies = omit(copy.dependencies, 'Pattern');

			copy.results[resultName] = {
				name: resultName,
				source: result.source.toString('utf-8'),
				demoSource: result.demoSource ? result.demoSource.toString('utf-8') : '',
				buffer: result.buffer.toString('utf-8'),
				demoBuffer: result.demoBuffer ? result.demoBuffer.toString('utf-8') : '',
				in: result.in,
				out: result.out
			};
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

		// things not needed in serialized form
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
