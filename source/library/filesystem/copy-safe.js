import makeDirectory from './make-directory';

async function copySafe(source, target) {
	await mkdirp(dirname(target));
	await copyFile(source, target);
}

