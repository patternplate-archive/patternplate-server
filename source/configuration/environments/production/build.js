export default {
	'tasks': {
		'cache': true
	},
	'patterns': {
		'formats': {
			'js': {
				'name': 'Script',
				'transforms': ['browserify'],
				'build': true
			}
		}
	},
	'transforms': {
		'uglify': {
			'enabled': true
		},
		'browserify': {
			'transforms': {
				'uglifyify': {
					'enabled': true
				}
			}
		},
		'less': {
			'opts': {
				'ieCompat': true,
				'compress': true,
				'sourceMap': false
			},
			'plugins': {
				'clean-css': {
					'enabled': true
				}
			}
		}
	}
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NvdXJjZS9jb25maWd1cmF0aW9uL2Vudmlyb25tZW50cy9wcm9kdWN0aW9uL2J1aWxkLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O3FCQUFlO0FBQ2QsUUFBTyxFQUFFO0FBQ1IsU0FBTyxFQUFFLElBQUk7RUFDYjtBQUNELFdBQVUsRUFBRTtBQUNYLFdBQVMsRUFBRTtBQUNWLE9BQUksRUFBRTtBQUNMLFVBQU0sRUFBRSxRQUFRO0FBQ2hCLGdCQUFZLEVBQUUsQ0FBQyxZQUFZLENBQUM7QUFDNUIsV0FBTyxFQUFFLElBQUk7SUFDYjtHQUNEO0VBQ0Q7QUFDRCxhQUFZLEVBQUU7QUFDYixVQUFRLEVBQUU7QUFDVCxZQUFTLEVBQUUsSUFBSTtHQUNmO0FBQ0QsY0FBWSxFQUFFO0FBQ2IsZUFBWSxFQUFFO0FBQ2IsZUFBVyxFQUFFO0FBQ1osY0FBUyxFQUFFLElBQUk7S0FDZjtJQUNEO0dBQ0Q7QUFDRCxRQUFNLEVBQUU7QUFDUCxTQUFNLEVBQUU7QUFDUCxjQUFVLEVBQUUsSUFBSTtBQUNoQixjQUFVLEVBQUUsSUFBSTtBQUNoQixlQUFXLEVBQUUsS0FBSztJQUNsQjtBQUNELFlBQVMsRUFBRTtBQUNWLGVBQVcsRUFBRTtBQUNaLGNBQVMsRUFBRSxJQUFJO0tBQ2Y7SUFDRDtHQUNEO0VBQ0Q7Q0FDRCIsImZpbGUiOiJidWlsZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IHtcblx0J3Rhc2tzJzoge1xuXHRcdCdjYWNoZSc6IHRydWVcblx0fSxcblx0J3BhdHRlcm5zJzoge1xuXHRcdCdmb3JtYXRzJzoge1xuXHRcdFx0J2pzJzoge1xuXHRcdFx0XHQnbmFtZSc6ICdTY3JpcHQnLFxuXHRcdFx0XHQndHJhbnNmb3Jtcyc6IFsnYnJvd3NlcmlmeSddLFxuXHRcdFx0XHQnYnVpbGQnOiB0cnVlXG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHQndHJhbnNmb3Jtcyc6IHtcblx0XHQndWdsaWZ5Jzoge1xuXHRcdFx0J2VuYWJsZWQnOiB0cnVlXG5cdFx0fSxcblx0XHQnYnJvd3NlcmlmeSc6IHtcblx0XHRcdCd0cmFuc2Zvcm1zJzoge1xuXHRcdFx0XHQndWdsaWZ5aWZ5Jzoge1xuXHRcdFx0XHRcdCdlbmFibGVkJzogdHJ1ZVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHQnbGVzcyc6IHtcblx0XHRcdCdvcHRzJzoge1xuXHRcdFx0XHQnaWVDb21wYXQnOiB0cnVlLFxuXHRcdFx0XHQnY29tcHJlc3MnOiB0cnVlLFxuXHRcdFx0XHQnc291cmNlTWFwJzogZmFsc2Vcblx0XHRcdH0sXG5cdFx0XHQncGx1Z2lucyc6IHtcblx0XHRcdFx0J2NsZWFuLWNzcyc6IHtcblx0XHRcdFx0XHQnZW5hYmxlZCc6IHRydWVcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxufTtcbiJdfQ==
