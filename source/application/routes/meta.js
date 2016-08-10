import getNavigation from '../../library/get-navigation';

export default (application, configuration) => {
	return async function metaRoute() {
		console.log(configuration.options);
		this.type = 'json';
		this.body = await getNavigation(application, configuration.options.key);
	};
};
