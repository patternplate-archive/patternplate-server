import path from 'path';
import getPatterns from './get-patterns';

export default function getPatternRetriever(application) {
	const config = application.configuration;
	const factory = application.pattern.factory;
	const transforms = application.transforms;
	const log = application.log;

	const cwd = application.runtime.patterncwd || application.runtime.cwd;
	const base = path.resolve(cwd, config.patterns.path);

	return (id, filters = {}) => getPatterns({id, base, config, factory, transforms, log, filters});
}
