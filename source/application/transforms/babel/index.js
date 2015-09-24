import {transform} from 'babel-core';

export default function createBabelTransform (application) {
	return async function babelTransform (file, demo, configuration) {
		const source = typeof file.buffer === 'string' ? file.buffer : file.buffer.toString('utf-8');
		file.buffer = transform(source, configuration.opts).code;

		if (demo) {
			const demoSource = typeof demo.buffer === 'string' ? demo.buffer : demo.buffer.toString('utf-8');
			demo.buffer = transform(demoSource, configuration.opts).code;
		}

		return file;
	};
}
