import patternFactory from './pattern';
import {Pattern} from './pattern';

export default {
	wait: true,
	after: ['hooks:cache:start:after'],
	async start(application) {
		application.pattern = {
			factory(...args) {
				return patternFactory(...[...args, application.cache]);
			},
			'class': Pattern
		};

		return this;
	}
};
