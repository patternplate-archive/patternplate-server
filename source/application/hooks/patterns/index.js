import {merge} from 'lodash';
import patternFactory, {Pattern} from './pattern';

export default {
	wait: true,
	after: ['hooks:cache:start:after'],
	async start(application) {
		const config = application.configuration.patterns || {};
		application.pattern = {
			factory(...args) {
				return patternFactory(...[...args, application.cache]);
			},
			class: Pattern
		};

		// Normalize patterns.formats[ext]
		config.formats = normalizeFormats(config.formats);
		return this;
	}
};

function normalizeFormats(formats = {}) {
	return Object.entries(formats)
		.reduce((formats, entry) => {
			const [extname, format] = entry;
			const defaults = {
				name: extname,
				build: false,
				importStatement: i => `import ${i}`,
				transforms: []
			};
			formats[extname] = merge(defaults, {
				build: format.build,
				name: format.name,
				importStatement: format.importStatement,
				transforms: format.transforms
			});
			return formats;
		}, {});
}
