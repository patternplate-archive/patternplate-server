'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = {
	//'path': './application/transforms',
	'markdown': {
		'inFormat': 'md',
		'outFormat': 'html'
	},
	'react': {
		'inFormat': 'jsx',
		'outFormat': 'jsx',
		'opts': {}
	},
	'react-to-markup': {
		'inFormat': 'jsx',
		'outFormat': 'html',
		'opts': {}
	},
	'browserify': {
		'inFormat': 'js',
		'outFormat': 'js',
		'opts': {
			'debug': true
		},
		'transforms': {
			'babelify': {
				'enabled': true,
				'opts': {}
			},
			'uglifyify': {
				'enabled': false,
				'opts': {
					'global': true
				}
			},
			'envify': {
				'enabled': true,
				'opts': {
					'global': true,
					'_': 'purge'
				}
			},
			'unreachable-branch-transform': {
				'enabled': true,
				'opts': {
					'global': true
				}
			}
		}
	},
	'uglify': {
		'inFormat': 'js',
		'outFormat': 'js',
		'opts': {
			'sequences': true,
			'properties': true,
			'dead_code': true,
			'drop_debugger': true,
			'unsafe': true,
			'conditionals': true,
			'comparisons': true,
			'evaluate': true,
			'booleans': true,
			'loops': true,
			'unused': true,
			'hoist_funs': true,
			'if_return': true,
			'join_vars': true,
			'cascade': true,
			'warnings': false,
			'negate_iife': true,
			'pure_getters': true,
			'drop_console': true
		}
	},
	'less': {
		'inFormat': 'less',
		'outFormat': 'css',
		'opts': {
			'compress': false,
			'sourceMap': {
				'outputSourceFiles': true,
				'sourceMapFileInline': true
			}
		},
		'plugins': {
			'clean-css': {
				'enabled': false,
				'opts': {
					'advanced': true,
					'aggressiveMerging': true,
					'compatibility': '*',
					'mediaMerging': true,
					'processImport': false,
					'restructuring': true,
					'shorthandCompacting': true
				}
			},
			'autoprefix': {
				'enabled': true,
				'opts': {
					'browsers': ['last 2 versions']
				}
			}
		}
	}
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NvdXJjZS9jb25maWd1cmF0aW9uL3RyYW5zZm9ybXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7cUJBQWU7O0FBRWQsV0FBVSxFQUFFO0FBQ1gsWUFBVSxFQUFFLElBQUk7QUFDaEIsYUFBVyxFQUFFLE1BQU07RUFDbkI7QUFDRCxRQUFPLEVBQUU7QUFDUixZQUFVLEVBQUUsS0FBSztBQUNqQixhQUFXLEVBQUUsS0FBSztBQUNsQixRQUFNLEVBQUUsRUFBRTtFQUNWO0FBQ0Qsa0JBQWlCLEVBQUU7QUFDbEIsWUFBVSxFQUFFLEtBQUs7QUFDakIsYUFBVyxFQUFFLE1BQU07QUFDbkIsUUFBTSxFQUFFLEVBQUU7RUFDVjtBQUNELGFBQVksRUFBRTtBQUNiLFlBQVUsRUFBRSxJQUFJO0FBQ2hCLGFBQVcsRUFBRSxJQUFJO0FBQ2pCLFFBQU0sRUFBRTtBQUNQLFVBQU8sRUFBRSxJQUFJO0dBQ2I7QUFDRCxjQUFZLEVBQUU7QUFDYixhQUFVLEVBQUU7QUFDWCxhQUFTLEVBQUUsSUFBSTtBQUNmLFVBQU0sRUFBRSxFQUFFO0lBQ1Y7QUFDRCxjQUFXLEVBQUU7QUFDWixhQUFTLEVBQUUsS0FBSztBQUNoQixVQUFNLEVBQUU7QUFDUCxhQUFRLEVBQUUsSUFBSTtLQUNkO0lBQ0Q7QUFDRCxXQUFRLEVBQUU7QUFDVCxhQUFTLEVBQUUsSUFBSTtBQUNmLFVBQU0sRUFBRTtBQUNQLGFBQVEsRUFBRSxJQUFJO0FBQ2QsUUFBRyxFQUFFLE9BQU87S0FDWjtJQUNEO0FBQ0QsaUNBQThCLEVBQUU7QUFDL0IsYUFBUyxFQUFFLElBQUk7QUFDZixVQUFNLEVBQUU7QUFDUCxhQUFRLEVBQUUsSUFBSTtLQUNkO0lBQ0Q7R0FDRDtFQUNEO0FBQ0QsU0FBUSxFQUFFO0FBQ1QsWUFBVSxFQUFFLElBQUk7QUFDaEIsYUFBVyxFQUFFLElBQUk7QUFDakIsUUFBTSxFQUFFO0FBQ1AsY0FBVyxFQUFFLElBQUk7QUFDakIsZUFBWSxFQUFFLElBQUk7QUFDbEIsY0FBVyxFQUFFLElBQUk7QUFDakIsa0JBQWUsRUFBRSxJQUFJO0FBQ3JCLFdBQVEsRUFBRSxJQUFJO0FBQ2QsaUJBQWMsRUFBRSxJQUFJO0FBQ3BCLGdCQUFhLEVBQUUsSUFBSTtBQUNuQixhQUFVLEVBQUUsSUFBSTtBQUNoQixhQUFVLEVBQUUsSUFBSTtBQUNoQixVQUFPLEVBQUUsSUFBSTtBQUNiLFdBQVEsRUFBRSxJQUFJO0FBQ2QsZUFBWSxFQUFFLElBQUk7QUFDbEIsY0FBVyxFQUFFLElBQUk7QUFDakIsY0FBVyxFQUFFLElBQUk7QUFDakIsWUFBUyxFQUFFLElBQUk7QUFDZixhQUFVLEVBQUUsS0FBSztBQUNqQixnQkFBYSxFQUFFLElBQUk7QUFDbkIsaUJBQWMsRUFBRSxJQUFJO0FBQ3BCLGlCQUFjLEVBQUUsSUFBSTtHQUNwQjtFQUNEO0FBQ0QsT0FBTSxFQUFFO0FBQ1AsWUFBVSxFQUFFLE1BQU07QUFDbEIsYUFBVyxFQUFFLEtBQUs7QUFDbEIsUUFBTSxFQUFFO0FBQ1AsYUFBVSxFQUFFLEtBQUs7QUFDakIsY0FBVyxFQUFFO0FBQ1osdUJBQW1CLEVBQUUsSUFBSTtBQUN6Qix5QkFBcUIsRUFBRSxJQUFJO0lBQzNCO0dBQ0Q7QUFDRCxXQUFTLEVBQUU7QUFDVixjQUFXLEVBQUU7QUFDWixhQUFTLEVBQUUsS0FBSztBQUNoQixVQUFNLEVBQUU7QUFDUCxlQUFVLEVBQUUsSUFBSTtBQUNoQix3QkFBbUIsRUFBRSxJQUFJO0FBQ3pCLG9CQUFlLEVBQUUsR0FBRztBQUNwQixtQkFBYyxFQUFFLElBQUk7QUFDcEIsb0JBQWUsRUFBRSxLQUFLO0FBQ3RCLG9CQUFlLEVBQUUsSUFBSTtBQUNyQiwwQkFBcUIsRUFBRSxJQUFJO0tBQzNCO0lBQ0Q7QUFDRCxlQUFZLEVBQUU7QUFDYixhQUFTLEVBQUUsSUFBSTtBQUNmLFVBQU0sRUFBRTtBQUNQLGVBQVUsRUFBRSxDQUFDLGlCQUFpQixDQUFDO0tBQy9CO0lBQ0Q7R0FDRDtFQUNEO0NBQ0QiLCJmaWxlIjoidHJhbnNmb3Jtcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IHtcblx0Ly8ncGF0aCc6ICcuL2FwcGxpY2F0aW9uL3RyYW5zZm9ybXMnLFxuXHQnbWFya2Rvd24nOiB7XG5cdFx0J2luRm9ybWF0JzogJ21kJyxcblx0XHQnb3V0Rm9ybWF0JzogJ2h0bWwnXG5cdH0sXG5cdCdyZWFjdCc6IHtcblx0XHQnaW5Gb3JtYXQnOiAnanN4Jyxcblx0XHQnb3V0Rm9ybWF0JzogJ2pzeCcsXG5cdFx0J29wdHMnOiB7fVxuXHR9LFxuXHQncmVhY3QtdG8tbWFya3VwJzoge1xuXHRcdCdpbkZvcm1hdCc6ICdqc3gnLFxuXHRcdCdvdXRGb3JtYXQnOiAnaHRtbCcsXG5cdFx0J29wdHMnOiB7fVxuXHR9LFxuXHQnYnJvd3NlcmlmeSc6IHtcblx0XHQnaW5Gb3JtYXQnOiAnanMnLFxuXHRcdCdvdXRGb3JtYXQnOiAnanMnLFxuXHRcdCdvcHRzJzoge1xuXHRcdFx0J2RlYnVnJzogdHJ1ZVxuXHRcdH0sXG5cdFx0J3RyYW5zZm9ybXMnOiB7XG5cdFx0XHQnYmFiZWxpZnknOiB7XG5cdFx0XHRcdCdlbmFibGVkJzogdHJ1ZSxcblx0XHRcdFx0J29wdHMnOiB7fVxuXHRcdFx0fSxcblx0XHRcdCd1Z2xpZnlpZnknOiB7XG5cdFx0XHRcdCdlbmFibGVkJzogZmFsc2UsXG5cdFx0XHRcdCdvcHRzJzoge1xuXHRcdFx0XHRcdCdnbG9iYWwnOiB0cnVlXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHQnZW52aWZ5Jzoge1xuXHRcdFx0XHQnZW5hYmxlZCc6IHRydWUsXG5cdFx0XHRcdCdvcHRzJzoge1xuXHRcdFx0XHRcdCdnbG9iYWwnOiB0cnVlLFxuXHRcdFx0XHRcdCdfJzogJ3B1cmdlJ1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0J3VucmVhY2hhYmxlLWJyYW5jaC10cmFuc2Zvcm0nOiB7XG5cdFx0XHRcdCdlbmFibGVkJzogdHJ1ZSxcblx0XHRcdFx0J29wdHMnOiB7XG5cdFx0XHRcdFx0J2dsb2JhbCc6IHRydWVcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0J3VnbGlmeSc6IHtcblx0XHQnaW5Gb3JtYXQnOiAnanMnLFxuXHRcdCdvdXRGb3JtYXQnOiAnanMnLFxuXHRcdCdvcHRzJzoge1xuXHRcdFx0J3NlcXVlbmNlcyc6IHRydWUsXG5cdFx0XHQncHJvcGVydGllcyc6IHRydWUsXG5cdFx0XHQnZGVhZF9jb2RlJzogdHJ1ZSxcblx0XHRcdCdkcm9wX2RlYnVnZ2VyJzogdHJ1ZSxcblx0XHRcdCd1bnNhZmUnOiB0cnVlLFxuXHRcdFx0J2NvbmRpdGlvbmFscyc6IHRydWUsXG5cdFx0XHQnY29tcGFyaXNvbnMnOiB0cnVlLFxuXHRcdFx0J2V2YWx1YXRlJzogdHJ1ZSxcblx0XHRcdCdib29sZWFucyc6IHRydWUsXG5cdFx0XHQnbG9vcHMnOiB0cnVlLFxuXHRcdFx0J3VudXNlZCc6IHRydWUsXG5cdFx0XHQnaG9pc3RfZnVucyc6IHRydWUsXG5cdFx0XHQnaWZfcmV0dXJuJzogdHJ1ZSxcblx0XHRcdCdqb2luX3ZhcnMnOiB0cnVlLFxuXHRcdFx0J2Nhc2NhZGUnOiB0cnVlLFxuXHRcdFx0J3dhcm5pbmdzJzogZmFsc2UsXG5cdFx0XHQnbmVnYXRlX2lpZmUnOiB0cnVlLFxuXHRcdFx0J3B1cmVfZ2V0dGVycyc6IHRydWUsXG5cdFx0XHQnZHJvcF9jb25zb2xlJzogdHJ1ZVxuXHRcdH1cblx0fSxcblx0J2xlc3MnOiB7XG5cdFx0J2luRm9ybWF0JzogJ2xlc3MnLFxuXHRcdCdvdXRGb3JtYXQnOiAnY3NzJyxcblx0XHQnb3B0cyc6IHtcblx0XHRcdCdjb21wcmVzcyc6IGZhbHNlLFxuXHRcdFx0J3NvdXJjZU1hcCc6IHtcblx0XHRcdFx0J291dHB1dFNvdXJjZUZpbGVzJzogdHJ1ZSxcblx0XHRcdFx0J3NvdXJjZU1hcEZpbGVJbmxpbmUnOiB0cnVlXG5cdFx0XHR9XG5cdFx0fSxcblx0XHQncGx1Z2lucyc6IHtcblx0XHRcdCdjbGVhbi1jc3MnOiB7XG5cdFx0XHRcdCdlbmFibGVkJzogZmFsc2UsXG5cdFx0XHRcdCdvcHRzJzoge1xuXHRcdFx0XHRcdCdhZHZhbmNlZCc6IHRydWUsXG5cdFx0XHRcdFx0J2FnZ3Jlc3NpdmVNZXJnaW5nJzogdHJ1ZSxcblx0XHRcdFx0XHQnY29tcGF0aWJpbGl0eSc6ICcqJyxcblx0XHRcdFx0XHQnbWVkaWFNZXJnaW5nJzogdHJ1ZSxcblx0XHRcdFx0XHQncHJvY2Vzc0ltcG9ydCc6IGZhbHNlLFxuXHRcdFx0XHRcdCdyZXN0cnVjdHVyaW5nJzogdHJ1ZSxcblx0XHRcdFx0XHQnc2hvcnRoYW5kQ29tcGFjdGluZyc6IHRydWVcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdCdhdXRvcHJlZml4Jzoge1xuXHRcdFx0XHQnZW5hYmxlZCc6IHRydWUsXG5cdFx0XHRcdCdvcHRzJzoge1xuXHRcdFx0XHRcdCdicm93c2Vycyc6IFsnbGFzdCAyIHZlcnNpb25zJ11cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxufTtcbiJdfQ==