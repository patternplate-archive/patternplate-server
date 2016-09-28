export default {
	tasks: {
		bundles: true,
		patterns: false,
		commonjs: false,
		static: true,
		cache: false,
		archive: true
	},
	bundles: {
		target: 'build',
		transforms: {
			less: {
				opts: {
					sourceMap: {
						outputSourceFiles: false,
						sourceMapFileInline: false
					}
				}
			},
			browserify: {
				opts: {
					debug: false,
					watch: false
				}
			}
		},
		patterns: {
			formats: {

			}
		},
		filters: {
			inFormats: ['less', 'css', 'js'],
			baseNames: ['index']
		}
	},
	commonjs: {
		resolve: '%(outputName)s/%(patternId)s/index.%(extension)s',
		pkg: {
			style: 'style'
		},
		filters: {
			inFormats: ['less', 'css', 'js', 'jsx', 'html', 'md'],
			baseNames: ['index']
		},
		patterns: {
			formats: {
				jsx: {
					name: 'component',
					transforms: ['react', 'resolve-imports'],
					dependencies: ['react']
				},
				html: {
					name: 'component',
					transforms: ['react', 'resolve-imports'],
					dependencies: ['react']
				},
				js: {
					name: 'script',
					transforms: ['babel', 'resolve-imports']
				},
				less: {
					name: 'style',
					transforms: ['resolve-includes'],
					dependencies: [
						'less',
						'less-plugin-npm-import'
					]
				},
				css: {
					name: 'style',
					transforms: ['resolve-includes'],
					dependencies: [
						'less',
						'less-plugin-npm-import'
					]
				},
				md: {
					name: 'documentation',
					transforms: []
				}
			}
		},
		transforms: {
			react: {
				outFormat: 'js',
				resolveDependencies: false
			}
		}
	}
};
