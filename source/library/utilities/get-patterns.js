import {resolve, dirname, basename} from 'path';
import fs from 'q-io/fs';
import throat from 'throat';
import getPatternManifests from './get-pattern-manifests';
import chalk from 'chalk';

const defaults = {
	isEnvironment: false,
	filters: {},
	log: function() {}
};

async function getDependentPatterns(id, base) {
	const manifests = await getPatternManifests(base);
	// Resolve dependent patterns
	return manifests.reduce((results, manifest) => { // eslint-disable-line no-loop-func
		const isDependency = Object.values(manifest.patterns || {}).indexOf(id) > -1;
		return isDependency ? {...results, [manifest.id]: manifest} : results;
	}, {});
}

async function getStaticCached(patternID, cache, log) {
	if (cache && cache.config.static && cache.staticRoot) {
		if (await fs.exists(cache.staticRoot)) {
			const cachedPatternPath = resolve(cache.staticRoot, patternID, 'build.json');
			log.debug(`Searching ${patternID} static cache at ${cachedPatternPath}`);

			if (await fs.exists(cachedPatternPath)) {
				try {
					log.debug(`Static cache hit for ${patternID} at ${cachedPatternPath}. Profit!`);
					return JSON.parse(await fs.read(cachedPatternPath));
				} catch (err) {
					log.debug(`Error reading static cache version of ${patternID} at ${cachedPatternPath}`, err);
				}
			}
			log.debug(`Static cache miss for ${patternID} at ${cachedPatternPath}, falling back to dynamic version`);
		}
	}
}

async function getPatterns(options, cache = null) {
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
	config.log = log;

	// No patterns to find here
	if (!await fs.exists(path)) {
		return null;
	}

	const search = await fs.exists(resolve(path, 'pattern.json')) ? resolve(path, 'pattern.json') : path;

	// Get all pattern ids
	const paths = await fs.listTree(search);
	const patternIDs = paths
		.filter((item) => basename(item) === 'pattern.json')
		.filter((item) => isEnvironment ? true : !item.includes('@environments'))
		.map((item) => dirname(item))
		.map((item) => fs.relativeFromDirectory(options.base, item));

	// read and transform patterns at a concurrency of 5
	return await* patternIDs.map(throat(5, async patternID => {
		const cached = await getStaticCached(patternID, cache, log);

		if (cached) {
			return cached;
		}

		const initStart = new Date();
		const filterString = JSON.stringify(filters);
		log.info(`Initializing pattern "${patternID}" with filters: ${chalk.grey('[' + filterString + ']')}`);
		const pattern = await factory(patternID, base, config, transforms, filters);
		log.info(`Initialized pattern "${patternID}" ${chalk.grey('[' + (new Date() - initStart) + 'ms]')}`);

		pattern.manifest.dependentPatterns = await getDependentPatterns(patternID, base);

		const readStart = new Date();
		log.info(`Reading pattern "${patternID}"`);
		await pattern.read();
		log.info(`Read pattern "${patternID}" ${chalk.grey('[' + (new Date() - readStart) + 'ms]')}`);

		const transformStart = new Date();
		log.info(`Transforming pattern "${patternID}"`);
		const transformed = await pattern.transform(!isEnvironment, isEnvironment);
		log.info(`Transformed pattern "${patternID}" ${chalk.grey('[' + (new Date() - transformStart) + 'ms]')}`);
		return typeof transformed.toJSON === 'function' ? transformed.toJSON() : transformed;
	}));
}

export default getPatterns;
