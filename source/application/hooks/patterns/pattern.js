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

	constructor(id, base, config = {}, transforms = {}) {
		this.id = id;
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

		let files = await fs.toObject(path);

		for (let file in files) {
			let fileBasename = basename(file);
			let ext = extname(file);

			this.files[fileBasename] = {
				'buffer': files[file],
				'source': files[file],
				'path': file,
				'ext': ext,
				'name': fileBasename,
				'basename': basename(fileBasename, ext),
				'format': ext.substr(1, ext.length),
				'fs': await fs.stat(file)
			};
		}

		let manifest = this.files['pattern.json'];

		if (typeof manifest === 'undefined') {
			throw new Error(`Can not read pattern.json from ${this.path}, it does not exist.`)
		}

		try {
			this.manifest = JSON.parse(manifest.source.toString('utf-8'));
			delete this.files['pattern.json'];
		} catch (e) {
			throw new Error(`Error while reading pattern.json from ${this.path}:`, e);
		}

		if (typeof this.manifest.patterns !== 'object') {
			return this;
		}

		for ( let patternName in this.manifest.patterns ) {
			let pattern = new Pattern(this.manifest.patterns[patternName], this.base, this.config, this.transforms);
			this.dependencies[patternName] = await pattern.read();
		}

		this.getLastModified();
		return this;
	}

	async transform() {
		if ( this.dependencies ) {
			for (let dependency in this.dependencies) {
				await this.dependencies[dependency].transform();
			}
		}

		let demos = {};

		for ( let fileName in this.files ) {
			let file = this.files[fileName];

			if ( file.basename !== 'demo' ) {
				continue;
			}

			let formatConfig = this.config.formats[file.format];

			if (typeof formatConfig !== 'object') {
				continue;
			}

			let transforms = formatConfig.transforms || [];

			for (let transform of transforms) {
				let fn = this.transforms[transform];
			}

			demos[formatConfig.name] = file;
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

			file.dependencies = {};

			for (let dependencyName in this.dependencies) {
				file.dependencies[dependencyName] = this.dependencies[dependencyName].results[formatConfig.name];
			}

			for (let transform of transforms) {
				let fn = this.transforms[transform];
				file = await fn(file, demos[formatConfig.name]);
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
