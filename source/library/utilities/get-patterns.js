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
	omit,
	pick
} from 'lodash';
import throat from 'throat';

import getEnvironments, {defaultEnvironment} from './get-environments';
import getDependentPatterns from './get-dependent-patterns';
import getStaticCacheItem from './get-static-cache-item.js';
import getMatchingEnvironments from './get-matching-environments';

const envDebug = debuglog('environments');

const defaults = {
	isEnvironment: false,
	filters: {},
	log() {}
};

async function getPatterns(options, cache, cmds = ['read', 'transform']) {
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

	// read and transform patterns at a concurrency of 5
	return await Promise.all(patternIDs.map(throat(5, async patternID => {
		// try to use the static cache
		const cached = cache && cache.config.static ?
			await getStaticCacheItem({
				id: patternID,
				base: staticCacheRoot,
				filters,
				cache
			}) :
			null;

		if (cached) {
			return cached;
		}

		// load user environments
		const userEnvironments = await getEnvironments(base, {
			cache,
			log
		});

		const free = typeof filters.environments === 'undefined' ||
			filters.environments.length === 0;

		// get environments that match this pattern
		const matchingEnvironments = free ?
			getMatchingEnvironments(patternID, userEnvironments) :
			userEnvironments.filter(({name}) => filters.environments.includes(name));

		// get the available environment names for this pattern
		const environmentNames = matchingEnvironments
			.map(env => env.name);

		if (environmentNames.length > 0) {
			log.debug(`Applying environments ${chalk.bold(environmentNames.join(', '))} to ${chalk.bold(patternID)}`);
		}

		// merge environment configs
		// fall back to default environment if none is matching
		// TODO: should move to getEnvironments
		const environmentsConfig = matchingEnvironments
			.reduce((results, environmentConfig) => {
				const {environment} = environmentConfig;
				const misplacedKeys = omit(environment, Object.keys(config));
				const misplacedKeyNames = Object.keys(misplacedKeys);

				if (misplacedKeys.length > 0) {
					log.warn([
						`${chalk.yellow('[⚠ Deprecation ⚠ ]')} Found unexpected keys ${misplacedKeyNames} in environment`,
						`${environmentConfig.name}.environment. Placing keys other than ${Object.keys(config)} in`,
						`${environmentConfig.name}.environment is deprecated, move the keys to`,
						`${environmentConfig.name}.environment.transforms`
					].join(' '));
				}

				// directly stuff mismatching keys into transforms config to retain previous behaviour
				return omit(merge({}, results, omit(environment, misplacedKeyNames), {transforms: misplacedKeys}),
					Object.keys(misplacedKeys).concat(Object.keys(defaultEnvironment)));
			}, defaultEnvironment);

		envDebug('applying env config to pattern %s', patternID);
		envDebug('%s', inspect(environmentsConfig, {depth: null}));

		// merge the determined environments config onto the pattern config
		const patternConfiguration = merge({}, config, environmentsConfig, {
			environments: environmentNames
		});

		// Initialize the pattern object
		const initStart = new Date();
		const filterString = JSON.stringify(filters);
		log.info(`Initializing pattern "${patternID}" with filters: ${chalk.grey('[' + filterString + ']')}`);
		const pattern = await factory(patternID, base, patternConfiguration, transforms, filters);
		log.info(`Initialized pattern "${patternID}" ${chalk.grey('[' + (new Date() - initStart) + 'ms]')}`);

		// Inject information about available environments
		const availableEnvironments = userEnvironments.map(env => pick(env, ['name', 'displayName']));
		const demoEnvironments = userEnvironments.filter(env => env.display).map(env => pick(env, ['name', 'displayName']));

		pattern.manifest.availableEnvironments = availableEnvironments;
		pattern.manifest.demoEnvironments = demoEnvironments;

		// Determine dependening patterns
		const gettingDepending = await getDependentPatterns(patternID, base, {cache});

		// Exit if we do not have to read
		if (!cmds.includes('read')) {
			// Inject depending pattern information
			pattern.manifest.dependentPatterns = await gettingDepending;
			return pattern;
		}

		// Read the pattern files
		const readStart = new Date();
		log.info(`Reading pattern "${patternID}"`);
		await pattern.read();

		// Inject depending pattern information
		pattern.manifest.dependentPatterns = await gettingDepending;
		log.info(`Read pattern "${patternID}" ${chalk.grey('[' + (new Date() - readStart) + 'ms]')}`);

		// Exit if we do not have to transform
		if (!cmds.includes('transform')) {
			return pattern;
		}

		// Transform pattern sources
		const transformStart = new Date();
		log.info(`Transforming pattern "${patternID}"`);
		const transformed = await pattern.transform(!isEnvironment, isEnvironment);
		log.info(`Transformed pattern "${patternID}" ${chalk.grey('[' + (new Date() - transformStart) + 'ms]')}`);
		return transformed;
	})));
}

export default getPatterns;
