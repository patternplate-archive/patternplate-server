import {resolve} from 'path';
import qfs from 'q-io/fs';

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
	await qfs.makeTree(outputBase);

	for (let resultName of Object.keys(virtualPattern.results)) {
		let result = virtualPattern.results[resultName];
		let contents = result.buffer.toString('utf-8');
		let ext = result.out;
		let path = resolve(outputBase, ['index', ext].join('.'));

		application.log.info(`[console:run] Writing ${ext} to ${path} ...`);
		await qfs.write(path, contents);
	}
}

export default build;
