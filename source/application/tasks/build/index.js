import {merge} from 'lodash';

import {deprecation, wait, ready} from '../../../library/log/decorations';
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
		application.log.info(wait`Starting sub-task build-cache`);
		await cacheTask(application, buildConfig.cache || {});
		application.log.info(ready`Executed sub-task build-cache`);
	}

	// Build commonjs pkg root
	if (buildConfig.tasks.commonjs && buildConfig.tasks.commonjs !== 'false') {
		application.log.info(wait`Starting sub-task build-commonjs`);
		await commonjsTask(application, buildConfig.commonjs || {});
		application.log.info(ready`Executed sub-task build-commonjs`);
	}

	// Build bundles
	if (buildConfig.tasks.bundles && buildConfig.tasks.bundles !== 'false') {
		application.log.info(wait`Starting sub-task build-bundles`);
		await bundlesTask(application, buildConfig.bundles || {});
		application.log.info(ready`Executed sub-task build-bundles`);
	}

	// Copy static files
	if (buildConfig.tasks.static && buildConfig.tasks.static !== 'false') {
		application.log.info(wait`Starting sub-task build-static`);
		await staticTask(application, buildConfig.bundles || {});
		application.log.info(ready`Executed sub-task build-static`);
	}

	// Archive all the things
	if (buildConfig.tasks.archive && buildConfig.tasks.archive !== 'false') {
		application.log.info(wait`Starting sub-task build-archive`);
		await archiveTask(application, buildConfig.archive || {});
		application.log.info(ready`Executed sub-task build-archive`);
	}
}

export default build;
