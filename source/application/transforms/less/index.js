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
	const patternPath = resolve(application.runtime.patterncwd || application.runtime.cwd, application.configuration.patterns.path);
	const config = application.configuration.transforms.less || {};
	const plugins = Object.keys(config.plugins)
		.map((pluginName) => config.plugins[pluginName].enabled ? pluginName : false)
		.filter((item) => item);

	const pluginConfigs = plugins.reduce(function getPluginConfig (results, pluginName) {
		results[pluginName] = config.plugins[pluginName].opts || {};
		return results;
	}, {});

	let configuration = {
		'plugins': [new NPMImporterPlugin()]
	};

	for (let pluginName of plugins) {
		let pluginConfig = pluginConfigs[pluginName];

		if ( !pluginConfig ) {
			continue;
		}

		let Plugin = require(`less-plugin-${pluginName}`);
		configuration.plugins.push(new Plugin(pluginConfig));
	}


	return async function lessTransform (file, demo, forced = false) {
		let source = file.buffer.toString('utf-8');
		let fileConfig = Object.assign({}, configuration);

		var results = {};
		var demoResults = {};

		let dependencies = Object.keys(file.dependencies || {}).reduce(function getDependencyPaths (paths, dependencyName) {
			paths[dependencyName] = file.dependencies[dependencyName].path;
			return paths;
		}, {});

		if (forced) {
			let injects = Object.keys(dependencies).map((dependency) => `@import '${dependency}';`);
			source = `${injects.join('\n')}\n${source}`;
		}

		try {
			fileConfig.plugins.push(new PatternImporterPlugin({'root': patternPath, 'patterns': dependencies}));
			results = await render(source, fileConfig);
		} catch (err) {
			throw err;
		}

		if (demo) {
			let demoSource = demo.buffer.toString('utf-8');
			let demoConfig = Object.assign({}, fileConfig);
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

		file.in = config.inFormat;
		file.out = config.outFormat;

		return file;
	};
}
