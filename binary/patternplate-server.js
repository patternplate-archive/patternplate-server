#!/usr/bin/env node --harmony

'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

require('babel-core/polyfill');

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _ = require('../');

var _2 = _interopRequireDefault(_);

var args = (0, _minimist2['default'])(process.argv.slice(1));

function start() {
	var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	var application, stop;
	return regeneratorRuntime.async(function start$(context$1$0) {
		while (1) switch (context$1$0.prev = context$1$0.next) {
			case 0:
				stop = function stop() {
					return regeneratorRuntime.async(function stop$(context$2$0) {
						while (1) switch (context$2$0.prev = context$2$0.next) {
							case 0:
								context$2$0.prev = 0;
								context$2$0.next = 3;
								return regeneratorRuntime.awrap(application.stop());

							case 3:
								process.exit(0);
								context$2$0.next = 10;
								break;

							case 6:
								context$2$0.prev = 6;
								context$2$0.t0 = context$2$0['catch'](0);

								application.log.error(context$2$0.t0);
								process.exit(1);

							case 10:
							case 'end':
								return context$2$0.stop();
						}
					}, null, this, [[0, 6]]);
				};

				application = undefined;
				context$1$0.prev = 2;
				context$1$0.next = 5;
				return regeneratorRuntime.awrap((0, _2['default'])(options));

			case 5:
				application = context$1$0.sent;
				context$1$0.next = 12;
				break;

			case 8:
				context$1$0.prev = 8;
				context$1$0.t0 = context$1$0['catch'](2);

				console.trace(context$1$0.t0);
				throw new Error(context$1$0.t0);

			case 12:
				context$1$0.prev = 12;
				context$1$0.next = 15;
				return regeneratorRuntime.awrap(application.start());

			case 15:
				context$1$0.next = 21;
				break;

			case 17:
				context$1$0.prev = 17;
				context$1$0.t1 = context$1$0['catch'](12);

				application.log.error(context$1$0.t1);
				throw new Error(context$1$0.t1);

			case 21:

				process.on('SIGINT', function () {
					return stop('SIGINT');
				});
				process.on('SIGHUP', function () {
					return stop('SIGHUP');
				});
				process.on('SIGQUIT', function () {
					return stop('SIGQUIT');
				});
				process.on('SIGABRT', function () {
					return stop('SIGABRT');
				});
				process.on('SIGTERM', function () {
					return stop('SIGTERM');
				});

			case 26:
			case 'end':
				return context$1$0.stop();
		}
	}, null, this, [[2, 8], [12, 17]]);
}

