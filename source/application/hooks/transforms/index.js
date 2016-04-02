import hotswap from 'hotswap';
import {resolve} from 'path';
import {find, omit} from 'lodash';
import {resolve as resolvePackage} from 'try-require';

import {deprecation, ok, wait} from '../../../library/log/decorations';

function loadTransform(name, path) {
	const available = resolvePackage(path);

	if (!available) {
		return null;
	}

	try {
		const fn = require(path);
		return {
			fn: fn.default ? fn.default : fn,
			path: available,
			name
		};
	} catch (error) {
		error.message = [
			`Error while loading transform ${path}:`,
			error.message
		].join('\n');
		throw error;
	}
}

function loadTansformFactories(transformNames, paths, application) {
	return transformNames
		.reduce((registry, transformName) => {
			application.log.debug(wait`Looking up transform ${transformName}`);
			// resolve from project or core
			// project transforms take precedence
			const localTransformPaths = paths
				.map(path => resolve(path, transformName, 'index.js'));

			const localTransformFactory = localTransformPaths
				.map(localPath => loadTransform(transformName, localPath))
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
			const packageTransformFactory = loadTransform(transformName, pkg);

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

function flattenChildren(root) {
	return root.children.reduce((registry, child) => {
		return [
			...registry,
			child,
			...flattenChildren(child)
		];
	}, []);
}

export default {
	wait: true,
	after: ['hooks:log:start:afer'],
	factories: [],
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
		const transformFactories = loadTansformFactories(
			transformNames, resolved, application
		);

		const pool = getModulePool(module);

		// save resolved paths for hot swapping
		this.factories = Object.entries(transformFactories)
			.reduce((registry, entry) => {
				const [, {name, path}] = entry;
				const module = find(pool, {id: path}) || {children: []};
				const children = flattenChildren(module).map(child => {
					return {name, id: path, path: child.id};
				});
				return [
					...registry,
					{name, id: path, path},
					...children
				];
			}, []);

		// attach transform registry to application object for usage
		application.transforms = Object.entries(transformFactories)
			.reduce((registry, entry) => {
				const [name, factory] = entry;
				return {
					...registry,
					[name]: factory.fn(application)
				};
			}, {});

		hotswap.on('swap', path => {
			application.log.debug(`Received swap for ${path}...`);
			const swapped = find(this.factories, {path});
			if (swapped) {
				const {name, id} = swapped;
				application.log.info(`Hot-swapping transform ${name}...`);
				application.transforms[name] = require(id)(application);
				application.log.info(`Hot-swapped transform ${name}.`);
			}
		});

		hotswap.on('error', error => {
			application.log.info(`Error while hot-swapping:`);
			application.log.error(error);
		});

		return this;
	}
};
