#!/usr/bin/env node --harmony
import server from '../application';

async function start (options = {}) {
	let augmented = Object.assign(options, {'api': options});
	return await server(augmented);
}

export default start;
