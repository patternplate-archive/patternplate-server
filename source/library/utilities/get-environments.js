import {
	basename,
	resolve
} from 'path';

import {
	debuglog
} from 'util';

import exists from 'path-exists';
import {
	merge
} from 'lodash';
import fs from 'q-io/fs';

import getReadFile from '../filesystem/read-file';
import {
	fail
} from '../log/decorations';

const envDebug = debuglog('environments');

export const defaultEnvironment = {
	name: 'index',
	version: '0.1.0',
	applyTo: ['**/*'],
	include: ['**/*'],
	excludes: [],
	priority: 0,
	environment: {}
};

export default async function getEnvironments(base, options = {}) {
	const {log, cache} = options;
	const readFile = getReadFile({cache});

	// Check if there is a user environment folder
	const environmentBase = resolve(base, '@environments');
	const hasUserEnvironments = await exists(environmentBase);

	// Get available environments ids
	let userEnvironmentPaths = hasUserEnvironments ?
		(await fs.listTree(environmentBase))
			.filter(item => basename(item) === 'pattern.json') :
		[];

	envDebug('found environment files at %s', userEnvironmentPaths);

	// filter for desired env
	// todo: refactor this part
	if (options.desiredEnv && userEnvironmentPaths.length > 0) {
		userEnvironmentPaths = userEnvironmentPaths.filter(function(item) {
			let envName = item
				.replace(/\/pattern.json$/, "")
				.split("/")

			envName = envName[envName.length - 1];

			return envName == options.desiredEnv;
		});
	}

	// Load environments
	const userEnvironmentFiles = await Promise.all(
		userEnvironmentPaths.map(envFilePath => {
			envDebug('reading env file %s', envFilePath);
			const content = readFile(envFilePath);
			envDebug('%s %s', envFilePath, content);
			return content;
		})
	);

	// Parse environment file contents
	const userEnvironments = userEnvironmentFiles
		.map(userEnvironmentFile => {
			try {
				const raw = JSON.parse(userEnvironmentFile.toString('utf-8'));
				return merge({}, defaultEnvironment, raw);
			} catch (error) {
				if (log) {
					log.error(fail`Failed reading environment file ${userEnvironmentFile}:\n${error}`);
				}
				return null;
			}
		})
		.filter(Boolean);

	envDebug('read environment data');
	envDebug(userEnvironments);

	return userEnvironments;
}
