import boilerplate from 'boilerplate-server';

async function server (opts) {
	let options = Object.assign({
			'name': 'patternplate-server'
		}, opts);

	return await boilerplate(options);
}

export default server;
