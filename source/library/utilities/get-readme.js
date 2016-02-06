import {
	resolve,
	sep
} from 'path';

import denodeify from 'denodeify';
import {
	find
} from 'lodash';
import markedNodeBack from 'marked';
import pathExists from 'path-exists';

import getReadFile from '../filesystem/readFile.js';

const marked = denodeify(markedNodeBack);

const defaults = {
	fallback: true,
	cache: null,
	baseNames: [
		'README.md',
		'Readme.md',
		'readme.md',
		'index.md'
	]
};

async function getExistingBaseName(basePath, baseNames) {
	const exist = await Promise.all(
		baseNames
			.map(baseName => resolve(basePath, baseName))
			.map(async path => {
				return {
					path,
					exists: await pathExists(path)
				};
			})
	);

	return (find(exist, 'exists') || {}).path;
}

async function getMarkdown(id, base, options) {
	const readFile = getReadFile({
		cache: options.cache
	});
	const basePath = resolve(base, id.split('/').join(sep));
	const markdownPath = await getExistingBaseName(basePath, options.baseNames);

	if (markdownPath) {
		const buffer = await readFile(markdownPath);
		return buffer.toString('utf-8');
	} else {
		return '';
	}
}

export default async function renderReadme(id, base, options) {
	const settings = {...defaults, ...options};
	return await marked(
		await getMarkdown(id, base, settings)
	);
}
