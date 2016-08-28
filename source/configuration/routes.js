import {resolve} from 'path';

const routes = {
	path: [
		'application/routes',
		'application/patternplate-server/routes'
	],
	enabled: { // eslint-disable-line quote-props
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
		script: {
			enabled: true,
			path: '/script/:path+'
		},
		'react-mount': {
			enabled: true,
			path: '/react-mount/:id+'
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
