'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = JSONErrorFactory;

function JSONErrorFactory(application) {
	return regeneratorRuntime.mark(function jsonErrorMiddlewares(next) {
		var message, text;
		return regeneratorRuntime.wrap(function jsonErrorMiddlewares$(context$2$0) {
			while (1) switch (context$2$0.prev = context$2$0.next) {
				case 0:
					context$2$0.prev = 0;
					context$2$0.next = 3;
					return next;

				case 3:
					context$2$0.next = 21;
					break;

				case 5:
					context$2$0.prev = 5;
					context$2$0.t13 = context$2$0['catch'](0);

					context$2$0.t13.expose = true;
					this.response.status = context$2$0.t13.status || 404;

					message = ['Error', context$2$0.t13.pattern ? 'in "' + context$2$0.t13.pattern + '"' : '', context$2$0.t13.transform ? 'during transform "' + context$2$0.t13.transform + '" of' : '', context$2$0.t13.file ? '"' + context$2$0.t13.file + '":' : 'unknown file:', context$2$0.t13.message ? context$2$0.t13.message : ''].filter(function (item) {
						return item;
					}).join(' ');

					application.log.error(message);
					application.log.debug(context$2$0.t13.stack ? context$2$0.t13.stack : new Error(context$2$0.t13).stack);

					context$2$0.t14 = this.accepts('json', 'html', 'text');
					context$2$0.next = context$2$0.t14 === 'json' ? 15 : 18;
					break;

				case 15:
					this.type = 'json';
					this.body = {
						'message': message,
						'pattern': context$2$0.t13.pattern,
						'transform': context$2$0.t13.transform,
						'file': context$2$0.t13.file,
						'stack': context$2$0.t13.stack
					};
					return context$2$0.abrupt('break', 21);

				case 18:
					text = ['Message: ' + message, 'Pattern: ' + context$2$0.t13.pattern, 'Transform: ' + context$2$0.t13.transform, 'File: ' + context$2$0.t13.file, context$2$0.t13.stack].join('\n');

					this.body = text;
					return context$2$0.abrupt('break', 21);

				case 21:
				case 'end':
					return context$2$0.stop();
			}
		}, jsonErrorMiddlewares, this, [[0, 5]]);
	});
}

module.exports = exports['default'];