export default function healthRouteFactory (application, configuration) {
	return function * healthRoute () {
		let health = application.cache ? application.cache.ready : true;

		this.status = health ? 200 : 503;
		this.body = {
			'name': application.name,
			'healthy': health
		};
	};
}
