import {
	join,
	resolve as pathResolve
} from 'path';

import chalk from 'chalk';
import ensureArray from 'ensure-array';
import hotswap from 'hotswap';
import _, {find, partial, omit, throttle} from 'lodash';
import nodeResolve from 'resolve';

import {deprecation, ok, wait} from '../../../library/log/decorations';

function resolve(input) {
	return new Promise(resolver => {
		nodeResolve(input, {
			basedir: process.cwd()
		}, (err, result) => {
			if (err) {
				resolver(null);
			}
			resolver(result);
		});
	});
}

function flattenChildren(root) {
	return root.children.reduce((registry, child) => {
		return [
			...registry,
			child.id,
			...flattenChildren(child)
		];
	}, []);
}

function getModulePool(root) {
	return root.children.reduce((registry, child) => {
		return [
			...registry,
			{
				id: child.id,
				children: getModulePool(child)
			}
		];
	}, []);
}

async function resolveTransform(name, search = []) {
	// Search given local paths
	const locals = await Promise.all(
		search
			.map(async path => resolve(join(path, name)))
	);

	const resolved =
		// load from local file
		locals.filter(Boolean)[0] ||
		// load from npm
		await resolve(`patternplate-transform-${name}`);

	// yeay!
	if (resolved) {
		return {
			name,
			resolved
		};
	}

	// Throw if we could not load locally or from npm
	throw new Error([
		`Could not load transform "${name}". Tried loading locally from:`,
		`${search.join(', ')}.`,
		`Tried loading from npm: patternplate-transform-${name}`
	].join(' '));
}

const transformPathDeprecation = [
	'patternplate-server.configuration.patterns.transformPath is deprecated.',
	'Use patternplate-server.configuration.transforms.path instead'
].join(' ');

export default {
	wait: true,
	after: ['hooks:log:start:afer'],

	async start(application) {
		const {
			configuration: config,
			configuration: {
				path: basePath
			}
		} = this;

		const {
			configuration: {
				patterns: {transformPath}
			}
		} = application;

		// side track the pattern configuration to be free of breaking changes,
		// deprecate the use of the config anyhow
		if (transformPath) {
			application.log.warn(deprecation`${transformPathDeprecation}`);
		}

		// Get places to load transforms from
		const transformPaths = ensureArray(transformPath || basePath)
			.map(path => pathResolve(process.cwd(), path));

		// Get configured transforms
		const names = Object.keys(omit(config, ['path', 'options']));

		// load factories
		// - from transformPaths
		// - from node_modules
		const resolve = partial(resolveTransform, _, transformPaths);
		const factories = await Promise.all(names.map(async name => {
			const resolved = await resolve(name);
			application.log.silly(ok`Resolved transform "${name}"`);
			resolved.factory = require(resolved.resolved);
			application.log.silly(ok`Loaded transform "${name}"`);
			return resolved;
		}));

		// initialize transform factories
		application.transforms = factories.reduce((registry, {name, resolved, factory}) => {
			application.log.silly(ok`Initializing transform "${name}" from ${resolved}`);
			const transform = factory(application);
			application.log.debug(ok`Initialized transform "${name}"`);

			return {
				...registry,
				[name]: transform
			};
		}, {});

		const ids = factories.map(({resolved}) => resolved);

		if (application.runtime.env === 'development') {
			application.log.debug(wait`Listening for changes to transform code...`);

			hotswap.on('swap', throttle(path => {
				// Get transforms affected by change
				getModulePool(module)
					// Filter top level modules matching loaded transforms
					.filter(({id}) => ids.includes(id))
					// Filter for modules matching the changed path
					.filter(mod => {
						const moduleIds = [mod.id, ...flattenChildren(mod)];
						return moduleIds.includes(path);
					})
					// Get transform factory for module with changes
					.map(({id}) => find(factories, ({resolved}) => resolved === id))
					// Reload affected transforms
					.forEach(({name, resolved}) => {
						application.log.debug(wait`Reloading transform "${name}"... ${chalk.grey(`(${path})`)}`);
						application.transforms[name] = require(resolved)(application);
						application.log.debug(ok`Reloaded transform "${name}"`);
					});
			}, 2500, {trailing: false}));

			hotswap.on('error', error => {
				application.log.info(`Error while hot-swapping:`);
				application.log.error(error);
			});
		}

		return this;
	}
};
