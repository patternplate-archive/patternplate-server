import {resolve, basename, dirname} from 'path';
import {createWriteStream} from 'fs';

import qfs from 'q-io/fs';
import archiver from 'archiver';

import git from '../../../library/utilities/git';

const pkg = require(resolve(process.cwd(), 'package.json'));

async function build (application, config) {
	const patternHook = application.hooks.filter((hook) => hook.name === 'patterns')[0];
	const patternRoot = resolve(application.runtime.patterncwd || application.runtime.cwd, patternHook.configuration.path);

	const patterns = application.configuration.patterns || {};
	const transforms = application.configuration.transforms || {};
	const patternConfig = { patterns, transforms };

	const built = new Date();
	const environment = application.runtime.env;
	const mode = application.runtime.mode;
	const revision = await git.short();
	const branch = await git.branch();
	const tag = await git.tag();
	const version = pkg.version;

	const information = {built, environment, mode, revision, branch, tag, version};
	const buildRoot = resolve(application.runtime.patterncwd || application.runtime.cwd, 'build');
	const buildDirectory = resolve(buildRoot, `build-v${version}-${environment}-${revision}`);

	let environments = await qfs.listTree(resolve(patternRoot, '@environments'));

	environments = environments
		.filter((item) => basename(item) === 'pattern.json')
		.map((item) => dirname(item));

	let builds = [];

	for (let environment of environments) {
		let pattern = await application.pattern.factory(
			qfs.relativeFromDirectory(patternRoot, environment),
			patternRoot,
			patternConfig,
			application.transforms
		);

		await pattern.read();
		await pattern.transform(false, true);

		builds.push(pattern);
	}

	await qfs.makeTree(buildDirectory);

	let writes = [];

	for (let build of builds) {
		let target = build.manifest.name;

		let info = Object.assign({}, information, { version, target });
		let fragments = ['/**!'];

		let comment = Object.keys(info).reduce((results, fragmentName) => {
			let name = `${fragmentName[0].toUpperCase()}${fragmentName.slice(1)}`;
			let value = info[fragmentName];
			results.push(` * ${name}: ${value}`);
			return results;
		}, fragments).concat(['**/']).join('\n');

		let results = build.results[target];

		for (let resultName of Object.keys(results)) {
			let result = results[resultName];
			let contents = `${comment}\n${result.buffer.toString('utf-8')}`;
			let ext = result.out;
			let fileName = resolve(buildDirectory, [build.manifest.name, ext].join('.'));
			application.log.info(`[console:run] Writing "${resultName}" for configuration "${build.manifest.name}" to ${fileName} ...`);
			writes.push(qfs.write(fileName, contents));
		}
	}

	await Promise.all(writes);


	let archive = archiver('zip');
	let output = createWriteStream(`${buildDirectory}.zip`);

	archive.pipe(output);
	archive.directory(buildDirectory, false);
	archive.finalize();

	return new Promise((fulfill, reject) => {
		output.on('close', fulfill);
		archive.on('error', reject);
	});
}

export default build;
