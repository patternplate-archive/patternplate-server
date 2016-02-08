import {
	extname,
	resolve,
	relative
} from 'path';

import fs from 'q-io/fs';
import copySafe from './copy-safe';

export default async function copyDirectory(source, target) {
	const files = await fs.listTree(source);

	return Promise.all(
		files
			.filter(extname)
			.map(async file => {
				const targetFile = resolve(target, relative(source, file));
				return copySafe(file, targetFile);
			})
	);
}

