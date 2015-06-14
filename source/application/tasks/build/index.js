import {resolve} from 'path';
import {createWriteStream} from 'fs';

import qfs from 'q-io/fs';
import archiver from 'archiver';

import git from '../../../library/utilities/git';

async function build (application, config) {
	let patternHook = application.hooks.filter((hook) => hook.name === 'patterns')[0];
	let patternRoot = resolve(application.runtime.patterncwd || application.runtime.cwd, patternHook.configuration.path);

	let virtualPattern = await application.pattern.factory(
		'.tmp',
		patternRoot,
		application.configuration.patterns,
		application.transforms
	);

	await virtualPattern.virtualize();

	try {
		await virtualPattern.read();
		await virtualPattern.transform(false, true);
	} catch (err) {
		throw err;
	} finally {
		await virtualPattern.clean();
	}

	let outputBase = resolve(application.runtime.patterncwd || application.runtime.cwd, 'build');
	let tmpBase = resolve(application.runtime.patterncwd || application.runtime.cwd, '.tmp');

	if (await qfs.exists(tmpBase)) {
		await qfs.removeTree(tmpBase);
	}

	await qfs.makeTree(outputBase);
	await qfs.makeTree(tmpBase);

	let built = new Date();
	let environment = application.runtime.env;
	let mode = application.runtime.mode;
	let version = application.configuration.pkg.version;
	let revision = await git.short();
	let branch = await git.branch();
	let tag = await git.tag();

	let meta = { built, environment, mode, version, revision, branch, tag };
	let fragments = ['/**!'];

	let comment = Object.keys(meta).reduce((results, fragmentName) => {
		let name = `${fragmentName[0].toUpperCase()}${fragmentName.slice(1)}`;
		let value = meta[fragmentName];
		results.push(` * ${name}: ${value}`);
		return results;
	}, fragments);

	comment.push(' **/');
	comment = comment.join('\n');

	for (let resultName of Object.keys(virtualPattern.results)) {
		let result = virtualPattern.results[resultName];
		let contents = result.buffer.toString('utf-8');
		let ext = result.out;
		let path = resolve(tmpBase, ['index', ext].join('.'));

		application.log.info(`[console:run] Writing ${ext} to ${path} ...`);
		contents = `${comment}\n${contents}`;

		await qfs.write(path, contents);
	}

	let archive = archiver('zip');
	let output = createWriteStream(resolve(outputBase, `build-${version}.zip`));

	archive.pipe(output);
	archive.directory(tmpBase, false);
	archive.finalize();

	return new Promise((fulfill, reject) => {
		output.on('close', fulfill);
		archive.on('error', reject);
	});
}

export default build;
