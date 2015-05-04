#!/usr/bin/env node
/*eslint-disable no-process-env */
import { resolve } from 'path';
import server from '../application';

async function start ( options = {} ) {
	let augmented = Object.assign(options, { 'api': options } );
	return await server( augmented );
}

export default start;
