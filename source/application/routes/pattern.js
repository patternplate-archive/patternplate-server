import path from 'path';

import urlQuery from '../../library/utilities/url-query';
import getPatternData from '../../library/get-pattern-data';
import getPatternDemo from '../../library/get-pattern-demo';
import getPatternFile from '../../library/get-pattern-file';

function withErrorHandling(fn) {
	return async function(...args) {
		const [, id] = args;
		try {
			const result = await fn(...args);
			if (!result) {
				const error = new Error(`Could not find pattern with id ${id}`);
				error.fileName = id;
				error.file = id;
				error.status = 404;
				throw error;
			}
			return [null, result];
		} catch (error) {
			return [error];
		}
	};
}

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

const getPatternDataOrError = withErrorHandling(getPatternData);
const getPatternDemoOrError = withErrorHandling(getPatternDemo);
const getPatternFileOrError = withErrorHandling(getPatternFile);

export default function patternRouteFactory(application) {
	return async function patternRoute() {
		const parsed = urlQuery.parse(this.params.id);
		const id = getPatternId(parsed.pathname);
		const extension = getPatternExtension(parsed.pathname);
		const type = this.accepts('text', 'html', 'json') || extension;
		const {environment = 'index'} = parsed.query;

		const filters = {
			outFormats: [extension],
			environments: [environment].filter(Boolean)
		};

		if (type === 'json' || extension === 'json') {
			const [error, data] = await getPatternDataOrError(application, id, environment);

			if (error) {
				this.throw(error);
			}

			this.type = 'json';
			this.body = data;
			return;
		}

		if (type === 'html' && extension === 'html') {
			const [error, demo] = await getPatternDemoOrError(application, id, environment);

			if (error) {
				this.throw(error);
			}

			this.type = 'html';
			this.body = demo;
			return;
		}

		const [error, file] = await getPatternFileOrError(application, id, filters, extension, environment);

		if (error) {
			this.throw(error);
		}

		this.type = extension;
		this.body = file;
	};
}
