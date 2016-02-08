import {
	basename,
	dirname,
	resolve
} from 'path';

import {
	debuglog,
	inspect
} from 'util';

import chalk from 'chalk';
import fs from 'q-io/fs';
import {
	merge,
	omit
} from 'lodash';
import minimatch from 'minimatch';
import throat from 'throat';

import getDependentPatterns from './get-dependent-patterns';
import getReadFile from '../filesystem/read-file.js';
import getStaticCacheItem from './get-static-cache-item.js';

const envDebug = debuglog('environments');

const defaults = {
	isEnvironment: false,
	filters: {},
	log: function() {}
};

function getMatchingEnvironments(patternID, environments) {
	const matchingEnvironments = environments
		// get matching environments
		.filter(userEnvironment => {
			envDebug('using filters %s for environment %s to match against %s', userEnvironment.applyTo, userEnvironment.name, patternID);

			const positives = userEnvironment.applyTo
				.filter(glob => glob[0] !== '!');

			const negatives = userEnvironment.applyTo
				.filter(glob => glob[0] === '!')
				.map(glob => glob.slice(1));

			const matchPositive = positives
				.filter(positive => minimatch(patternID, positive));

			const matchNegative = negatives
				.filter(negative => minimatch(patternID, negative));

			envDebug('matching %s against %s, %s', patternID, positives, negatives);

			if (matchPositive.length > 0) {
				envDebug('positive match for environment %s on %s: %s', userEnvironment.name, patternID, matchPositive);
			}

			if (matchNegative.length > 0) {
				envDebug('negative match for environment %s on %s: %s', userEnvironment.name, patternID, matchNegative);
			}

			return matchPositive.length > 0 && matchNegative.length === 0;
		})
		// sort by priority
		.sort((a, b) => b.priority - a.priority);

	return matchingEnvironments;
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
	const staticCacheRoot = resolve(process.cwd(), '.cache');
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

	envDebug('found environment files at %s', userEnvironmentPaths);

	// Load environments
	const userEnvironmentFiles = await Promise.all(
		userEnvironmentPaths.map(envFilePath => {
			envDebug('reading env file %s', envFilePath);
			const content = readFile(envFilePath);
			envDebug('%s %s', envFilePath, content);
			return content;
		})
	);

	const defaultEnvironment = {
		name: 'index',
		version: '0.1.0',
		applyTo: ['**/*'],
		include: ['**/*'],
		excludes: [],
		priority: 0,
		environment: {}
	};

	// Parse environment file contents
	const userEnvironments = userEnvironmentFiles
		.map(userEnvironmentFile => {
			const raw = JSON.parse(userEnvironmentFile.toString('utf-8'));
			return merge({}, defaultEnvironment, raw);
		});

	envDebug('read environment data');
	envDebug(userEnvironments);

	// read and transform patterns at a concurrency of 5
	return await* patternIDs.map(throat(5, async patternID => {
		// try to use the static cache
		const cached = cache.config.static ?
			await getStaticCacheItem(patternID, staticCacheRoot, cache) :
			null;

		if (cached) {
			return cached;
		}

		// get environments that match this pattern
		const matchingEnvironments = getMatchingEnvironments(patternID, userEnvironments);

		// get the available environment names for this pattern
		const environmentNames = matchingEnvironments.map(env => env.name);

		if (environmentNames.length > 0) {
			log.debug(`Applying environments ${chalk.bold(environmentNames.join(', '))} to ${chalk.bold(patternID)}`);
		}

		// merge environment configs
		// fall back to default environment if none is matching
		const environmentsConfig = matchingEnvironments
			.reduce((results, environmentConfig) => {
				const {environment} = environmentConfig;
				const misplacedKeys = omit(environment, Object.keys(config));
				const misplacedKeyNames = Object.keys(misplacedKeys);

				if (misplacedKeys) {
					log.warn(`${chalk.yellow('[⚠ Deprecation ⚠ ]')} Found unexpected keys ${misplacedKeyNames} in environment ${environmentConfig.name}.environment. Placing keys other than ${Object.keys(config)} in ${environmentConfig.name}.environment is deprecated, move the keys to ${environmentConfig.name}.environment.transforms`);
				}

				// directly stuff mismatching keys into transforms config to retain previous behaviour
				return omit(merge({}, results, omit(environment, misplacedKeyNames), { transforms: misplacedKeys }),
					Object.keys(misplacedKeys).concat(Object.keys(defaultEnvironment)));
			}, defaultEnvironment);

		envDebug('applying env config to pattern %s', patternID);
		envDebug('%s', inspect(environmentsConfig, { depth: null }));

		// merge the determined environments config onto the pattern config
		const patternConfiguration = merge({}, config, environmentsConfig, {
			environments: environmentNames
		});

		const initStart = new Date();
		const filterString = JSON.stringify(filters);
		log.info(`Initializing pattern "${patternID}" with filters: ${chalk.grey('[' + filterString + ']')}`);
		const pattern = await factory(patternID, base, patternConfiguration, transforms, filters);
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
