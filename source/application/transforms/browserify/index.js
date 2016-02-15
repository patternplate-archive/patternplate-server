import Vinyl from 'vinyl';
import {dirname} from 'path';
import browserify from 'browserify';
import omit from 'lodash.omit';

async function runBundler(bundler) {
	return new Promise((resolver, rejecter) => {
		bundler.bundle((err, buffer) => {
			if (err) {
				return rejecter(err);
			}

			resolver({
				buffer: buffer || new Buffer('')
			});
		});
	});
}

function squashDependencies(file, registry = {}) {
	for (const dependencyName of Object.keys(file.dependencies)) {
		let dependency = file.dependencies[dependencyName];

		if (!(dependencyName in registry) || registry[dependencyName].path === dependency.path) {
			registry[dependencyName] = {
				path: dependency.path,
				source: dependency.source,
				buffer: dependency.buffer,
				dependencies: dependency.dependencies
			};
			file.dependencies = omit(file.dependencies, dependencyName);
			dependency = registry[dependencyName];
		}

		squashDependencies(dependency, registry);
	}

	return registry;
}

async function resolveDependencies(file, configuration) {
	const dependencies = squashDependencies(file);

	for (const expose of Object.keys(dependencies)) {
		const dependency = dependencies[expose];

		// Nested dependencies
		if (dependency.dependencies && Object.keys(dependency.dependencies).length > 0) {
			const basedir = dirname(dependency.path);
			const opts = {expose, basedir};

			const dependencyBundler = resolveDependencies(dependency, Object.assign(
				{}, configuration.opts, opts,
				{standalone: expose}
			));
			let transformed;
			try {
				transformed = await runBundler(dependencyBundler, configuration, dependency);
			} catch (err) {
				throw err;
			}

			dependency.buffer = transformed.buffer.toString('utf-8');
		} // Squashed and flat dependencies (way faster)
	}
	const contents = new Buffer(file.buffer);
	const bundler = browserify(new Vinyl({
		contents,
		path: file.path
	}), configuration.opts);

	for (const expose of Object.keys(dependencies)) {
		const dependency = dependencies[expose];
		const basedir = dirname(dependency.path);
		const opts = {expose, basedir};
		bundler.exclude(expose);
		bundler.require(new Vinyl({
			path: dependency.path,
			contents: new Buffer(dependency.buffer)
		}), Object.assign({}, configuration.opts, opts));
	}

	return bundler;
}

function browserifyTransformFactory(application) {
	return async function browserifyTransform(file, demo, configuration) {
		const transformNames = Object.keys(configuration.transforms)
			.map(transformName => configuration.transforms[transformName].enabled ? transformName : false)
			.filter(Boolean);

		const transforms = transformNames.reduce((results, transformName) => {
			let transformFn;
			const transformConfig = configuration.transforms[transformName].opts || {};

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
			return {...file, buffer: buffer.toString('utf-8')};
		} catch (err) {
			err.file = file.path || err.fileName;
			throw err;
		}
	};
}

export default browserifyTransformFactory;
