import {resolve} from 'path';

const routes = {
	path: ['application/routes'],
	enabled: {
		index: {
			enabled: true,
			path: '/'
		},
		meta: {
			enabled: true,
			path: '/meta/',
			options: {
				key: 'patterns'
			}
		},
		pattern: {
			enabled: true,
			path: '/pattern/:id+',
			options: {
				key: 'patterns'
			}
		},
		file: {
			enabled: true,
			path: '/file/:id+'
		},
		static: {
			options: {
				root: [
					resolve(__dirname, '../', 'static'),
					resolve(process.cwd(), 'static')
				]
			}
		}
	}
};

export default routes;
