import Vinyl from 'vinyl';
import {dirname} from 'path';
import browserify from 'browserify';
import omit from 'lodash.omit';

async function runBundler (bundler, config) {
	return new Promise(function bundlerResolver (resolver, rejecter) {
		bundler.bundle(function onBundle (err, buffer) {
			if (err) {
				return rejecter(err);
			}

			resolver({
				'buffer': buffer || new Buffer(''),
				'in': config.inFormat,
				'out': config.outFormat
			});
		});
	});
}

function squashDependencies(file, registry = {}) {
	for (let dependencyName of Object.keys(file.dependencies)) {
		let dependency = file.dependencies[dependencyName];

		if (!(dependencyName in registry) || registry[dependencyName].path === dependency.path) {
			registry[dependencyName] = {
				'path': dependency.path,
				'source': dependency.source,
				'buffer': dependency.buffer,
				'dependencies': dependency.dependencies
			};
			//copy.dependencies = omit(copy.dependencies, dependencyName);
			file.dependencies = omit(file.dependencies, dependencyName);
			dependency = registry[dependencyName];
		}

		squashDependencies(dependency, registry);
	}

	return registry;
}

async function resolveDependencies (file, configuration) {
	let dependencies = squashDependencies(file);

	for (let expose of Object.keys(dependencies)) {
		let dependency = dependencies[expose];

		// Nested dependencies
		if (dependency.dependencies && Object.keys(dependency.dependencies).length > 0) {
			let basedir = dirname(dependency.path);
			let opts = {expose, basedir};

			let dependencyBundler = resolveDependencies(dependency, Object.assign(
				{}, configuration.opts, opts,
				{ 'standalone': expose }
			));
			let transformed;
			try {
				transformed = await runBundler(dependencyBundler, configuration, dependency);
			} catch (err) {
				throw err;
			}

			dependency.buffer = transformed.buffer.toString('utf-8');
		} else { // Squashed and flat dependencies (way faster)
			dependency.buffer = dependency.source;
		}
	}

	let contents = new Buffer(file.buffer);
	let bundler = browserify(new Vinyl({contents}), configuration.opts);

	for (let expose of Object.keys(dependencies)) {
		let dependency = dependencies[expose];
		let basedir = dirname(dependency.path);
		let opts = {expose, basedir};

		bundler.exclude(expose);
		bundler.require(new Vinyl({'contents': new Buffer(dependency.buffer)}), Object.assign({}, configuration.opts, opts));
	}

	return bundler;
}

function browserifyTransformFactory (application) {
	return async function browserifyTransform (file, demo, configuration) {
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

		const bundler = await resolveDependencies(file, configuration, application.cache);

		console.log(file.buffer);

		for (const transformName of Object.keys(transforms)) {
			const [transformFn, transformConfig] = transforms[transformName];
			if (typeof transformFn.configure === 'function') {
				bundler.transform(transformFn.configure(transformConfig));
			} else {
				bundler.transform(...transforms[transformName]);
			}
		}

		try {
			const bundled = await runBundler(bundler, configuration, file);
			const {buffer} = bundled;
			return {...file, buffer: buffer.toString('utf-8') };
		} catch (err) {
			err.file = file.path || err.fileName;
			throw err;
		}
	};
}

export default browserifyTransformFactory;
