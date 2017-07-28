import {PassThrough} from 'stream';
import getSchema from '../../library/get-schema';

export default function indexRouteFactory(application) {
	return async function indexRoute() {
		switch (this.accepts('json', 'text/event-stream')) {
			case 'text/event-stream': {
				const stream = new PassThrough();
				const send = data => stream.write(sse('change', data));

				this.type = 'text/event-stream';
				this.req.on('close', () => this.res.end());
				this.req.on('finish', () => this.res.end());
				this.req.on('error', () => this.res.end());

				if (application.watcher) {
					application.watcher.on('all', (type, file) => send({type, file}));
				}

				this.body = stream;
				return;
			}
			case 'json':
			default:
				this.type = 'json';
				this.body = await getSchema(application.parent, application.client, application);
				return;
		}
	};
}

function sse(event, data) {
	return `event:${event}\ndata: ${JSON.stringify(data)}\n\n`;
}
