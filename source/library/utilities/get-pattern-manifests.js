import {
	basename,
	dirname,
	resolve,
	sep
} from 'path';

import fs from 'q-io/fs';
import getPatternManifest from './get-pattern-manifest';

async function loadPatterns(id, base, options = {}) {
	const path = id.split('/').join(sep);
	const paths = await fs.listTree(
		resolve(base, path)
	);

	const patternIDs = paths
		.filter(item => basename(item) === 'pattern.json')
		.filter(item => !item.includes('@environments'))
		.map(item => dirname(item))
		.map(item => fs.relativeFromDirectory(base, item))
		.map(item => item.split(sep).join('/'));

	const manifests = Promise.all(
		patternIDs
			.map(patternID => getPatternManifest(patternID, base, options.cache))
	);
	return await manifests;
}

export default loadPatterns;
