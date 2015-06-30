import {resolve as pathResolve} from 'path';

import Vinyl from 'vinyl';
import {dirname} from 'path';
import browserify from 'browserify';
import resolve from 'resolve';

function excludeFromBundleResolve(bundler, dependencies = []) {
	dependencies.forEach(function(dependency){
		bundler.exclude(dependency);
	});
}

async function runBundler (bundler, config) {
	return new Promise(function bundlerResolver (resolve, reject) {
		bundler.bundle(function onBundle (err, buffer) {
			if (err) {
				throw err;
			}

			resolve({
				'buffer': buffer,
				'in': config.inFormat,
				'out': config.outFormat
			});
		});
	});
}

async function resolveDependencies (file, bundler, configuration) {
	let dependencies = [];

	for (let expose of Object.keys(file.dependencies || {})) {
		dependencies.push(expose);

		let dependency = file.dependencies[expose];
		let basedir = dirname(dependency.path);
		let opts = {expose, basedir};
		let contents = Buffer.isBuffer(dependency.source) ? dependency.source : new Buffer(dependency.source);
		let dependencyStream = new Vinyl({contents});

		let dependencyBundler = browserify(dependencyStream, Object.assign({}, configuration.opts, { 'standalone': expose }));
		let subDependencies = await resolveDependencies(dependency, dependencyBundler, configuration);
		dependencies = dependencies.concat(subDependencies);

		try {
			let results = await runBundler(dependencyBundler, configuration);
			excludeFromBundleResolve(bundler, dependencies);
			bundler.require(new Vinyl({ 'contents': results.buffer }), opts);
		} catch (err) {
			throw err;
		}
	}

	return dependencies;
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

		if (configuration.opts && configuration.opts.noParse) {
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

		configuration.opts.debug = false;

		let bundler = browserify(stream, configuration.opts);

		try {
			await resolveDependencies(file, bundler, configuration);
		} catch (err) {
			console.log(err);
		}

		for (let transformName of Object.keys(transforms)) {
			bundler.transform(...transforms[transformName]);
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

		if (demo) {
			let demoStream = new Vinyl({'contents': new Buffer(demo.source)});
			let demoBundler = browserify(demoStream, configuration.opts);
			demo.dependencies = { 'Pattern': file };

			try {
				await resolveDependencies(demo, demoBundler, configuration);
			} catch (err) {
				console.log(err);
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



			/*let demoStream = new Vinyl({'contents': new Buffer(demo.source)});
			let demoBundler = browserify(demoStream, configuration.opts);

			try {
				await resolveDependencies(file, demoBundler, configuration);
				demoBundler.exclude('Pattern');
				demoBundler.require(new Vinyl({'contents': transformed.buffer }), { 'expose': 'Pattern' });
			} catch (err) {
				console.log(err);
			}

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
			});*/
		}

		return file;
	};
}

export default browserifyTransformFactory;
