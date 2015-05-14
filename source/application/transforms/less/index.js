import less from 'less';

function replaceImports (file, deps = {}) {
	var transformed = file.source.toString('utf-8');
	file.dependencies = Object.assign({}, file.dependencies, deps);

	for (let dependencyName of Object.keys(file.dependencies)) {
		let search = new RegExp(`@import(.*)'${dependencyName}';`);
		let dependency = file.dependencies[dependencyName];

		if (dependency) {
			transformed = transformed.replace(search, dependency.source.toString('utf-8'));
		}
	}

	file.source = new Buffer(transformed, 'utf-8');
	return transformed;
}

async function render (source, config) {
	try {
		return await less.render(source, config);
	} catch (lessError) {
		throw lessError;
	}
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

		var results = {};
		var demoResults = {};

		try {
			results = await render(source, fileConfig);
		} catch (err) {
			throw err;
		}

		if (demo) {
			let demoSource = replaceImports(demo, {'Pattern': file});
			let demoConfig = Object.assign({}, configuration);

			try {
				demoResults = await render(demoSource, demoConfig);
			} catch (err) {
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