start(args);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NvdXJjZS9iaW5hcnkvcGF0dGVybnBsYXRlLXNlcnZlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsWUFBWSxDQUFDOzs7O1FBRU4scUJBQXFCOzt3QkFDUCxVQUFVOzs7O2dCQUVMLEtBQUs7Ozs7QUFFL0IsSUFBSSxJQUFJLEdBQUcsMkJBQVMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFM0MsU0FBZSxLQUFLO0tBQUUsT0FBTyx5REFBRyxFQUFFO0tBQzdCLFdBQVcsRUFnQkEsSUFBSTs7OztBQUFKLFFBQUksWUFBSixJQUFJOzs7Ozs7d0NBRVgsV0FBVyxDQUFDLElBQUksRUFBRTs7O0FBQ3hCLGVBQU8sQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLENBQUM7Ozs7Ozs7O0FBRWxCLG1CQUFXLENBQUMsR0FBRyxDQUFDLEtBQUssZ0JBQU8sQ0FBQztBQUM3QixlQUFPLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRSxDQUFDOzs7Ozs7Ozs7QUF0QmhCLGVBQVc7OztvQ0FHTSxtQkFBYyxPQUFPLENBQUM7OztBQUExQyxlQUFXOzs7Ozs7OztBQUVYLFdBQU8sQ0FBQyxLQUFLLGdCQUFLLENBQUM7VUFDYixJQUFJLEtBQUssZ0JBQUs7Ozs7O29DQUlkLFdBQVcsQ0FBQyxLQUFLLEVBQUU7Ozs7Ozs7Ozs7QUFFekIsZUFBVyxDQUFDLEdBQUcsQ0FBQyxLQUFLLGdCQUFLLENBQUM7VUFDckIsSUFBSSxLQUFLLGdCQUFLOzs7O0FBYXJCLFdBQU8sQ0FBQyxFQUFFLENBQUUsUUFBUSxFQUFFO1lBQU0sSUFBSSxDQUFFLFFBQVEsQ0FBRTtLQUFBLENBQUUsQ0FBQztBQUMvQyxXQUFPLENBQUMsRUFBRSxDQUFFLFFBQVEsRUFBRTtZQUFNLElBQUksQ0FBRSxRQUFRLENBQUU7S0FBQSxDQUFFLENBQUM7QUFDL0MsV0FBTyxDQUFDLEVBQUUsQ0FBRSxTQUFTLEVBQUU7WUFBTSxJQUFJLENBQUUsU0FBUyxDQUFFO0tBQUEsQ0FBRSxDQUFDO0FBQ2pELFdBQU8sQ0FBQyxFQUFFLENBQUUsU0FBUyxFQUFFO1lBQU0sSUFBSSxDQUFFLFNBQVMsQ0FBRTtLQUFBLENBQUUsQ0FBQztBQUNqRCxXQUFPLENBQUMsRUFBRSxDQUFFLFNBQVMsRUFBRTtZQUFNLElBQUksQ0FBRSxTQUFTLENBQUU7S0FBQSxDQUFFLENBQUM7Ozs7Ozs7Q0FDakQ7O0FBRUQsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDIiwiZmlsZSI6InBhdHRlcm5wbGF0ZS1zZXJ2ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0ICdiYWJlbC1jb3JlL3BvbHlmaWxsJztcbmltcG9ydCBtaW5pbWlzdCBmcm9tICdtaW5pbWlzdCc7XG5cbmltcG9ydCBwYXR0ZXJuU2VydmVyIGZyb20gJy4uLyc7XG5cbnZhciBhcmdzID0gbWluaW1pc3QocHJvY2Vzcy5hcmd2LnNsaWNlKDEpKTtcblxuYXN5bmMgZnVuY3Rpb24gc3RhcnQgKG9wdGlvbnMgPSB7fSkge1xuXHRsZXQgYXBwbGljYXRpb247XG5cblx0dHJ5IHtcblx0XHRhcHBsaWNhdGlvbiA9IGF3YWl0IHBhdHRlcm5TZXJ2ZXIob3B0aW9ucyk7XG5cdH0gY2F0Y2goZXJyKSB7XG5cdFx0Y29uc29sZS50cmFjZShlcnIpO1xuXHRcdHRocm93IG5ldyBFcnJvcihlcnIpO1xuXHR9XG5cblx0dHJ5IHtcblx0XHRhd2FpdCBhcHBsaWNhdGlvbi5zdGFydCgpO1xuXHR9IGNhdGNoKGVycikge1xuXHRcdGFwcGxpY2F0aW9uLmxvZy5lcnJvcihlcnIpO1xuXHRcdHRocm93IG5ldyBFcnJvcihlcnIpO1xuXHR9XG5cblx0YXN5bmMgZnVuY3Rpb24gc3RvcCAoKSB7XG5cdFx0dHJ5IHtcblx0XHRcdGF3YWl0IGFwcGxpY2F0aW9uLnN0b3AoKTtcblx0XHRcdHByb2Nlc3MuZXhpdCggMCApO1xuXHRcdH0gY2F0Y2ggKCBlcnIgKSB7XG5cdFx0XHRhcHBsaWNhdGlvbi5sb2cuZXJyb3IoIGVyciApO1xuXHRcdFx0cHJvY2Vzcy5leGl0KCAxICk7XG5cdFx0fVxuXHR9XG5cblx0cHJvY2Vzcy5vbiggJ1NJR0lOVCcsICgpID0+IHN0b3AoICdTSUdJTlQnICkgKTtcblx0cHJvY2Vzcy5vbiggJ1NJR0hVUCcsICgpID0+IHN0b3AoICdTSUdIVVAnICkgKTtcblx0cHJvY2Vzcy5vbiggJ1NJR1FVSVQnLCAoKSA9PiBzdG9wKCAnU0lHUVVJVCcgKSApO1xuXHRwcm9jZXNzLm9uKCAnU0lHQUJSVCcsICgpID0+IHN0b3AoICdTSUdBQlJUJyApICk7XG5cdHByb2Nlc3Mub24oICdTSUdURVJNJywgKCkgPT4gc3RvcCggJ1NJR1RFUk0nICkgKTtcbn1cblxuc3RhcnQoYXJncyk7XG4iXX0=