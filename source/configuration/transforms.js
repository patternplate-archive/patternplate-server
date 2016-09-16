/* eslint-disable */
export default {
	path: [],
	markdown: {
		inFormat: 'md',
		outFormats: 'html'
	},
	react: {
		inFormat: 'jsx',
		outFormat: 'jsx',
		resolveDependencies: true,
		opts: {}
	},
	'react-mount': {
		inFormat: 'js',
		outFormat: 'js'
	},
	'react-to-markup': {
		inFormat: 'jsx',
		outFormat: 'html',
		opts: {}
	},
	babel: {
		inFormat: 'js',
		outFormat: 'js',
		opts: {}
	},
	browserify: {
		inFormat: 'js',
		outFormat: 'js',
		rewrite: true,
		opts: {},
		transforms: {}
	},
	uglify: {
		inFormat: 'js',
		outFormat: 'js',
		opts: {}
	},
	less: {
		inFormat: 'less',
		outFormat: 'css',
		opts: {},
		plugins: {}
	},
	'resolve-includes': {
		outFormat: 'less',
		resolve: '%(outputName)s/%(patternId)s/index.%(extension)s'
	},
	'resolve-imports': {
		outFormat: 'js',
		resolve: '%(outputName)s/%(patternId)s/index.%(extension)s'
	}
};
