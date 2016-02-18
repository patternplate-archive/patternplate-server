import {deprecation} from '../../../library/log/decorations';
import commonjsTask from '../build-commonjs';

export default async (...args) => {
	const [application] = args;
	application.log.warn(deprecation`The commonjs task was renamed to build-commonjs, the old name is deprecated and will be removed in version 1.0`);
	return commonjsTask(...args);
};
