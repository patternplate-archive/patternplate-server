import {resolve} from 'path';

import exists from 'path-exists';

import copyDirectory from '../../../library/filesystem/copy-directory';
import makeDirectory from '../../../library/filesystem/make-directory';
import git from '../../../library/utilities/git';
import {ok, wait, warn} from '../../../library/log/decorations';

const pkg = require(resolve(process.cwd(), 'package.json'));

export default async application => {
	const cwd = application.runtime.patterncwd || application.runtime.cwd;
	const staticRoot = resolve(cwd, 'static');
	const assetRoot = resolve(cwd, 'assets');

	const environment = application.runtime.env;
	const revision = await git.short();
	const version = pkg.version;

	const buildRoot = resolve(cwd, 'build');
	const buildDirectory = resolve(buildRoot, `build-v${version}-${environment}-${revision}`);
	const patternBuildDirectory = resolve(buildDirectory, 'patterns');

	if (await exists(staticRoot)) {
		const staticTarget = resolve(patternBuildDirectory, 'static');
		application.log.info(wait`Copying asset files from "${assetRoot}" to ${staticTarget}`);
		await makeDirectory(staticTarget);
		await copyDirectory(staticRoot, staticTarget);
		application.log.info(ok`Copied asset files`);
	} else {
		application.log.warn(warn`No asset files at "${staticRoot}"`);
	}
};
