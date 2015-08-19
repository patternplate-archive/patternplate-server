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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NvdXJjZS9hcHBsaWNhdGlvbi9yb3V0ZXMvaGVhbHRoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O3FCQUF3QixrQkFBa0I7O0FBQTNCLFNBQVMsa0JBQWtCLENBQUUsV0FBVyxFQUFFLGFBQWEsRUFBRTtBQUN2RSxnQ0FBTyxTQUFXLFdBQVc7TUFDeEIsTUFBTTs7OztBQUFOLFdBQU0sR0FBRyxXQUFXLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLElBQUk7O0FBRS9ELFNBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDakMsU0FBSSxDQUFDLElBQUksR0FBRztBQUNYLFlBQU0sRUFBRSxXQUFXLENBQUMsSUFBSTtBQUN4QixlQUFTLEVBQUUsTUFBTTtNQUNqQixDQUFDOzs7Ozs7S0FQZSxXQUFXO0VBUTVCLEVBQUM7Q0FDRiIsImZpbGUiOiJoZWFsdGguanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBoZWFsdGhSb3V0ZUZhY3RvcnkgKGFwcGxpY2F0aW9uLCBjb25maWd1cmF0aW9uKSB7XG5cdHJldHVybiBmdW5jdGlvbiAqIGhlYWx0aFJvdXRlICgpIHtcblx0XHRsZXQgaGVhbHRoID0gYXBwbGljYXRpb24uY2FjaGUgPyBhcHBsaWNhdGlvbi5jYWNoZS5yZWFkeSA6IHRydWU7XG5cblx0XHR0aGlzLnN0YXR1cyA9IGhlYWx0aCA/IDIwMCA6IDUwMztcblx0XHR0aGlzLmJvZHkgPSB7XG5cdFx0XHQnbmFtZSc6IGFwcGxpY2F0aW9uLm5hbWUsXG5cdFx0XHQnaGVhbHRoeSc6IGhlYWx0aFxuXHRcdH07XG5cdH07XG59XG4iXX0=