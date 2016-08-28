import fs from 'fs';
import path from 'path';
import exists from 'path-exists';
import urlQuery from '../../library/utilities/url-query';

export default function fileRouteFactory(application) {
	return async function fileRoute() {
		const extname = path.extname(this.path);
		const format = extname.slice(1);
		const {pathname, query} = urlQuery.parse(this.params.id);
		const type = query.type || 'source';
		const environment = query.environment || 'index';

		if (!format) {
			this.throw(404);
		}

		// Read directly from source
		if (type === 'source') {
			const sourcePath = path.resolve(application.runtime.patterncwd, 'patterns', pathname);
			const [error, stream] = await getReadStreamOrError(sourcePath);

			if (error) {
				this.throw(error);
			}

			this.type = extname;
			this.body = stream;
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
