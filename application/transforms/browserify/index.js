import browserify from 'browserify';
import {directory} from 'q-io/fs';

function browserifyTransformFactory (application) {
	const config = application.configuration.transforms.browserify || {};

	const transforms = Object.keys(config.transforms)
		.map((transformName) => config.transforms[transformName].enabled ? transformName : false)
		.filter((item) => item);

	const transformConfigs = transforms.reduce(function getTransformConfig (results, transformName) {
		results[transformName] = config.transforms[transformName].opts || {};
		return results;
	}, {});

	return async function browserifyTransform (file, dependencies, demos) {
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

		return new Promise(function browserifyResolver (resolve, reject) {
			bundler.bundle(function onBrowserifyBundle (err, buffer) {

				if (err) {
					return reject(err);
				}

				file.buffer = buffer;
				resolve(file);
			});
		});
	};
}

export default browserifyTransformFactory;
