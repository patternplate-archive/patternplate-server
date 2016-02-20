import cache from './cache';
import {
	deprecation
} from '../../../library/log/decorations';

export default {
	wait: true,
	after: ['hooks:log:start:after'],
	async start(application) {
		// side track the pattern configuration to be free of breaking changes,
		// deprecate the use of the config anyhow
		if (application.configuration.patterns.cache) {
			application.log.warn(deprecation`patternplate-server.configuration.patterns.cache is deprecated. Use patternplate-server.configuration.cache instead`);
		}

		const configuration = application.configuration.patterns.cache || this.configuration;

		application.cache = configuration ?
			cache(configuration) :
			{};

		return this;
	}
};
