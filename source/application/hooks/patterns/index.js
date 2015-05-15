import requireAll from 'require-all';
import {resolve, basename} from 'path';

import fs from 'q-io/fs';

import patternCache from './pattern-cache';
import patternFactory from './pattern';
import {Pattern} from './pattern';

async function populate (cache, root, hook) {
	hook.log.info(`Pattern cache is enabled, populating it from ${root}`);
	let list = await fs.listTree(root, (path) => basename(path) === 'pattern.json');

	for (let manifest of list) {
		let patternID = await fs.relative(root, fs.directory(manifest));
		let pattern = new Pattern(patternID, root, {}, {}, cache);
		try {
			await pattern.read();
		} catch (err) {
			hook.log.warn(`Error while populating cache for ${patternID}`);
			hook.log.error(err.stack);
		}
	}

	hook.log.info(`Populated pattern cache from ${root}. Size ${Math.round(cache.length / 1024)} MB at ${cache.itemCount} items.`);
}

export default {
	'wait': true,
	'after': ['hooks:log:start:after'],
	'start': async function startPatternHook (application) {

		if (this.configuration.cache) {
			application.patternCache = patternCache();
			let patternCwd = application.runtime.patterncwd || application.runtime.cwd;
			let patternRoot = resolve(patternCwd, this.configuration.path);

			populate(application.patternCache, patternRoot, this);
		}

		application.pattern = {
			'factory': (...args) => {
				return patternFactory(...[...args, application.patternCache]);
			},
			'class': Pattern
		};

		let transformFactories = requireAll({
			'dirname': resolve(application.runtime.cwd, this.configuration.transformPath),
			'filter': /^(.*)\.(js|json)/
		});

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

		return this;
	}
};
