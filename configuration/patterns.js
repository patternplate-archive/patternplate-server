'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = {
	'path': './patterns',
	'transformPath': ['application/transforms', 'application/patternplate-server/transforms'],
	'formats': {
		'js': {
			'name': 'Script',
			'transforms': ['browserify'],
			'build': true
		},
		'less': {
			'name': 'Style',
			'transforms': ['less'],
			'build': true
		},
		'css': {
			'name': 'Style',
			'transforms': ['less'],
			'build': true
		},
		'html': {
			'name': 'Markup',
			'transforms': ['react', 'react-to-markup']
		},
		'jsx': {
			'name': 'Markup',
			'transforms': ['react', 'react-to-markup']
		},
		'md': {
			'name': 'Documentation',
			'transforms': ['markdown']
		}
	},
	'cache': {
		'populate': false,
		'read': false,
		'files': true,
		'transform': true,
		'static': false,
		'options': {
			'max': Infinity
		}
	}
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NvdXJjZS9jb25maWd1cmF0aW9uL3BhdHRlcm5zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O3FCQUFlO0FBQ2QsT0FBTSxFQUFFLFlBQVk7QUFDcEIsZ0JBQWUsRUFBRSxDQUNoQix3QkFBd0IsRUFDeEIsNENBQTRDLENBQzVDO0FBQ0QsVUFBUyxFQUFFO0FBQ1YsTUFBSSxFQUFFO0FBQ0wsU0FBTSxFQUFFLFFBQVE7QUFDaEIsZUFBWSxFQUFFLENBQUMsWUFBWSxDQUFDO0FBQzVCLFVBQU8sRUFBRSxJQUFJO0dBQ2I7QUFDRCxRQUFNLEVBQUU7QUFDUCxTQUFNLEVBQUUsT0FBTztBQUNmLGVBQVksRUFBRSxDQUFDLE1BQU0sQ0FBQztBQUN0QixVQUFPLEVBQUUsSUFBSTtHQUNiO0FBQ0QsT0FBSyxFQUFFO0FBQ04sU0FBTSxFQUFFLE9BQU87QUFDZixlQUFZLEVBQUUsQ0FBQyxNQUFNLENBQUM7QUFDdEIsVUFBTyxFQUFFLElBQUk7R0FDYjtBQUNELFFBQU0sRUFBRTtBQUNQLFNBQU0sRUFBRSxRQUFRO0FBQ2hCLGVBQVksRUFBRSxDQUFDLE9BQU8sRUFBRSxpQkFBaUIsQ0FBQztHQUMxQztBQUNELE9BQUssRUFBRTtBQUNOLFNBQU0sRUFBRSxRQUFRO0FBQ2hCLGVBQVksRUFBRSxDQUFDLE9BQU8sRUFBRSxpQkFBaUIsQ0FBQztHQUMxQztBQUNELE1BQUksRUFBRTtBQUNMLFNBQU0sRUFBRSxlQUFlO0FBQ3ZCLGVBQVksRUFBRSxDQUFDLFVBQVUsQ0FBQztHQUMxQjtFQUNEO0FBQ0QsUUFBTyxFQUFFO0FBQ1IsWUFBVSxFQUFFLEtBQUs7QUFDakIsUUFBTSxFQUFFLEtBQUs7QUFDYixTQUFPLEVBQUUsSUFBSTtBQUNiLGFBQVcsRUFBRSxJQUFJO0FBQ2pCLFVBQVEsRUFBRSxLQUFLO0FBQ2YsV0FBUyxFQUFFO0FBQ1YsUUFBSyxFQUFFLFFBQVE7R0FDZjtFQUNEO0NBQ0QiLCJmaWxlIjoicGF0dGVybnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCB7XG5cdCdwYXRoJzogJy4vcGF0dGVybnMnLFxuXHQndHJhbnNmb3JtUGF0aCc6IFtcblx0XHQnYXBwbGljYXRpb24vdHJhbnNmb3JtcycsXG5cdFx0J2FwcGxpY2F0aW9uL3BhdHRlcm5wbGF0ZS1zZXJ2ZXIvdHJhbnNmb3Jtcydcblx0XSxcblx0J2Zvcm1hdHMnOiB7XG5cdFx0J2pzJzoge1xuXHRcdFx0J25hbWUnOiAnU2NyaXB0Jyxcblx0XHRcdCd0cmFuc2Zvcm1zJzogWydicm93c2VyaWZ5J10sXG5cdFx0XHQnYnVpbGQnOiB0cnVlXG5cdFx0fSxcblx0XHQnbGVzcyc6IHtcblx0XHRcdCduYW1lJzogJ1N0eWxlJyxcblx0XHRcdCd0cmFuc2Zvcm1zJzogWydsZXNzJ10sXG5cdFx0XHQnYnVpbGQnOiB0cnVlXG5cdFx0fSxcblx0XHQnY3NzJzoge1xuXHRcdFx0J25hbWUnOiAnU3R5bGUnLFxuXHRcdFx0J3RyYW5zZm9ybXMnOiBbJ2xlc3MnXSxcblx0XHRcdCdidWlsZCc6IHRydWVcblx0XHR9LFxuXHRcdCdodG1sJzoge1xuXHRcdFx0J25hbWUnOiAnTWFya3VwJyxcblx0XHRcdCd0cmFuc2Zvcm1zJzogWydyZWFjdCcsICdyZWFjdC10by1tYXJrdXAnXVxuXHRcdH0sXG5cdFx0J2pzeCc6IHtcblx0XHRcdCduYW1lJzogJ01hcmt1cCcsXG5cdFx0XHQndHJhbnNmb3Jtcyc6IFsncmVhY3QnLCAncmVhY3QtdG8tbWFya3VwJ11cblx0XHR9LFxuXHRcdCdtZCc6IHtcblx0XHRcdCduYW1lJzogJ0RvY3VtZW50YXRpb24nLFxuXHRcdFx0J3RyYW5zZm9ybXMnOiBbJ21hcmtkb3duJ11cblx0XHR9XG5cdH0sXG5cdCdjYWNoZSc6IHtcblx0XHQncG9wdWxhdGUnOiBmYWxzZSxcblx0XHQncmVhZCc6IGZhbHNlLFxuXHRcdCdmaWxlcyc6IHRydWUsXG5cdFx0J3RyYW5zZm9ybSc6IHRydWUsXG5cdFx0J3N0YXRpYyc6IGZhbHNlLFxuXHRcdCdvcHRpb25zJzoge1xuXHRcdFx0J21heCc6IEluZmluaXR5XG5cdFx0fVxuXHR9XG59O1xuIl19