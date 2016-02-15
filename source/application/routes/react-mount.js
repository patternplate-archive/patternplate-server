import {
	resolve
} from 'path';

import {merge} from 'lodash';
import getPatterns from '../../library/utilities/get-patterns';

export default function (application) {
	// prewarm browserify with react and react-dom
	const patterns = application.configuration.patterns || {};
	// const transforms = application.configuration.transforms || {};

	// Create one-off special config
	const config = merge(
		{},
		{
			transforms: { // eslint-disable-line quote-props
				react: {
					inFormat: 'jsx',
					outFormat: 'js',
					resolveDependencies: false,
					convertDependencies: true
				},
				'react-mount': {
					inFormat: 'js',
					outFormat: 'js'
				},
				browserify: {
					inFormat: 'js',
					outFormat: 'js'
				}
			},
			patterns: {
				path: patterns.path,
				formats: {
					jsx: {
						name: 'Component',
						transforms: ['react', 'react-mount', 'browserify']
					},
					html: {
						name: 'Component',
						transforms: ['react', 'react-mount', 'browserify']
					}
				}
			}
		}
	);

	return async function() {
		// collect some base data
		const cwd = application.runtime.patterncwd || application.runtime.cwd;
		const base = resolve(cwd, config.patterns.path);

		// get the react-transformed patterns
		const patterns = await getPatterns({
			id: this.params.id,
			config,
			base,
			factory: application.pattern.factory,
			transforms: application.transforms,
			log: application.log
		}, application.cache);

		const pattern = patterns[0];

		if (!pattern || !pattern.results.Component) {
			this.throw(404);
		}

		const result = pattern.results.Component.buffer;
		this.type = 'js';
		this.body = result;
	};
}
