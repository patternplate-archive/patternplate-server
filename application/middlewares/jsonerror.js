'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = JSONErrorFactory;

function JSONErrorFactory(application) {
	return regeneratorRuntime.mark(function jsonErrorMiddlewares(next) {
		return regeneratorRuntime.wrap(function jsonErrorMiddlewares$(context$2$0) {
			while (1) switch (context$2$0.prev = context$2$0.next) {
				case 0:
					context$2$0.prev = 0;
					context$2$0.next = 3;
					return next;

				case 3:
					context$2$0.next = 17;
					break;

				case 5:
					context$2$0.prev = 5;
					context$2$0.t19 = context$2$0['catch'](0);

					context$2$0.t19.expose = true;
					this.response.status = context$2$0.t19.status || 404;

					context$2$0.t20 = this.accepts('json', 'html', 'text');
					context$2$0.next = context$2$0.t20 === 'json' ? 12 : 15;
					break;

				case 12:
					this.type = 'json';
					this.body = { 'message': context$2$0.t19 ? context$2$0.t19.message : 'page not found', 'err': context$2$0.t19 };
					return context$2$0.abrupt('break', 17);

				case 15:
					this.body = context$2$0.t19 ? context$2$0.t19.message : 'page not found';
					return context$2$0.abrupt('break', 17);

				case 17:
				case 'end':
					return context$2$0.stop();
			}
		}, jsonErrorMiddlewares, this, [[0, 5]]);
	});
}

module.exports = exports['default'];