/*eslint-disable no-loop-func */
import jsx from 'react-jsx';

import resolveDependencies from './resolve-dependencies';

export default function reactJSXTransformFactory (application) {
	const config = application.configuration.transforms['react-jsx'] || {};

	return async function reactJSXTransform (file, demo) {
		let source = file.buffer.toString('utf-8');
		let sourceTemplate = jsx.server(source, {'raw': true});

		let data = Object.assign({'props': {}}, resolveDependencies(file.dependencies));
		let result = sourceTemplate(data, {'html': true});

		file.buffer = new Buffer(result, 'utf-8');
		file.in = config.inFormat;
		file.out = config.outFormat;

		if (demo) {
			let demoTemplate = jsx.server(demo.buffer.toString('utf-8'), {'raw': true});
			let demoData = resolveDependencies({'Pattern': file});
			let demoResult = demoTemplate(demoData, {'html': true});

			file.demoSource = demo.source;
			file.demoBuffer = new Buffer(demoResult, 'utf-8');
		}

		return file;
	};
}
