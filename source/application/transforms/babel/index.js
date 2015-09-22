import {transform} from 'babel-core';

export default function createBabelTransform (application) {
	return async function babelTransform (file, demo) {
		const source = typeof file.buffer === 'string' ? file.buffer : file.buffer.toString('utf-8');
		file.buffer = transform(source).code;

		if (demo) {
			const demoSource = typeof demo.buffer === 'string' ? demo.buffer : demo.buffer.toString('utf-8');
			demo.buffer = transform(demoSource).code;
		}

		return file;
	};
}
