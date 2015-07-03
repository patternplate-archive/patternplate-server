import boilerplate from 'boilerplate-server';
import findRoot from 'find-root';

async function server (opts) {
	let options = Object.assign({
			'name': 'patternplate-server',
			'cwd': findRoot(__dirname)
		}, opts);

	return await boilerplate(options);
}

export default server;
