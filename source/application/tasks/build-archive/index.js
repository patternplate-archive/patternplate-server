import {createWriteStream} from 'fs';
import {resolve} from 'path';

import archiver from 'archiver';
import exists from 'path-exists';

import git from '../../../library/utilities/git';
import {warn} from '../../../library/log/decorations';

const pkg = require(resolve(process.cwd(), 'package.json'));

export default async application => {
	const cwd = application.runtime.patterncwd || application.runtime.cwd;
	const buildRoot = resolve(cwd, 'build');
	const environment = application.runtime.env;
	const revision = await git.short();
	const version = pkg.version;
	const buildDirectory = resolve(buildRoot, `build-v${version}-${environment}-${revision}`);
	const buildDirectoryExists = await exists(buildDirectory);

	if (buildDirectoryExists === false) {
		application.log.warn(warn`directory ${buildDirectory} not found, nothing to archive`);
		return;
	}

	const archive = archiver('zip');
	const output = createWriteStream(`${buildDirectory}.zip`);

	archive.pipe(output);
	archive.directory(buildDirectory, false);
	archive.finalize();

	return new Promise((fulfill, reject) => {
		output.on('close', () => {
			fulfill();
		});
		archive.on('error', reject);
	});
};
