import {merge} from 'lodash';

import flatPick from './utilities/flat-pick';
import getPatternRetriever from './utilities/get-pattern-retriever';

async function getPattern(application, id, environment, cmds) {
	const retrieve = await getPatternRetriever(application);
	const results = await retrieve(id, {environments: [environment]}, environment, cmds);
	return results;
}

export default async function(application, id, environment, cmds = ['read']) {
	const [pattern] = await getPattern(application, id, environment, cmds);

	if (!pattern) {
		return pattern;
	}

	// backwards compatibility
	const copy = merge({}, pattern);
	copy.results = {index: pattern.results};
	copy.dependencies = flatPick(pattern, 'dependencies', ['id', 'manifest']);
	return copy;
}
