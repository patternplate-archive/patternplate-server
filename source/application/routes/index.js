import path from 'path';
import {PassThrough} from 'stream';
import {values} from 'lodash';
import getSchema from '../../library/get-schema';
import {getPatternTree} from '../../library/utilities/get-pattern-tree';

export default function indexRouteFactory(application) {
	return async function indexRoute() {
		switch (this.accepts('json', 'text/event-stream')) {
			case 'text/event-stream': {
				const stream = new PassThrough();
				const send = (type, data) => stream.write(sse(type, data));
				const heartbeat = setInterval(() => {
					send('heartbeat', Date.now());
				}, 1000);

				const end = () => {
					clearInterval(heartbeat);
					this.res.end();
				};

				this.type = 'text/event-stream';
				this.req.on('close', end);
				this.req.on('finish', end);
				this.req.on('error', error => {
					console.erorr(error);
					end();
				});

				if (application.watcher) {
					application.watcher.on('all', async (type, file) => {
						send('change', {type, file});
						const patterns = await getPatternTree('./patterns');
						affected(file, patterns).forEach(pattern => send('reload', {pattern}));
					});
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

function affected(file, patterns) {
	const b = strip(file);

	if (!['demo', 'index'].includes(b) && file !== 'pattern.js') {
		return [];
	}

	const guess = path.dirname(file.split(path.sep).slice(1).join('/'));
	const match = find(patterns, guess);

	if (!match) {
		return [];
	}

	if (b === 'demo') {
		return [match.id];
	}

	return [match.id, ...deps(match)];
}

function deps(p) {
	return values(p.dependents)
		.reduce((d, p) => [...d, p.id, ...deps(p)], []);
}

function find(tree, id, depth = 1) {
	if (!tree || !id) {
		return;
	}

	const frags = id.split('/').filter(Boolean);
	const sub = frags.slice(0, depth).map(strip);
	const match = tree.children.find(child => child.path.every((s, i) => sub[i] === strip(s)));

	if (match && depth < frags.length) {
		return find(match, id, depth + 1);
	}

	return match;
}

function strip(b) {
	return path.basename(b, path.extname(b));
}
