import marked from 'marked';
import {promisify} from 'bluebird';

export default function markdownTransformFactory (application) {
	const parser = promisify(marked);
	const config = application.configuration.transforms.markdown || {};

	return async function markdowTransform (file) {
		try {
			file.buffer = new Buffer(await parser(file.buffer.toString('utf-8')), 'utf-8');
		} catch (err) {
			application.log.error(err);
			throw new Error(err);
		}

		file.in = config.inFormat;
		file.out = config.outFormat;

		return file;
	};
}
