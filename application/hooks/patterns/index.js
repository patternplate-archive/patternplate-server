import requireAll from 'require-all';
import {resolve} from 'path';

import patternFactory from './pattern';
import {Pattern} from './pattern';

export default {
	'wait': true,
	'after': ['hooks:log:start:after'],
	'start': async function startPatternHook (application) {
		application.pattern = {'factory': patternFactory, 'class': Pattern};

		let transformFactories = requireAll({
			'dirname': resolve(application.runtime.cwd, this.configuration.transformPath),
			'filter': /^(.*)\.(js|json)/
		});

		application.transforms = Object.keys(transformFactories)
			.reduce(function getTransform (transforms, transformName) {
				if (transformFactories[transformName].index) {
					transforms[transformName] = transformFactories[transformName].index(application);
				}
				return transforms;
			}, {});

		return this;
	}
};
