export default {
	tasks: {
		bundles: false,
		patterns: false,
		commonjs: false,
		static: false,
		cache: false,
		archive: false
	},
	bundles: {
		target: 'build',
		transforms: {},
		patterns: {},
		filters: {}
	},
	commonjs: {
		resolve: '%(outputName)s/%(patternId)s/index.%(extension)s',
		pkg: {},
		filters: {},
		patterns: {},
		transforms: {}
	}
};
