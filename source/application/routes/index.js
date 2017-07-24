import getSchema from '../../library/get-schema';

export default function indexRouteFactory(application) {
	return async function indexRoute() {
		this.type = 'json';
		this.body = await getSchema(application.parent, application.client, application);
	};
}
