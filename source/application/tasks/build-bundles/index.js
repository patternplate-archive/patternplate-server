import path from 'path';
import {debuglog} from 'util';

import boxen from 'boxen';
import {merge, uniq} from 'lodash';
import minimatch from 'minimatch';
import ora from 'ora';
import throat from 'throat';

import getEnvironments from '../../../library/utilities/get-environments';
import getPatternMtimes from '../../../library/utilities/get-pattern-mtimes';
import getPatterns from '../../../library/utilities/get-patterns';
import git from '../../../library/utilities/git';
import writeSafe from '../../../library/filesystem/write-safe';

export default async (application, settings) => {
	const debug = debuglog('bundles');
	const spinner = ora().start();

	debug('calling bundles with');
	debug(settings);

	application.configuration = merge(
		{},
		application.configuration,
		application.configuration.build.bundles
	);

	const cwd = application.runtime.patterncwd || application.runtime.cwd;
	const pkg = require(path.resolve(cwd, 'package.json'));
	const revision = await git.short();
	const version = pkg.version;
	const environment = application.runtime.env;
	const patternHook = application.hooks.filter(hook => hook.name === 'patterns')[0];
	const base = path.resolve(cwd, patternHook.configuration.path);
	const buildBase = path.resolve(
		cwd,
		application.configuration.build.bundles.target,
		`build-v${version}-${environment}-${revision}`
	);

	const {
		cache, log, transforms,
		pattern: {factory}
	} = application;

	// Get applicable filters
	const {filters: confFilters} = application.configuration;

	// Reconfigure the cache
	application.cache.config = merge({},
		application.cache.config,
		application.configuration.patterns.cache
	);

	// Update formats to the current buildFormats (this is required to e.g. reduce transformers for build)
	for (const name of Object.keys(application.configuration.build.bundles.patterns.formats || {})) {
		const present = application.configuration.patterns.formats[name] || {};
		const override = application.configuration.build.bundles.patterns.formats[name] || {};
		present.transforms = override.transforms ? override.transforms : present.transforms;
	}

	const warnings = [];
	const warn = application.log.warn;
	application.log.warn = (...args) => {
		if (args.some(arg => arg.includes('Deprecation'))) {
			warnings.push(args);
			return;
		}
		warn(...args);
	};

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
		.map(throat(1, async environment => {
			const {environment: envConfig, include, exclude, formats: envFormats} = environment;
			const includePatterns = include || [];
			const excludePatterns = exclude || ['@'];

			// Get patterns matching the include config
			const includedPatterns = availablePatterns.filter(available => {
				const {id} = available;
				return includePatterns.some(pattern => minimatch(id, pattern)) &&
					!excludePatterns.concat('@environments/**/*').some(pattern => minimatch(id, pattern));
			});

			spinner.text = `${environment.name} 0/${includedPatterns.length}`;

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

			const filters = merge({}, confFilters, {inFormats: envFormats, environments: [environment.name]});
			let read = 0;

			// build all patterns matching the include config
			const readPatterns = await Promise.all(includedPatterns
				.map(throat(5, async pattern => {
					const {id} = pattern;

					const [result] = await getPatterns({
						id,
						base,
						config,
						factory,
						transforms,
						log,
						filters,
						environment
					}, cache, ['read']);

					read += 1;
					spinner.text = `reading ${environment.name} ${read}/${includedPatterns.length}`;
					return result;
				})));

			spinner.text = `transforming ${environment.name}`;

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
			const env = {name: environment.name, version: environment.version};
			bundlePattern.inject(env, readPatterns);

			// build the bundle
			const builtBundle = await bundlePattern.transform();

			// write the bundle
			const writing = Object.entries(builtBundle.results)
				.map(async entry => {
					const [resultName, result] = entry;
					const resultPath = path.resolve(
						buildBase,
						resultName.toLowerCase(),
						`${environment.name}.${result.out}`
					);
					const relativePath = path.relative(process.cwd(), resultPath);
					spinner.text = `${environment.name}.${result.in} => ${relativePath}`;
					const written = await writeSafe(resultPath, result.buffer);
					spinner.succeed();
					return written;
				});

			await Promise.all(writing);
		}
	)));
	spinner.stop();

	const messages = uniq(warnings)
		.map(warning => warning.join(' '));

	messages.forEach(message => {
		console.log(boxen(message, {borderColor: 'yellow', padding: 1}));
	});
};
