import {resolve as pathResolve} from 'path';

import Vinyl from 'vinyl';
import {dirname} from 'path';
import browserify from 'browserify';
import resolve from 'resolve';

async function runBundler (bundler, config) {
	return new Promise(function bundlerResolver (resolve, reject) {
		bundler.bundle(function onBundle (err, buffer) {
			if (err) {
				return reject(err);
			}

			resolve({
				'buffer': buffer,
				'in': config.inFormat,
				'out': config.outFormat
			});
		});
	});
}

function resolveDependencies (file) {
	let data = [];

	for (let expose of Object.keys(file.dependencies || {})) {
		let dependency = file.dependencies[expose];
		let basedir = dirname(dependency.path);
		let opts = {expose, basedir};

		let contents = Buffer.isBuffer(dependency.source) ? dependency.source : new Buffer(dependency.source);
		let stream = new Vinyl({contents});

		if (dependency) {
			data = data
				.concat(resolveDependencies(dependency))
				.concat({stream, opts, contents });
		}
	}

	return data;
}

function browserifyTransformFactory (application) {
	return async function browserifyTransform (file, demo, configuration) {
		let contents = new Buffer(file.source);
		let stream = new Vinyl({contents});

		const transformNames = Object.keys(configuration.transforms)
			.map((transformName) => configuration.transforms[transformName].enabled ? transformName : false)
			.filter((item) => item);

		const transforms = transformNames.reduce(function getTransformConfig (results, transformName) {
			let transformFn;
			let transformConfig = configuration.transforms[transformName].opts || {};

			try {
				transformFn = require(transformName);
			} catch (error) {
				application.log.warn(`Unable to load browserify transform ${transformName}.`);
				application.log.error(error.stack);
			}

			results[transformName] = [transformFn, transformConfig];
			return results;
		}, {});

		if (configuration.opts.noParse) {
			configuration.opts.noParse = configuration.opts.noParse.map((item) => {
				let basedir = pathResolve(application.runtime.patterncwd || application.runtime.cwd);
				try {
					return resolve.sync(item, {basedir});
				} catch (err) {
					console.log(err);
				}
				return null;
			}).filter((item) => item);
		}

		const bundler = browserify(stream, configuration.opts);
		let dependencies = resolveDependencies(file);

		dependencies.forEach(function requireDependency (dependency) {
			bundler.exclude(dependency.opts.expose);
			bundler.require(dependency.stream, dependency.opts);
		});

		for (let transformName of Object.keys(transforms)) {
			bundler.transform(...transforms[transformName]);
		}

		if (demo) {
			let demoStream = new Vinyl({'contents': new Buffer(demo.source)});
			const demoBundler = browserify(demoStream, configuration.opts);

			let Pattern = Object.assign({}, file);
			let demoDependencies = resolveDependencies({'dependencies': {Pattern}});

			demoDependencies.forEach(function requireDependency (dependency) {
				demoBundler.exclude(dependency.opts.expose);
				demoBundler.require(dependency.stream, Object.assign(dependency.opts));
			});

			for (let transformName of Object.keys(transforms)) {
				demoBundler.transform(...transforms[transformName]);
			}

			let demoTransformed;

			try {
				demoTransformed = await runBundler(demoBundler, configuration);
			} catch (err) {
				err.file = demo.path || err.fileName;
				throw err;
			}

			Object.assign(file, {
				'demoSource': demo.source,
				'demoBuffer': demoTransformed.buffer
			});
		}

		let transformed;

		try {
			transformed = await runBundler(bundler, configuration);
		} catch (err) {
			err.file = file.path || err.fileName;
			throw err;
		}

		Object.assign(file, transformed);
		file.in = configuration.inFormat;
		file.out = configuration.outFormat;

		return file;
	};
}

export default browserifyTransformFactory;
