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
	var data = [];

	for (let dependencyName of Object.keys(file.dependencies || {})) {
		if (file.dependencies[dependencyName]) {
			data = data
				.concat(resolveDependencies(file.dependencies[dependencyName]))
				.concat([{
					'file': file.dependencies[dependencyName].path,
					'expose': dependencyName
				}]);

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
		const bundler = browserify(Object.assign(config.opts, {
			'entries': file.path
		}));

		let dependencies = resolveDependencies(file);
		bundler.require(dependencies);

		for (let transformName of Object.keys(transforms)) {
			bundler.transform(transforms[transformName]);
		}

		if (demo) {
			const demoBundler = browserify(Object.assign(config.opts, {
				'entries': demo.path
			}));

			demoBundler.require(resolveDependencies({
				'dependencies': {
					'Pattern': file
				}
			}));

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
