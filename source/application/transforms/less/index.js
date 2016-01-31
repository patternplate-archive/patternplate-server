import {resolve} from 'path';

import less from 'less';
import PatternImporterPlugin from 'less-plugin-pattern-import';
import NPMImporterPlugin from 'less-plugin-npm-import';


async function render (source, config) {
	return await less.render(source, config);
}

export default function lessTransformFactory (application) {
	// TODO: this is currently to permissive,
	// forbid transitive access in the future
	function getDependencies(file) {
		return Object.entries(file.dependencies)
			.reduce((paths, entry) => {
				const [dependencyName, dependencyFile] = entry;
				return {
					...paths,
					...getDependencies(dependencyFile),
					[dependencyName]: dependencyFile.path
				};
			}, {});
	}

	return async function lessTransform (file, demo, configuration) {
		const config = Object.assign({}, configuration);
		const patternPath = resolve(application.runtime.patterncwd || application.runtime.cwd, application.configuration.patterns.path);
		const dependencies = getDependencies(file);

		const plugins = Object.keys(config.plugins)
			.map((pluginName) => config.plugins[pluginName].enabled ? pluginName : false)
			.filter((item) => item);

		const pluginConfigs = plugins.reduce(function getPluginConfig (pluginResults, pluginName) {
			pluginResults[pluginName] = config.plugins[pluginName].opts || {};
			return pluginResults;
		}, {});

		config.opts.plugins = Array.isArray(config.opts.plugins) ? config.opts.plugins : [];
		config.opts.plugins = config.opts.plugins.concat(
			[
				new NPMImporterPlugin(),
				new PatternImporterPlugin({'root': patternPath, 'patterns': dependencies})
			]);

		for (const pluginName of plugins) {
			const pluginConfig = pluginConfigs[pluginName];

			if (pluginConfig) {
				const Plugin = require(`less-plugin-${pluginName}`);
				config.opts.plugins.push(new Plugin(pluginConfig));
			}
		}

		const source = file.buffer.toString('utf-8');
		const results = await render(source, config.opts);
		file.buffer = results.css;
		return file;
	};
}
