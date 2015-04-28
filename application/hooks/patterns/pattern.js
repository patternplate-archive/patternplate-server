import {resolve, basename, extname} from 'path';
import {exists, toObject} from 'q-io/fs';

export class Pattern {
	files = {};
	config = {};
	manifest = {};
	dependencies = {};
	results = {};

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
		if ( await exists(path) !== true ) {
			throw new Error(`Can not read pattern from ${this.path}, it does not exist.`);
		}

		let files = await toObject(path);

		this.files = Object.keys( files ).reduce(function( results, filePath ){
			results[basename(filePath)] = files[filePath];
			return results;
		}, {});

		let manifest = this.files['pattern.json'];

		if (typeof manifest === 'undefined') {
			throw new Error(`Can not read pattern.json from ${this.path}, it does not exist.`)
		}

		try {
			this.manifest = JSON.parse(manifest.toString('utf-8'));
			delete this.files['pattern.json'];
		} catch (e) {
			throw new Error(`Error while reading pattern.json from ${this.path}:`, e);
		}

		if (typeof this.manifest.pattern !== 'object') {
			return this;
		}

		for ( let patternName in this.manifest.patterns ) {
			let pattern = new Pattern(this.manifest.patterns[patternName], this.base, this.config, this.transforms);
			await pattern.read();
			this.dependencies[patternName] = pattern;
		}

		return this;
	}

	async transform( display = true ) {
		if ( this.dependencies ) {
			for (let dependency in this.dependencies) {
				await this.dependencies[dependency].transform( false );
			}
		}

		for ( let file in this.files ) {
			let ext = extname(file);
			let name = basename(file, ext);
			let format = ext.substr(1, ext.length);

			let typeConfig = this.config.types[name];
			let formatConfig = this.config.formats[format];

			if (typeof typeConfig !== 'object' || typeof formatConfig !== 'object') {
				continue;
			}

			let file = Object.assign({ 'name': file, 'buffer': this.files[file] },
				 typeConfig, { 'display': formatConfig.display });

			if ( display === false && file.build === false ) {
				continue;
			}

			if ( file.display !== 'transform' ) {
				continue;
			}

			let transforms = formatConfig.transforms || [];

			for (let transform of transforms) {
				let fn = this.transforms[transform];
				file = await fn(file, this.dependencies);
			}

			this.results[formatConfig.name] = file;
		}
	}

	toJSON() {
		let copy = Object.assign({}, this);

		if (copy.dependencies) {
			for (let dependency in copy.dependencies) {
				copy.dependencies[dependency] = copy.dependencies[dependency].toJSON();
			}
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
