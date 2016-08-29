import fs from 'fs';
import path from 'path';
import exists from 'path-exists';

import getPatternRetriever from '../../library/utilities/get-pattern-retriever';
import urlQuery from '../../library/utilities/url-query';

export default function fileRouteFactory(application) {
	return async function fileRoute() {
		const extname = path.extname(this.path);
		const format = extname.slice(1);
		const {pathname, query} = urlQuery.parse(this.params.id);
		const type = query.type;
		const environment = query.environment;

		if (!format) {
			this.throw(404);
		}

		if (!type || !['source', 'transformed'].includes(type)) {
			this.throw(404);
		}

		if (!environment) {
			this.throw(404);
		}

		// Read directly from fs
		if (type === 'source') {
			const sourcePath = path.resolve(application.runtime.patterncwd, 'patterns', pathname);
			const [error, stream] = await getReadStreamOrError(sourcePath);

			if (error) {
				this.throw(error);
			}

			this.type = extname;
			this.body = stream;
			return;
		}

		// transform the file
		if (type === 'transformed') {
			const baseName = path.basename(pathname, path.extname(pathname));
			const filters = {
				baseNames: [baseName], environments: [environment], outFormats: [format]
			};

			const [error, file] = await getPatternFileOrError(application)(pathname, {
				filters, environment
			});

			if (error) {
				this.throw(500, error);
				return;
			}

			this.body = file.buffer;
			return;
		}
	};
}

function getPatternFileOrError(application) {
	return async (pathname, options) => {
		const id = path.dirname(pathname);
		const basename = path.basename(pathname);
		const retrieve = getPatternRetriever(application);
		try {
			const [pattern] = await retrieve(id, options.filters, options.environment, ['read', 'transform']);

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
			return [null, file];
		} catch (error) {
			return [error];
		}
	};
}

async function getReadStreamOrError(sourcePath) {
	if (!await exists(sourcePath)) {
		const error = new Error(`Could not find ${sourcePath}`);
		error.status = 404;
		return [error];
	}
	return [null, fs.createReadStream(sourcePath)];
}

module.change_code = 1;
