import {resolve} from 'path';

import less from 'less';
import {directory} from 'q-io/fs';

export default function lessTransformFactory (application) {
	const config = application.configuration.transforms.less || {};
	const plugins = Object.keys(config.plugins)
		.map((pluginName) => config.plugins[pluginName].enabled ? pluginName : false)
		.filter((item) => item);

	const pluginConfigs = plugins.reduce(function getPluginConfig (results, pluginName) {
		results[pluginName] = config.plugins[pluginName].opts || {};
		return results;
	}, {});

	let configuration = {
		'plugins': [],
		'paths': [resolve(application.runtime.cwd, 'node_modules')]
	};

	for (let pluginName of plugins) {
		let Plugin = require(`less-plugin-${pluginName}`);

		configuration.plugins.push(new Plugin(pluginConfigs[pluginName]));
	}

	return async function lessTransform (file, dependencies, demo) {
		var source = file.buffer.toString('utf-8');
		configuration.paths.push(directory(file.path));

		for (let dependencyName of Object.keys(dependencies)) {
			let dependency = dependencies[dependencyName];
			let search = new RegExp(`@import(.*)'${dependencyName}';`);
			source = source.replace(search, `@import '${dependency.path}';`);
		}

		if (demo) {
			let demoSource = demo.buffer.toString('utf-8');
			source = [source, demoSource].join(`\n`);
		}

		var results = {'css': ''};

		try {
			results = await less.render(source, configuration);
		} catch (err) {
			application.log.error(err);
			throw new Error(err);
		}

		file.buffer = new Buffer(results.css, 'utf-8');
		file.in = config.inFormat;
		file.out = config.outFormat;
		
		return file;
	};
}
