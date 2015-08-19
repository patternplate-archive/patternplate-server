import {resolve} from 'path';

const routes = {
	'path': [
		'application/routes',
		'application/patternplate-server/routes'
	],
	'enabled': {
		'index': {
			'enabled': true,
			'path': '/'
		},
		'meta': {
			'enabled': true,
			'path': '/meta/',
			'options': {
				'key': 'patterns'
			}
		},
		'pattern': {
			'enabled': true,
			'path': '/pattern/:id+',
			'options': {
				'key': 'patterns',
				'maxage': 3600000
			}
		},
		'script': {
			'enabled': true,
			'path': '/script/:path+'
		},
		'demo': {
			'enabled': true,
			'path': '/demo/:id+'
		},
		'build': {
			'enabled': true,
			'path': '/build/:path*'
		},
		'static': {
			'options': {
				'root': [
					resolve(__dirname, '../', 'static'),
					resolve(process.cwd(), 'static')
				]
			}
		}
	}
};

export default routes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NvdXJjZS9jb25maWd1cmF0aW9uL3JvdXRlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7b0JBQXNCLE1BQU07O0FBRTVCLElBQU0sTUFBTSxHQUFHO0FBQ2QsT0FBTSxFQUFFLENBQ1Asb0JBQW9CLEVBQ3BCLHdDQUF3QyxDQUN4QztBQUNELFVBQVMsRUFBRTtBQUNWLFNBQU8sRUFBRTtBQUNSLFlBQVMsRUFBRSxJQUFJO0FBQ2YsU0FBTSxFQUFFLEdBQUc7R0FDWDtBQUNELFFBQU0sRUFBRTtBQUNQLFlBQVMsRUFBRSxJQUFJO0FBQ2YsU0FBTSxFQUFFLFFBQVE7QUFDaEIsWUFBUyxFQUFFO0FBQ1YsU0FBSyxFQUFFLFVBQVU7SUFDakI7R0FDRDtBQUNELFdBQVMsRUFBRTtBQUNWLFlBQVMsRUFBRSxJQUFJO0FBQ2YsU0FBTSxFQUFFLGVBQWU7QUFDdkIsWUFBUyxFQUFFO0FBQ1YsU0FBSyxFQUFFLFVBQVU7QUFDakIsWUFBUSxFQUFFLE9BQU87SUFDakI7R0FDRDtBQUNELFVBQVEsRUFBRTtBQUNULFlBQVMsRUFBRSxJQUFJO0FBQ2YsU0FBTSxFQUFFLGdCQUFnQjtHQUN4QjtBQUNELFFBQU0sRUFBRTtBQUNQLFlBQVMsRUFBRSxJQUFJO0FBQ2YsU0FBTSxFQUFFLFlBQVk7R0FDcEI7QUFDRCxTQUFPLEVBQUU7QUFDUixZQUFTLEVBQUUsSUFBSTtBQUNmLFNBQU0sRUFBRSxlQUFlO0dBQ3ZCO0FBQ0QsVUFBUSxFQUFFO0FBQ1QsWUFBUyxFQUFFO0FBQ1YsVUFBTSxFQUFFLENBQ1AsbUJBQVEsU0FBUyxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsRUFDbkMsbUJBQVEsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUNoQztJQUNEO0dBQ0Q7RUFDRDtDQUNELENBQUM7O3FCQUVhLE1BQU0iLCJmaWxlIjoicm91dGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtyZXNvbHZlfSBmcm9tICdwYXRoJztcblxuY29uc3Qgcm91dGVzID0ge1xuXHQncGF0aCc6IFtcblx0XHQnYXBwbGljYXRpb24vcm91dGVzJyxcblx0XHQnYXBwbGljYXRpb24vcGF0dGVybnBsYXRlLXNlcnZlci9yb3V0ZXMnXG5cdF0sXG5cdCdlbmFibGVkJzoge1xuXHRcdCdpbmRleCc6IHtcblx0XHRcdCdlbmFibGVkJzogdHJ1ZSxcblx0XHRcdCdwYXRoJzogJy8nXG5cdFx0fSxcblx0XHQnbWV0YSc6IHtcblx0XHRcdCdlbmFibGVkJzogdHJ1ZSxcblx0XHRcdCdwYXRoJzogJy9tZXRhLycsXG5cdFx0XHQnb3B0aW9ucyc6IHtcblx0XHRcdFx0J2tleSc6ICdwYXR0ZXJucydcblx0XHRcdH1cblx0XHR9LFxuXHRcdCdwYXR0ZXJuJzoge1xuXHRcdFx0J2VuYWJsZWQnOiB0cnVlLFxuXHRcdFx0J3BhdGgnOiAnL3BhdHRlcm4vOmlkKycsXG5cdFx0XHQnb3B0aW9ucyc6IHtcblx0XHRcdFx0J2tleSc6ICdwYXR0ZXJucycsXG5cdFx0XHRcdCdtYXhhZ2UnOiAzNjAwMDAwXG5cdFx0XHR9XG5cdFx0fSxcblx0XHQnc2NyaXB0Jzoge1xuXHRcdFx0J2VuYWJsZWQnOiB0cnVlLFxuXHRcdFx0J3BhdGgnOiAnL3NjcmlwdC86cGF0aCsnXG5cdFx0fSxcblx0XHQnZGVtbyc6IHtcblx0XHRcdCdlbmFibGVkJzogdHJ1ZSxcblx0XHRcdCdwYXRoJzogJy9kZW1vLzppZCsnXG5cdFx0fSxcblx0XHQnYnVpbGQnOiB7XG5cdFx0XHQnZW5hYmxlZCc6IHRydWUsXG5cdFx0XHQncGF0aCc6ICcvYnVpbGQvOnBhdGgqJ1xuXHRcdH0sXG5cdFx0J3N0YXRpYyc6IHtcblx0XHRcdCdvcHRpb25zJzoge1xuXHRcdFx0XHQncm9vdCc6IFtcblx0XHRcdFx0XHRyZXNvbHZlKF9fZGlybmFtZSwgJy4uLycsICdzdGF0aWMnKSxcblx0XHRcdFx0XHRyZXNvbHZlKHByb2Nlc3MuY3dkKCksICdzdGF0aWMnKVxuXHRcdFx0XHRdXG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59O1xuXG5leHBvcnQgZGVmYXVsdCByb3V0ZXM7XG4iXX0=
