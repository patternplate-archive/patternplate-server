/* eslint-disable max-len*/
import {stat} from 'mz/fs';
import {basename, extname, dirname, resolve, relative, sep} from 'path';

import chalk from 'chalk';
import exists from 'path-exists';
import {find, flattenDeep, invert, last, merge, uniq, uniqBy} from 'lodash';
import minimatch from 'minimatch';
import throat from 'throat';

import constructDependencies from './construct-dependencies';
import constructFileDependencies from './construct-file-dependencies';
import fauxCache from './faux-cache';
import fauxLog from './faux-log';
import getDependenciesToRead from './get-dependencies-to-read';
import getPatternManifests from '../../../library/utilities/get-pattern-manifests';
import getPatternManifestsData from './get-pattern-manifest-data';
import getReadFile from '../../../library/filesystem/read-file';
import getTransform from './get-transform';
import readDirectory from '../../../library/filesystem/read-directory';
import toString from './to-string';

const defaultFilters = {environments: [], inFormats: [], outFormats: []};

export class Pattern {
	constructor(patternPath, base, config = {}, transforms = {}, filters = {}, cache = null) {
		const id = patternPath.split(sep).join('/');

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
			path: Pattern.resolve(base, id),
			results: {},
			transforms
		});
	}

	static resolve(...args) {
		return resolve(...args);
	}

	async readManifest() {
		const read = getReadFile({cache: this.cache});

		if (this.config.parents.length === 0) {
			const manifestPath = resolve(this.path, 'pattern.json');

			if (!await exists(manifestPath)) {
				throw new Error(`Can not read pattern.json from ${this.path}, it does not exist.`, {
					fileName: this.path,
					pattern: this.id
				});
			}

			try {
				const manifestString = await read(manifestPath);
				const manifestData = JSON.parse(manifestString);
				this.manifest = {
					version: '0.1.0',
					build: true,
					display: true,
					patterns: {},
					...this.manifest,
					...manifestData
				};
			} catch (error) {
				throw new Error(`Error while reading pattern.json from ${this.path}: ${error.message}`, {
					file: this.path,
					pattern: this.id,
					stack: error.stack
				});
			}

			if (this.isEnvironment && !this.manifest.patterns) {
				let list = await readDirectory(this.base);
				const range = this.manifest.range || '*';

				list = list
					.filter(item => basename(item) === 'pattern.json')
					.filter(item => !item.includes('@environment'))
					.map(item => relative(this.base, dirname(item)))
					.filter(item => item !== this.id);

				if (this.manifest.include) {
					const include = Array.prototype.concat.call([], this.manifest.include, ['']);
					list = list.filter(item => minimatch(item, `{${include.join(',')}}`));
				}

				if (this.manifest.exclude) {
					const exclude = Array.prototype.concat.call([], this.manifest.exclude, ['']);
					list = list.filter(item => !minimatch(item, `{${exclude.join(',')}}`));
				}

				this.manifest.patterns = list
					.reduce((results, item) => Object.assign(results, {[item]: `${item}@${range}`}), {});
			}

			this.manifest.patterns.Pattern = this.id; // should be set for demos only?

			const manifestsStart = new Date();

			this.log.silly(`Fetching manifests for ${this.id}`);
			const pool = await getPatternManifests('.', this.base, {cache: this.cache});
			const manifests = getPatternManifestsData(this.base, this.manifest.patterns, pool);
			const manifestDuration = chalk.grey(`[${new Date() - manifestsStart}ms]`);
			this.log.silly(`Fetched manifests for ${this.id} ${manifestDuration}`);

			const dependencies = uniqBy(flattenDeep(manifests), 'id');

			const dependencyPatterns = dependencies
				.map(manifest => {
					const {id} = manifest;
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

			const readDependency = async id => {
				return find(dependencyPatterns, {id}).read();
			};

			const dependencyJobs = dependenciesToRead.map(throat(5, readDependency));
			const readDependencies = await Promise.all(dependencyJobs);

			this.dependencies = constructDependencies(this.manifest.patterns, readDependencies);
		}

		return this;
	}

	async read(path = this.path) {
		const read = getReadFile({cache: this.cache});

		const readStart = new Date();
		this.log.silly(`Reading files for ${this.id}`);

		// determine the current mtimes for this pattern
		const fileList = await readDirectory(path);
		const fileListDuration = chalk.grey(`[${new Date() - readStart}ms]`);
		this.log.silly(`Listed ${fileList.length} files for ${this.id} ${fileListDuration}`);

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
				}
				return this.filters.outFormats.indexOf(outFormat) > -1;
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
		const baseNames = this.filters.baseNames && this.filters.baseNames.length > 0 ?
			this.filters.baseNames : ['index', 'demo'];

		// get the relevant pattern files
		const files = fileList
			.filter(file => {
				const fileExtension = extname(file);
				const fileRumpName = basename(file, fileExtension);
				return fileExtension && baseNames.indexOf(fileRumpName) > -1;
			});

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
			.filter(file => filteredFormats.indexOf(extname(file).slice(1)) > -1)
			.map(file => resolve(this.base, this.id, file));

		const matchingFilesList = chalk.grey(`[${matchingFiles.map(file => basename(file))}]`);
		this.log.silly(`Using ${matchingFiles.length} of ${files.length} files for ${this.id}: ${matchingFilesList}`);

		const manifestStart = new Date();
		await this.readManifest(path);

		// read manifest information
		const manifestReadDuration = chalk.grey(`[${new Date() - manifestStart}ms]`);
		this.log.silly(`Read manifest for ${this.id} ${manifestReadDuration}`);

		// read in relevant file information
		const fileData = await Promise.all(matchingFiles.map(throat(5, async file => {
			const fileFs = await stat(file);
			fileFs.node = fileFs; // backwards compatibility

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

			const fileContents = isRoot || resolveDependencies ?
				await read(file) :
				new Buffer('', 'utf-8');

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
		})));

		// convert to consumable format
		this.files = fileData.reduce((results, data) => {
			return {...results, [data.name]: data};
		}, {});

		// read last-modified
		const readDuration = chalk.grey(`[${new Date() - readStart}ms]`);
		this.log.silly(`Read files for ${this.id}. ${readDuration}`);
		return this;
	}

	// create dependency entries and files for an array of patterns
	inject(manifest, patterns) {
		// construct manifest
		this.manifest = patterns.reduce((registry, pattern) => {
			const {id} = pattern;
			return merge(
				registry,
				{
					patterns: {
						[id.split('/').join('-')]: id
					}
				}
			);
		}, manifest);

		// construct pattern dependencies
		this.dependencies = Object.entries(this.manifest.patterns)
			.reduce((dependencies, patternEntry) => {
				const [localName, id] = patternEntry;
				return merge(
					dependencies,
					{
						[localName]: find(patterns, {id})
					});
			}, {});

		const formats = uniq(Object.values(this.config.patterns.formats)
			.filter(format => format.build), 'name');

		// construct files from dependencies
		this.files = formats.reduce((files, formatConfig) => {
			const format = this.config.transforms[formatConfig.transforms[0]].inFormat;

			if (this.filters.inFormats.indexOf(format) === -1) {
				return files;
			}

			const baseName = 'index';
			const ext = `.${format}`;
			const name = `${baseName}${ext}`;
			const dependencies = constructFileDependencies(this.dependencies, [name]);
			const path = resolve(
				this.base,
				'@environments',
				manifest.name,
				name
			);
			const {importStatement} = formatConfig;

			if (typeof importStatement !== 'function') {
				throw new Error(`Missing config key "importStatement" for format ${format}`);
			}

			// import everything mentioned in the virtual manifest file
			const required = Object.keys(this.manifest.patterns)
				// if it is in the file dependencies
				.filter(localName => localName in dependencies);

			const source = required.map(localName => importStatement(localName))
				.join('\n');

			const buffer = source;

			return merge(files, {
				[name]: {
					buffer,
					source,
					name,
					basename: baseName,
					dependencies,
					ext,
					format,
					fs: {},
					path,
					pattern: this,
					meta: {
						dependencies: [],
						devDependencies: []
					}
				}
			}, (a, b) => {
				if (Buffer.isBuffer(b)) {
					return b;
				}
			});
		}, {});

		return this;
	}

	async transform() {
		const formats = this.config.patterns.formats;

		const config = {
			patterns: this.config.patterns,
			transformConfigs: this.config.transforms,
			log: this.log
		};

		// get the transform job, execute in parallel
		const jobs = Object.values(this.files)
			.map(getTransform(this.transforms, config));

		// get an array with the results of each transform step
		const filesResults = await Promise.all(jobs);

		// pick the last item each
		const transformResults = filesResults.map(last);

		// Save into files map
		const files = transformResults.reduce((results, transformResult) => {
			results[transformResult.name] = transformResult;
			return results;
		}, {});

		merge(this.files, files);

		// Join demo and index files of the same format
		// if there is a demo, it occupies the results[format.name] key
		const sanitizedResults = uniq(transformResults.reduce((results, result) => {
			const demo = transformResults.find(transformResult => {
				return transformResult.basename === 'demo' && transformResult.format === result.format;
			});

			if (demo) {
				results.push(demo);
			} else {
				results.push(result);
			}

			return results;
		}, []));

		// Reduce to format.name => result map
		this.results = sanitizedResults.reduce((results, transformResult) => {
			const format = formats[transformResult.format];
			const source = toString(transformResult.source);
			const buffer = toString(transformResult.buffer);

			const base = {
				name: transformResult.name,
				concern: transformResult.basename,
				source,
				buffer,
				in: transformResult.in,
				out: transformResult.out
			};

			const amend = transformResult.baseName === 'demo' ? {
				demoBuffer: toString(transformResult.demoBuffer),
				demoSource: toString(transformResults.demoSource)
			} : {};
			results[format.name] = merge(base, amend);
			return results;
		}, {});

		this.meta = Object.entries(this.files).reduce((results, entry) => {
			const [, file] = entry;
			const meta = file.meta || {};
			const dependencies = meta.dependencies || [];
			const devDependencies = meta.devDependencies || [];
			const scriptDependencies = meta.scripts || [];
			return {
				...results,
				dependencies: [...(results.dependencies || []), ...dependencies],
				devDependencies: [...(results.devDependencies || []), ...devDependencies],
				scriptDependencies: [...(results.scriptDependencies || []), ...scriptDependencies]
			};
		}, {});

		return this;
	}
}

export default async function patternFactory(...args) {
	return await new Pattern(...args);
}
