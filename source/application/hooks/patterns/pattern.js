/* eslint ignore */
import {resolve, basename, extname} from 'path';
import fs from 'q-io/fs';

export class Pattern {
	files = {};
	config = {};
	manifest = {};
	dependencies = {};
	results = {};
	mtime = null;

	constructor(id, base, config = {}, transforms = {}, cache = null) {
		this.id = id;
		this.cache = cache;
		this.base = base;
		this.path = Pattern.resolve(this.base, this.id);
		this.config = config;
		this.transforms = transforms;
	}

	static resolve(...args) {
		return resolve(...args);
	}

	async read(path = this.path) {
		// TODO: Replace q-io/fs
		fs.exists = fs.exists.bind(fs);

		if ( await fs.exists(path) !== true ) {
			throw new Error(`Can not read pattern from ${this.path}, it does not exist.`);
		}

		let files = await fs.listTree(path);

		files = files.filter(function(fileName){
			let ext = extname(fileName);
			return ext && ['index', 'demo', 'pattern'].indexOf(basename(fileName, ext)) > -1;
		});

		for (let file of files) {
			let stat = await fs.stat(file);
			let mtime = stat.node.mtime;
			let name = basename(file);

			let data;

			if (this.cache) {
				data = this.cache.get(file, mtime);
			}

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
					'source': buffer,
				}

				if (this.cache) {
					this.cache.set(file, mtime, data);
				}
			}

			this.files[name] = data;
		}

		let manifest = this.files['pattern.json'];

		if (typeof manifest === 'undefined') {
			throw new Error({
				'message': `Can not read pattern.json from ${this.path}, it does not exist.`,
				'file': this.path,
				'pattern': this.id
			});
		}

		try {
			this.manifest = JSON.parse(manifest.source.toString('utf-8'));
			delete this.files['pattern.json'];
		} catch (error) {
			throw new Error({
				'message': `Error while reading pattern.json from ${this.path}`,
				'file': this.path,
				'pattern': this.id,
				'stack': error.stack
			});
		}

		if (typeof this.manifest.patterns !== 'object') {
			return this;
		}

		for ( let patternName in this.manifest.patterns ) {
			let pattern = new Pattern(this.manifest.patterns[patternName], this.base, this.config, this.transforms, this.cache);
			this.dependencies[patternName] = await pattern.read();
		}

		for ( let fileName in this.files ) {
			let file = this.files[fileName];
			file.dependencies = {}

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

	async transform( withDemos = true ) {
		let demos = {};

		if (withDemos) {
			for ( let fileName in this.files ) {
				let file = this.files[fileName];

				if ( file.basename !== 'demo' ) {
					continue;
				}

				let formatConfig = this.config.formats[file.format];

				if (typeof formatConfig !== 'object') {
					continue;
				}

				demos[formatConfig.name] = file;
			}
		}

		for ( let fileName in this.files ) {
			let file = this.files[fileName];

			if ( file.basename === 'demo' ) {
				continue;
			}

			let formatConfig = this.config.formats[file.format];

			if (typeof formatConfig !== 'object') {
				continue;
			}

			let transforms = formatConfig.transforms || [];

			for (let transform of transforms) {
				let fn = this.transforms[transform];
				try {
					file = await fn(file, demos[formatConfig.name]);
				} catch (error) {
					error.pattern = this.id;
					error.file = error.file || file.path;
					error.transform = transform;
					throw error;
				}
			}

			this.results[formatConfig.name] = file;
		}
	}

	getLastModified() {
		let mtimes = [];

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

		if (copy.dependencies) {
			for (let dependency in copy.dependencies) {
				copy.dependencies[dependency] = copy.dependencies[dependency].toJSON();
			}
		}

		for (let resultName of Object.keys(this.results)) {
			this.results[resultName] = {
				'source': this.results[resultName].source.toString('utf-8'),
				'demoSource': this.results[resultName].demoSource ? this.results[resultName].demoSource.toString('utf-8') : '',
				'buffer': this.results[resultName].buffer.toString('utf-8'),
				'demoBuffer': this.results[resultName].demoBuffer ? this.results[resultName].demoBuffer.toString('utf-8') : '',
				'in': this.results[resultName].in,
				'out': this.results[resultName].out
			};
		}

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
