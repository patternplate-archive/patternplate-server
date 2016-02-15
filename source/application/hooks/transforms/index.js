import {
	resolve
} from 'path';

import {
	omit
} from 'lodash';

import {
	deprecation,
	ok,
	wait
} from '../../../library/log/decorations';

function loadTransform(path) {
	try {
		return require(path);
	} catch (error) {
		return null;
	}
}

export default {
	wait: true,
	after: ['hooks:log:start:afer'],
	async start(application) {
		// side track the pattern configuration to be free of breaking changes,
		// deprecate the use of the config anyhow
		if (application.configuration.patterns.transformPath) {
			application.log.warn(deprecation`patternplate-server.configuration.patterns.transformPath is deprecated. Use patternplate-server.configuration.transforms.path instead`);
		}

		const transformPath = application.configuration.patterns.transformPath || this.configuration.path;
		const transformPaths = Array.isArray(transformPath) ?
			transformPath :
			[transformPath];

		const resolved = transformPaths
			.reduce((items, item) => {
				return [
					...items,
					...application.runtime.cwds.map(cwd => resolve(cwd, item))
				];
			}, []);

		const transformNames = Object.keys(omit(this.configuration, ['path', 'options']));

		// load all transforms factories
		const transformFactories = transformNames
			.reduce((registry, transformName) => {
				application.log.debug(wait`Looking up transform ${transformName}`);
				// resolve from project or core
				// project transforms take precedence
				const localTransformPaths = resolved
					.map(path => resolve(path, transformName, 'index.js'));

				const localTransformFactory = localTransformPaths
					.map(loadTransform)
					.filter(Boolean)[0];

				if (localTransformFactory) {
					application.log.debug(ok`Loaded local transform ${transformName}`);
					return {
						...registry,
						[transformName]: localTransformFactory
					};
				}

				// try to load from patternplate-transform-${transformName}
				// if no local transform was found
				const pkg = `patternplate-transform-${transformName}`;
				const packageTransformFactory = loadTransform(`patternplate-transform-${transformName}`);

				if (!packageTransformFactory) {
					throw new Error(
						`Could not load transform ${transformName}, tried: ${localTransformPaths}, ${pkg} npm`
					);
				}

				application.log.debug(ok`Loaded package transform ${transformName}`);

				return {
					...registry,
					[transformName]: packageTransformFactory
				};
			}, {});

		// attach transform registry to application object for usage
		application.transforms = Object.entries(transformFactories)
			.reduce((registry, entry) => {
				const [name, factory] = entry;
				return {
					...registry,
					[name]: factory(application)
				};
			}, {});

		return this;
	}
};
