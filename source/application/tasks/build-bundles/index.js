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
import writeSafe from '../../../library/filesystem/write-safe';
import {loadTransforms} from '../../../library/transforms';

/*
import {resolve} from 'path';

import exists from 'path-exists';

import copyDirectory from '../../../library/filesystem/copy-directory';
import makeDirectory from '../../../library/filesystem/make-directory';
import {ok, wait, warn} from '../../../library/log/decorations';

export default async application => {
	const cwd = application.runtime.patterncwd || application.runtime.cwd;
	const staticRoot = resolve(cwd, 'static');
	const assetRoot = resolve(cwd, 'assets');

	const buildRoot = resolve(cwd, 'build');
	const buildDirectory = resolve(buildRoot, `build-bundles`);
	const patternBuildDirectory = resolve(buildDirectory, 'patterns');

	if (await exists(staticRoot)) {
		const staticTarget = resolve(patternBuildDirectory, 'static');
		application.log.info(wait`Copying asset files from "${assetRoot}" to ${staticTarget}`);
		await makeDirectory(staticTarget);
		await copyDirectory(staticRoot, staticTarget);
		application.log.info(ok`Copied asset files`);
	} else {
		application.log.warn(warn`No asset files at "${staticRoot}"`);
	}
};
*/

export default async (application, settings) => {
	if (!settings) {
		throw new Error('build-bundles is not configured in .tasks');
	}

	if (!settings.patterns) {
		throw new Error('build-bundles dependens on valid patterns config');
	}

	if (!settings.transforms) {
		throw new Error('build-bundles dependens on valid transfoms config');
	}

	const debug = debuglog('bundles');
	const spinner = ora().start();

	debug('calling bundles with');
	debug(settings);

	const cwd = process.cwd();
	const base = path.resolve(cwd, 'patterns');
	const buildBase = path.resolve(cwd, 'build', `build-bundles`);

	const {
		cache, log, transforms,
		pattern: {factory}
	} = application;

	// Override pattern config
	application.configuration.patterns = settings.patterns;

	// Reinitialize transforms
	application.configuration.transforms = settings.transforms || {};
	application.transforms = (await loadTransforms(settings.transforms || {}))(application);

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
					patterns: settings.patterns,
					transforms: settings.transforms
				},
				envConfig,
				{
					environments: [environment.name]
				}
			);

			const filters = merge({}, settings.filters, {
				inFormats: envFormats,
				environments: [environment.name]
			});
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
