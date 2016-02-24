import boilerplate from 'boilerplate-server';
import findRoot from 'find-root';

export default async options =>
	boilerplate({
		name: 'patternplate-server',
		cwd: findRoot(__dirname),
		...options
	});
