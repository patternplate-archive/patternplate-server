import requireAll from 'require-all';
import {resolve} from 'path';

import patternCache from './pattern-cache';
import patternFactory from './pattern';
import {Pattern} from './pattern';

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

		application.cache = patternCache(this.configuration.cache);
		return this;
	}
};
