import merge from 'lodash.merge';

import {deprecation} from '../../../library/log/decorations';
import archiveTask from '../build-archive';
import bundlesTask from '../build-bundles';
import cacheTask from '../build-cache';
import commonjsTask from '../build-commonjs';
import staticTask from '../build-static';

async function build(application, configuration) {
	const buildConfig = merge({}, application.configuration.build, configuration);

	// Build pattern artifact tree
	if (buildConfig.tasks.patterns && buildConfig.tasks.patterns !== 'false') {
		application.log.warn(deprecation`The patterns sub-task of build was removed. Use the commonjs task instead. You can disable it by specifying patternplate-server.configuration.build.tasks.patterns=false`);
	}

	// Build static cache
	if (buildConfig.tasks.cache && buildConfig.tasks.cache !== 'false') {
		await cacheTask(application, buildConfig.cache || {});
	}

	// Build commonjs pkg root
	if (buildConfig.tasks.commonjs && buildConfig.tasks.commonjs !== 'false') {
		await commonjsTask(application, buildConfig.commonjs || {});
	}

	// Build bundles
	if (buildConfig.tasks.bundles && buildConfig.tasks.bundles !== 'false') {
		await bundlesTask(application, buildConfig.bundles || {});
	}

	// Copy static files
	if (buildConfig.tasks.static && buildConfig.tasks.static !== 'false') {
		await staticTask(application, buildConfig.bundles || {});
	}

	// Archive all the things
	if (buildConfig.tasks.archive) {
		await archiveTask(application, buildConfig.archive || {});
	}
}

export default build;
