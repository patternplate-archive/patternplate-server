import {resolve} from 'path';
import {debuglog} from 'util';

import {merge} from 'lodash';
import minimatch from 'minimatch';
import throat from 'throat';

import getEnvironments from '../../../library/utilities/get-environments';
import getPatternMtimes from '../../../library/utilities/get-pattern-mtimes';
import getPatterns from '../../../library/utilities/get-patterns';
import git from '../../../library/utilities/git';
import writeSafe from '../../../library/filesystem/write-safe';

export default async (application, settings) => {
	const debug = debuglog('bundles');
	debug('calling bundles with');
	debug(settings);

	application.configuration = merge(
		{},
		application.configuration,
		application.configuration.build.bundles
	);

	const cwd = application.runtime.patterncwd || application.runtime.cwd;
	const pkg = require(resolve(cwd, 'package.json'));
	const revision = await git.short();
	const version = pkg.version;
	const environment = application.runtime.env;
	const patternHook = application.hooks.filter(hook => hook.name === 'patterns')[0];
	const base = resolve(cwd, patternHook.configuration.path);
	const buildBase = resolve(
		cwd,
		application.configuration.build.bundles.target,
		`build-v${version}-${environment}-${revision}`
	);

	const {
		cache, log, transforms,
		pattern: {factory}
	} = application;

	// Get applicable filters
	const {filters} = application.configuration;

	// Reconfigure the cache
	application.cache.config = merge({},
		application.cache.config,
		application.configuration.patterns.cache
	);

	// Update formats to the current buildFormats (this is required to e.g. reduce transformers for build)
	for (const name of Object.keys(application.configuration.build.bundles.patterns.formats)) {
		const present = application.configuration.patterns.formats[name] || {};
		const override = application.configuration.build.bundles.patterns.formats[name] || {};
		present.transforms = override.transforms ? override.transforms : present.transforms;
	}

	// Get environments
	const loadedEnvironments = await getEnvironments(base, {
		cache,
		log
	});

	// Environments have to apply on all patterns
	const environments = loadedEnvironments.map(environment => {
		environment.applyTo = '**/*';
		return environment;
	});

	// Get available patterns
	const availablePatterns = await getPatternMtimes(base, {
		resolveDependencies: true
	});

	// For each environment with include key, build a bundle for each format that has the build key on "true"
	await Promise.all(environments
		.filter(environment => environment.include && environment.include.length)
		.map(async environment => {
			const {environment: envConfig, include, exclude, formats: envFormats} = environment;
			const includePatterns = include || [];
			const excludePatterns = exclude || ['@'];

			// Get patterns matching the include config
			const includedPatterns = availablePatterns.filter(available => {
				const {id} = available;
				return includePatterns.some(pattern => minimatch(id, pattern)) &&
					!excludePatterns.concat('@environments/**/*').some(pattern => minimatch(id, pattern));
			});

			// Merge environment config into transform config
			const config = merge(
				{},
				{
					patterns: application.configuration.patterns,
					transforms: application.configuration.transforms
				},
				envConfig,
				{
					environments: [environment.name]
				}
			);

			const environmentFilters = merge({}, filters);
			environmentFilters.inFormats = envFormats;

			// build all patterns matching the include config
			const builtPatterns = await Promise.all(includedPatterns
				.map(throat(5, async pattern => {
					const {id} = pattern;

					const [result] = await getPatterns({
						id,
						base,
						config,
						factory,
						transforms,
						log,
						filters: environmentFilters
					}, cache, ['read']);

					return result;
				})));

			// construct a virtual pattern
			const bundlePattern = await factory(
				environment.name,
				base,
				config,
				transforms,
				filters,
				cache
			);

			// add the built patterns as dependencies
			bundlePattern.inject(
				{
					name: environment.name,
					version: environment.version
				},
				builtPatterns
			);

			// build the bundle
			const builtBundle = await bundlePattern.transform();

			// write the bundle
			const writing = Object.entries(builtBundle.results)
				.map(async entry => {
					const [resultName, result] = entry;
					const resultPath = resolve(
						buildBase,
						resultName.toLowerCase(),
						`${environment.name}.${result.out}`
					);
					return writeSafe(resultPath, result.buffer);
				});

			return await Promise.all(writing);
		}));
};
