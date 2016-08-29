import fs from 'fs';
import path from 'path';

import getPatternRetriever from './utilities/get-pattern-retriever';

export default getPatternSource;

function getPatternSource(application) {
	const cwd = application.runtime.patterncwd;

	return async (pathname, type, environment) => {
		if (type === 'source') {
			const sourcePath = path.resolve(cwd, 'patterns', pathname);
			return {
				type: path.extname(sourcePath),
				body: fs.createReadStream(sourcePath)
			};
		}

		const id = path.dirname(pathname);
		const format = path.extname(pathname).slice(1);
		const basename = path.basename(pathname);
		const concern = path.basename(pathname, path.extname(pathname));
		const filters = {
			baseNames: [concern], environments: [environment], outFormats: [format]
		};

		const retrieve = getPatternRetriever(application);
		const [pattern] = await retrieve(id, filters, environment, ['read', 'transform']);

		if (!pattern) {
			const error = new Error(`No pattern with id ${id} found`);
			error.status = 404;
			throw error;
		}

		if (!(basename in pattern.files)) {
			const files = Object.keys(pattern.files || {});
			const error = new Error(`pattern ${id} has no file ${basename}. Available files: ${files.join(', ')}`);
			error.status = 404;
			throw error;
		}

		const file = pattern.files[basename];
		return {
			type: file.out,
			body: file.buffer
		};
	};
}
