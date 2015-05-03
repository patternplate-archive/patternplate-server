import browserify from 'browserify';
import {directory} from 'q-io/fs';

async function runBundler(bundler, config) {
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

function browserifyTransformFactory (application) {
	const config = application.configuration.transforms.browserify || {};

	const transforms = Object.keys(config.transforms)
		.map((transformName) => config.transforms[transformName].enabled ? transformName : false)
		.filter((item) => item);

	const transformConfigs = transforms.reduce(function getTransformConfig (results, transformName) {
		results[transformName] = config.transforms[transformName].opts || {};
		return results;
	}, {});

	return async function browserifyTransform (file, dependencies, demo) {
		const bundler = browserify(Object.assign(config.opts, {
			'entries': file.path,
			'basedir': directory(file.path)
		}));

		for (let dependencyName of Object.keys(dependencies)) {
			bundler.require(dependencies[dependencyName].path, {
				'expose': dependencyName,
				'basedir': directory(dependencies[dependencyName].path)
			});
		}

		for (let transformName of transforms) {
			bundler.transform(transformName, transformConfigs[transformName]);
		}

		if (demo) {
			const demoBundler = browserify(Object.assign(config.opts, {
				'entries': demo.path,
				'basedir': directory(demo.path)
			}));

			for (let transformName of transforms) {
				demoBundler.transform(transformName, transformConfigs[transformName]);
			}

			let demoTransformed = await runBundler(demoBundler, config);

			Object.assign(file, {
				'demoSource': demo.source,
				'demoBuffer': demoTransformed.buffer
			});
		}

		let transformed = await runBundler(bundler, config);
		Object.assign(file, transformed);

		return file;
	};
}

export default browserifyTransformFactory;
