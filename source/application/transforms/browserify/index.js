import browserify from 'browserify';

// TODO: Fix this properly
import babelify from 'babelify';
import uglifyify from 'uglifyify';

const browserifyTransforms = {babelify, uglifyify};

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

	console.log(data);
	return data;
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

	return async function browserifyTransform (file, demo) {
		const bundler = browserify(Object.assign(config.opts, {
			'entries': file.path
		}));

		let dependencies = resolveDependencies(file);
		bundler.require(dependencies);

		for (let transformName of transforms) {
			let transformFn = browserifyTransforms[transformName];
			bundler.transform(transformFn.configure(transformConfigs[transformName]));
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
