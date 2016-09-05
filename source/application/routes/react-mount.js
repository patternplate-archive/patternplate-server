import getComponent from '../../library/get-component';
import urlQuery from '../../library/utilities/url-query';

export default function (application) {
	return async function() {
		this.type = 'js';
		const parsed = urlQuery.parse(this.params.id);
		const id = parsed.pathname;
		const {environment} = parsed.query;

		const component = await getComponent(application, id, environment);

		if (!component.buffer) {
			this.throw(404);
		}

		this.body = component.buffer;
	};
}
