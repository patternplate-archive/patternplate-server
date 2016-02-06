import {
	basename,
	dirname,
	resolve
} from 'path';

import chalk from 'chalk';
import fs from 'q-io/fs';
import throat from 'throat';
import getPatternManifests from './get-pattern-manifests';
import getReadFile from '../filesystem/readFile.js';

const defaults = {
	isEnvironment: false,
	filters: {},
	log: function() {}
};

async function getDependentPatterns(id, base, options) {
	const manifests = await getPatternManifests('.', base, options);
	return manifests.reduce((results, manifest) => { // eslint-disable-line no-loop-func
		const isDependency = Object.values(manifest.patterns || {}).indexOf(id) > -1;
		return isDependency ? {...results, [manifest.id]: manifest} : results;
	}, {});
}

async function getPatterns(options, cache) {
	const settings = {...defaults, ...options};
	const {
		id,
		base,
		config,
		factory,
		transforms,
		filters,
		log,
		isEnvironment
	} = settings;

	const path = resolve(base, id);
	const readFile = getReadFile({cache});
	config.log = log;

	// No patterns to find here
	if (!await fs.exists(path)) {
		return [];
	}

	const search = await fs.exists(resolve(path, 'pattern.json')) ?
		resolve(path, 'pattern.json') :
		path;

	// Get all pattern ids
	const paths = await fs.listTree(search);
	const patternIDs = paths
		.filter(item => basename(item) === 'pattern.json')
		.filter(item => isEnvironment ? true : !item.includes('@environments'))
		.map(item => dirname(item))
		.map(item => fs.relativeFromDirectory(options.base, item));

	// Check if there is a user environment folder
	const environmentBase = resolve(base, '@environments');
	const hasUserEnvironments = await fs.exists(environmentBase);

	// Get available environments ids
	const userEnvironmentPaths = hasUserEnvironments ?
		(await fs.listTree(environmentBase))
			.filter(item => basename(item) === 'pattern.json') :
		[];

	// Load environments
	const userEnvironmentFiles = await Promise.all(
		userEnvironmentPaths.map(readFile)
	);

	// Parse file contents
	const userEnvironments = userEnvironmentFiles
		.map(userEnvironmentFile => JSON.parse(userEnvironmentFile.toString('utf-8')
		));

	// read and transform patterns at a concurrency of 5
	return await* patternIDs.map(throat(5, async patternID => {
		const initStart = new Date();
		const filterString = JSON.stringify(filters);
		log.info(`Initializing pattern "${patternID}" with filters: ${chalk.grey('[' + filterString + ']')}`);
		const pattern = await factory(patternID, base, config, transforms, filters);
		log.info(`Initialized pattern "${patternID}" ${chalk.grey('[' + (new Date() - initStart) + 'ms]')}`);

		const gettingDepending = await getDependentPatterns(patternID, base, {cache});

		const readStart = new Date();
		log.info(`Reading pattern "${patternID}"`);
		await pattern.read();
		pattern.manifest.dependentPatterns = await gettingDepending;
		log.info(`Read pattern "${patternID}" ${chalk.grey('[' + (new Date() - readStart) + 'ms]')}`);

		const transformStart = new Date();
		log.info(`Transforming pattern "${patternID}"`);
		const transformed = await pattern.transform(!isEnvironment, isEnvironment);
		log.info(`Transformed pattern "${patternID}" ${chalk.grey('[' + (new Date() - transformStart) + 'ms]')}`);
		return typeof transformed.toJSON === 'function' ? transformed.toJSON() : transformed;
	}));
}

export default getPatterns;
