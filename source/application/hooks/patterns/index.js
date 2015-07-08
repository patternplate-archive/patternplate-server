import requireAll from 'require-all';
import {resolve} from 'path';
import qfs from 'q-io/fs';

import cache from './pattern-cache';
import patternFactory from './pattern';
import {Pattern} from './pattern';
import getPatterns from '../../../library/utilities/get-patterns';

async function populate(application) {
	let config = {
		'patterns': application.configuration.patterns,
		'transforms': application.configuration.transforms
	};

	let id = '.';
	let cwd = application.runtime.patterncwd || application.runtime.cwd;

	let base = resolve(cwd, config.patterns.path);
	let factory = application.pattern.factory;
	let transforms = application.transforms;

	application.log.info(`Populating cache from ${base}...`);
	let start = Date.now();

	await getPatterns({
		id, config, base, factory, transforms,
		'log': function(...args) {
			application.log.silly(...['[cache:pattern:getpattern]', ...args]);
		}
	}, application.cache, false);

	let delta = Date.now() - start / 1000;

	application.cache.ready = true;
	application.log.info(`Populated cache from ${base} in ${delta}s`);
}

export default {
	'wait': true,
	'after': ['hooks:log:start:after'],
	'start': async function startPatternHook (application) {
		application.pattern = {
			'factory': (...args) => {
				return patternFactory(...[...args, application.cache]);
			},
			'class': Pattern
		};

		this.configuration.transformPath = Array.isArray(this.configuration.transformPath)
			? this.configuration.transformPath
			: [this.configuration.transformPath];

		// TODO: Fix for mysteriously split last path, investigate
		this.configuration.transformPath = this.configuration.transformPath.filter((item) => item.length > 1);

		let transformPaths = this.configuration.transformPath
			.reduce((items, item) => items.concat(
				application.runtime.cwds.map((cwd) => resolve(cwd, item))
			), []);

		let transformFactories = {};

		for (let transformPath of transformPaths) {
			let resolvedTransformPath = resolve(application.runtime.cwd, transformPath);

			if (await qfs.exists(resolvedTransformPath)) {
				this.log.silly(`Importing transforms from: ${resolvedTransformPath}`);
				let resolvedTransformFactories = requireAll({
					'dirname': resolvedTransformPath,
					'filter': /^(.*)\.(js|json)/
				});

				Object.assign(transformFactories, resolvedTransformFactories);
			}
		}

		application.transforms = Object.keys(transformFactories)
			.reduce(function getTransform (transforms, transformName) {
				if (typeof transformFactories[transformName].index === 'function') {
					application.log.info(`[application:hook:patterns] Loading transform factory "${transformName}"`);
					let fn = transformFactories[transformName].index(application);

					if (typeof fn !== 'function') {
						application.log.info(`[application:hook:patterns] transform factory "${transformName}" did not return a valid transform.`);
						return transforms;
					}

					application.log.info(`[application:hook:patterns] transform "${transformName}" available.`);
					transforms[transformName] = fn;
				}
				return transforms;
			}, {});

		if (this.configuration.cache) {
			application.cache = cache(this.configuration.cache);
			application.cache.ready = !this.configuration.cache.populate;

			application.cache.staticRoot = resolve(application.runtime.patterncwd || application.runtime.cwd, '.cache'); // TODO: Make this configurable

			if (this.configuration.cache.populate) {
				populate(application);
			}
		}

		return this;
	}
};
