import Vinyl from 'vinyl';
import {dirname} from 'path';
import browserify from 'browserify';

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

		let stream = new Vinyl({'contents': new Buffer(dependency.buffer)});

		if (dependency) {
			data = data
				.concat(resolveDependencies(dependency))
				.concat({stream, opts});
		}
	}

	return data;
}

function browserifyTransformFactory (application) {
	const config = application.configuration.transforms.browserify || {};

	const transformNames = Object.keys(config.transforms)
		.map((transformName) => config.transforms[transformName].enabled ? transformName : false)
		.filter((item) => item);

	const transforms = transformNames.reduce(function getTransformConfig (results, transformName) {
		let transformFn;
		let transformConfig = config.transforms[transformName].opts || {};

		try {
			transformFn = require(transformName);
		} catch (error) {
			application.log.warn(`Unable to load browserify transform ${transformName}.`);
			application.log.error(error.stack);
		}

		results[transformName] = [transformFn, transformConfig];
		return results;
	}, {});

	return async function browserifyTransform (file, demo) {
		let stream = new Vinyl({ 'contents': new Buffer(file.buffer) });
		const bundler = browserify(stream, config.opts);

		let dependencies = resolveDependencies(file);

		dependencies.forEach(function requireDependency (dependency) {
			bundler.exclude(dependency.opts.expose);
			bundler.require(dependency.stream, dependency.opts);
		});

		for (let transformName of Object.keys(transforms)) {
			bundler.transform(...transforms[transformName]);
		}

		if (demo) {
			let demoStream = new Vinyl({ 'contents': new Buffer(demo.buffer) });
			const demoBundler = browserify(demoStream, config.opts);

			let Pattern = Object.assign({}, file);
			let demoDependencies = resolveDependencies({'dependencies': {Pattern}});

			demoDependencies.forEach(function requireDependency (dependency) {
				demoBundler.exclude(dependency.opts.expose);
				demoBundler.require(dependency.stream, dependency.opts);
			});

			for (let transformName of Object.keys(transforms)) {
				demoBundler.transform(transforms[transformName]);
			}

			let demoTransformed;

			try {
				demoTransformed = await runBundler(demoBundler, config);
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
			transformed = await runBundler(bundler, config);
		} catch (err) {
			err.file = file.path || err.fileName;
			throw err;
		}

		Object.assign(file, transformed);
		return file;
	};
}

export default browserifyTransformFactory;
