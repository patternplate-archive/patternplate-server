import React from 'react';

import resolveDependencies from './resolve-dependencies';

export default function reactJSXTransformFactory (application) {
	const config = application.configuration.transforms['react-jsx'] || {};

	return async function reactJSXTransform (file, demo, configuration) {
		let scope = resolveDependencies({'Pattern': file}, configuration.opts);

		try {
			let result = React.renderToStaticMarkup(React.createElement(scope.Pattern));

			file.buffer = new Buffer(result, 'utf-8');
			file.in = config.inFormat;
			file.out = config.outFormat;
		} catch (error) {
			error.file = file.path;
			throw error;
		}

		if (demo) {
			demo.dependencies = Object.assign({'pattern': file}, file.dependencies);
			let scope = resolveDependencies({'Demo': demo}, configuration.opts);

			try {
				let result = React.renderToStaticMarkup(React.createElement(scope.Demo));

				file.demoSource = demo.source;
				file.demoBuffer = new Buffer(result, 'utf-8');
			} catch (error) {
				error.file = demo.path;
				throw error;
			}
		}

		return file;
	};
}
