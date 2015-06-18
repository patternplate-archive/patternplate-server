import {resolve} from 'path';

import less from 'less';

import PatternImporterPlugin from 'less-plugin-pattern-import';
import NPMImporterPlugin from 'less-plugin-npm-import';

async function render (source, config) {
	try {
		return await less.render(source, config);
	} catch (lessError) {
		throw lessError;
	}
}

export default function lessTransformFactory (application) {
	return async function lessTransform (file, demo, configuration, forced = false) {
		const patternPath = resolve(application.runtime.patterncwd || application.runtime.cwd, application.configuration.patterns.path);
		const dependencies = Object.keys(file.dependencies || {}).reduce(function getDependencyPaths (paths, dependencyName) {
			paths[dependencyName] = file.dependencies[dependencyName].path;
			return paths;
		}, {});

		const plugins = Object.keys(configuration.plugins)
			.map((pluginName) => configuration.plugins[pluginName].enabled ? pluginName : false)
			.filter((item) => item);

		const pluginConfigs = plugins.reduce(function getPluginConfig (pluginResults, pluginName) {
			pluginResults[pluginName] = configuration.plugins[pluginName].opts || {};
			return pluginResults;
		}, {});

		configuration.plugins = Array.isArray(configuration.plugins) ? configuration.plugins : [];
		configuration.plugins = configuration.plugins.concat(
			[
				new NPMImporterPlugin(),
				new PatternImporterPlugin({'root': patternPath, 'patterns': dependencies})
			]);

		for (let pluginName of plugins) {
			let pluginConfig = pluginConfigs[pluginName];

			if (pluginConfig) {
				let Plugin = require(`less-plugin-${pluginName}`);
				configuration.plugins.push(new Plugin(pluginConfig));
			}
		}

		let source = file.buffer.toString('utf-8');
		var results = {};
		var demoResults = {};

		if (forced) {
			let injects = Object.keys(dependencies).map((dependency) => `@import '${dependency}';`);
			source = `${injects.join('\n')}\n${source}`;
		}

		try {
			results = await render(source, configuration);
		} catch (err) {
			throw err;
		}

		if (demo) {
			let demoSource = demo.buffer.toString('utf-8');
			let demoConfig = Object.assign({}, configuration);
			let demoDepdendencies = Object.assign({}, dependencies, {'Pattern': file.path});

			try {
				demoConfig.plugins.push(new PatternImporterPlugin({'root': patternPath, 'patterns': demoDepdendencies}));
				demoResults = await render(demoSource, demoConfig);
			} catch (err) {
				err.file = demo.path;
				throw err;
			}

			file.demoBuffer = new Buffer(demoResults.css || '', 'utf-8');
			file.demoSource = demo.source;
		}

		file.buffer = new Buffer(results.css || '', 'utf-8');

		file.in = configuration.inFormat;
		file.out = configuration.outFormat;

		return file;
	};
}
