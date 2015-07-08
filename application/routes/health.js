'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = healthRouteFactory;

function healthRouteFactory(application, configuration) {
	return regeneratorRuntime.mark(function healthRoute() {
		var health;
		return regeneratorRuntime.wrap(function healthRoute$(context$2$0) {
			while (1) switch (context$2$0.prev = context$2$0.next) {
				case 0:
					health = application.cache ? application.cache.ready : true;

					this.status = health ? 200 : 503;
					this.body = {
						'name': application.name,
						'healthy': health
					};

				case 3:
				case 'end':
					return context$2$0.stop();
			}
		}, healthRoute, this);
	});
}

module.exports = exports['default'];