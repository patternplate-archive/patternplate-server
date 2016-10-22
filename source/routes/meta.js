import getNavigation from '../library/get-navigation';

export default (application, configuration) => {
	return async function metaRoute() {
		this.type = 'json';
		this.body = await getNavigation(
			application,
			application.parent.client,
			application.parent.server,
			configuration.options.key
		);
	};
};
