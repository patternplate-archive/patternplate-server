import path from 'path';

import urlQuery from '../../library/utilities/url-query';
import getPatternData from '../../library/get-pattern-data';
import getPatternDemo from '../../library/get-pattern-demo';
import getPatternFile from '../../library/get-pattern-file';

function getPatternId(raw) {
	const parsed = path.parse(raw);
	const extension = getPatternExtension(raw);
	const base = path.basename(raw, path.extname(raw));

	if (base === 'index' && extension !== 'json') {
		return path.dirname(raw);
	}

	return `${path.dirname(raw)}/${path.basename(parsed.base, path.extname(parsed.base))}`;
}

function getPatternExtension(raw) {
	return path.extname(raw).slice(1) || 'html';
}

export default function patternRouteFactory(application) {
	return async function patternRoute() {
		const type = this.accepts('text', 'html', 'json');

		const parsed = urlQuery.parse(this.params.id);
		const id = getPatternId(parsed.pathname);
		const extension = getPatternExtension(parsed.pathname);

		const {environment} = parsed.query;

		const filters = {
			outFormats: [extension],
			environments: [environment].filter(Boolean)
		};

		if (type === 'json' && extension === 'json') {
			this.type = 'json';
			const data = await getPatternData(application, id);

			if (!data) {
				const error = new Error(`Could not find pattern ${id}`);
				error.fileName = id;
				this.throw(404, error);
			}

			if (data.transform && data.message) {
				throw data;
			}

			this.body = data;
			return;
		}

		if (type === 'html' && extension === 'html') {
			this.type = 'html';
			this.body = await getPatternDemo(application, id, filters, environment);
			return;
		}

		this.type = extension;
		this.body = await getPatternFile(application, id, filters, extension, environment);
	};
}
