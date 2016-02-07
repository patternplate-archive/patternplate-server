import {
	merge,
	find
} from 'lodash';

export default async function buildBundles (...args) {
	const [application, options] = args;
	const configuration = merge({}, application.configuration['build-bundles'], options);
	const cwd = application.runtime.patterncwd|| application.runtime.cwd;
	const hook = find(application.hooks, {name: 'patterns'});
	const root = resolve(cwd, hook.configuration.path);

	// get environments

	// for each environment:
		// reconfigure

		// get patterns to build into bundles

		// create temporary commonjs build

		// produce output files
};
