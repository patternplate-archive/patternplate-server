import less from 'less';
import {directory} from 'q-io/fs';

function replaceImports (file, deps = {}) {
	var transformed = file.source.toString('utf-8');
	file.dependencies = Object.assign({}, file.dependencies, deps);

	for (let dependencyName of Object.keys(file.dependencies)) {
		let dependency = file.dependencies[dependencyName];
		let search = new RegExp(`@import(.*)'${dependencyName}';`);
		transformed = transformed.replace(search, dependency.source.toString('utf-8'));
	}

	file.source = new Buffer(transformed, 'utf-8');
	return transformed;
}

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
		'paths': ['node_modules']
	};

	for (let pluginName of plugins) {
		let Plugin = require(`less-plugin-${pluginName}`);

		configuration.plugins.push(new Plugin(pluginConfigs[pluginName]));
	}

	return async function lessTransform (file, demo) {
		let source = replaceImports(file);
		let fileConfig = Object.assign({}, configuration);
		fileConfig.paths.push(directory(file.path));

		try {
			let results = await less.render(source, fileConfig);
			file.buffer = new Buffer(results.css, 'utf-8');
		} catch (err) {
			application.log.error(err);
			throw new Error(err);
		}

		if (demo) {
			try {
				let demoSource = replaceImports(demo, {'Pattern': file});
				let demoConfig = Object.assign({}, configuration);
				demoConfig.paths.push(directory(file.path));

				let demoResults = await less.render(demoSource, demoConfig);

				file.demoSource = demo.source;
				file.demoBuffer = new Buffer(demoResults.css, 'utf-8');
			} catch (err) {
				application.log.error(err);
				throw err;
			}
		}

		file.in = config.inFormat;
		file.out = config.outFormat;

		return file;
	};
}
