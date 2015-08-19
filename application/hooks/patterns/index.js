'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _requireAll = require('require-all');

var _requireAll2 = _interopRequireDefault(_requireAll);

var _path = require('path');

var _qIoFs = require('q-io/fs');

var _qIoFs2 = _interopRequireDefault(_qIoFs);

var _patternCache = require('./pattern-cache');

var _patternCache2 = _interopRequireDefault(_patternCache);

var _pattern = require('./pattern');

var _pattern2 = _interopRequireDefault(_pattern);

var _libraryUtilitiesGetPatterns = require('../../../library/utilities/get-patterns');

var _libraryUtilitiesGetPatterns2 = _interopRequireDefault(_libraryUtilitiesGetPatterns);

function populate(application) {
	var config, id, cwd, base, factory, transforms, start, delta;
	return regeneratorRuntime.async(function populate$(context$1$0) {
		while (1) switch (context$1$0.prev = context$1$0.next) {
			case 0:
				config = {
					'patterns': application.configuration.patterns,
					'transforms': application.configuration.transforms
				};
				id = '.';
				cwd = application.runtime.patterncwd || application.runtime.cwd;
				base = (0, _path.resolve)(cwd, config.patterns.path);
				factory = application.pattern.factory;
				transforms = application.transforms;

				application.log.info('Populating cache from ' + base + '...');
				start = Date.now();
				context$1$0.next = 10;
				return regeneratorRuntime.awrap((0, _libraryUtilitiesGetPatterns2['default'])({
					id: id, config: config, base: base, factory: factory, transforms: transforms,
					'log': function log() {
						var _application$log;

						for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
							args[_key] = arguments[_key];
						}

						(_application$log = application.log).silly.apply(_application$log, ['[cache:pattern:getpattern]'].concat(args));
					}
				}, application.cache, false));

			case 10:
				delta = Date.now() - start / 1000;

				application.cache.ready = true;
				application.log.info('Populated cache from ' + base + ' in ' + delta + 's');

			case 13:
			case 'end':
				return context$1$0.stop();
		}
	}, null, this);
}

exports['default'] = {
	'wait': true,
	'after': ['hooks:log:start:after'],
	'start': function startPatternHook(application) {
		var transformPaths, transformFactories, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, transformPath, resolvedTransformPath, resolvedTransformFactories;

		return regeneratorRuntime.async(function startPatternHook$(context$1$0) {
			while (1) switch (context$1$0.prev = context$1$0.next) {
				case 0:
					application.pattern = {
						'factory': function factory() {
							for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
								args[_key2] = arguments[_key2];
							}

							return _pattern2['default'].apply(undefined, [].concat(args, [application.cache]));
						},
						'class': _pattern.Pattern
					};

					this.configuration.transformPath = Array.isArray(this.configuration.transformPath) ? this.configuration.transformPath : [this.configuration.transformPath];

					// TODO: Fix for mysteriously split last path, investigate
					this.configuration.transformPath = this.configuration.transformPath.filter(function (item) {
						return item.length > 1;
					});

					transformPaths = this.configuration.transformPath.reduce(function (items, item) {
						return items.concat(application.runtime.cwds.map(function (cwd) {
							return (0, _path.resolve)(cwd, item);
						}));
					}, []);
					transformFactories = {};
					_iteratorNormalCompletion = true;
					_didIteratorError = false;
					_iteratorError = undefined;
					context$1$0.prev = 8;
					_iterator = transformPaths[Symbol.iterator]();

				case 10:
					if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
						context$1$0.next = 22;
						break;
					}

					transformPath = _step.value;
					resolvedTransformPath = (0, _path.resolve)(application.runtime.cwd, transformPath);
					context$1$0.next = 15;
					return regeneratorRuntime.awrap(_qIoFs2['default'].exists(resolvedTransformPath));

				case 15:
					if (!context$1$0.sent) {
						context$1$0.next = 19;
						break;
					}

					this.log.silly('Importing transforms from: ' + resolvedTransformPath);
					resolvedTransformFactories = (0, _requireAll2['default'])({
						'dirname': resolvedTransformPath,
						'filter': /^(.*)\.(js|json)$/
					});

					Object.assign(transformFactories, resolvedTransformFactories);

				case 19:
					_iteratorNormalCompletion = true;
					context$1$0.next = 10;
					break;

				case 22:
					context$1$0.next = 28;
					break;

				case 24:
					context$1$0.prev = 24;
					context$1$0.t0 = context$1$0['catch'](8);
					_didIteratorError = true;
					_iteratorError = context$1$0.t0;

				case 28:
					context$1$0.prev = 28;
					context$1$0.prev = 29;

					if (!_iteratorNormalCompletion && _iterator['return']) {
						_iterator['return']();
					}

				case 31:
					context$1$0.prev = 31;

					if (!_didIteratorError) {
						context$1$0.next = 34;
						break;
					}

					throw _iteratorError;

				case 34:
					return context$1$0.finish(31);

				case 35:
					return context$1$0.finish(28);

				case 36:

					application.transforms = Object.keys(transformFactories).reduce(function getTransform(transforms, transformName) {
						if (typeof transformFactories[transformName].index === 'function') {
							application.log.info('[application:hook:patterns] Loading transform factory "' + transformName + '"');
							var fn = transformFactories[transformName].index(application);

							if (typeof fn !== 'function') {
								application.log.info('[application:hook:patterns] transform factory "' + transformName + '" did not return a valid transform.');
								return transforms;
							}

							application.log.info('[application:hook:patterns] transform "' + transformName + '" available.');
							transforms[transformName] = fn;
						}
						return transforms;
					}, {});

					if (this.configuration.cache) {
						application.cache = (0, _patternCache2['default'])(this.configuration.cache);
						application.cache.ready = !this.configuration.cache.populate;

						application.cache.staticRoot = (0, _path.resolve)(application.runtime.patterncwd || application.runtime.cwd, '.cache'); // TODO: Make this configurable

						if (this.configuration.cache.populate) {
							populate(application);
						}
					}

					return context$1$0.abrupt('return', this);

				case 39:
				case 'end':
					return context$1$0.stop();
			}
		}, null, this, [[8, 24, 28, 36], [29,, 31, 35]]);
	}
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NvdXJjZS9hcHBsaWNhdGlvbi9ob29rcy9wYXR0ZXJucy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OzswQkFBdUIsYUFBYTs7OztvQkFDZCxNQUFNOztxQkFDWixTQUFTOzs7OzRCQUVQLGlCQUFpQjs7Ozt1QkFDUixXQUFXOzs7OzJDQUVkLHlDQUF5Qzs7OztBQUVqRSxTQUFlLFFBQVEsQ0FBQyxXQUFXO0tBQzlCLE1BQU0sRUFLTixFQUFFLEVBQ0YsR0FBRyxFQUVILElBQUksRUFDSixPQUFPLEVBQ1AsVUFBVSxFQUdWLEtBQUssRUFTTCxLQUFLOzs7O0FBdEJMLFVBQU0sR0FBRztBQUNaLGVBQVUsRUFBRSxXQUFXLENBQUMsYUFBYSxDQUFDLFFBQVE7QUFDOUMsaUJBQVksRUFBRSxXQUFXLENBQUMsYUFBYSxDQUFDLFVBQVU7S0FDbEQ7QUFFRyxNQUFFLEdBQUcsR0FBRztBQUNSLE9BQUcsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLFVBQVUsSUFBSSxXQUFXLENBQUMsT0FBTyxDQUFDLEdBQUc7QUFFL0QsUUFBSSxHQUFHLG1CQUFRLEdBQUcsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztBQUN6QyxXQUFPLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxPQUFPO0FBQ3JDLGNBQVUsR0FBRyxXQUFXLENBQUMsVUFBVTs7QUFFdkMsZUFBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLDRCQUEwQixJQUFJLFNBQU0sQ0FBQztBQUNyRCxTQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRTs7b0NBRWhCLDhDQUFZO0FBQ2pCLE9BQUUsRUFBRixFQUFFLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFLE9BQU8sRUFBUCxPQUFPLEVBQUUsVUFBVSxFQUFWLFVBQVU7QUFDckMsVUFBSyxFQUFFLGVBQWtCOzs7d0NBQU4sSUFBSTtBQUFKLFdBQUk7OztBQUN0QiwwQkFBQSxX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SyxDQUFDLFdBQVcsQ0FBQyxDQUFDOztBQUU5RCxXQUFJLE9BQU8sRUFBRSxLQUFLLFVBQVUsRUFBRTtBQUM3QixtQkFBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLHFEQUFtRCxhQUFhLHlDQUFzQyxDQUFDO0FBQzNILGVBQU8sVUFBVSxDQUFDO1FBQ2xCOztBQUVELGtCQUFXLENBQUMsR0FBRyxDQUFDLElBQUksNkNBQTJDLGFBQWEsa0JBQWUsQ0FBQztBQUM1RixpQkFBVSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsQ0FBQztPQUMvQjtBQUNELGFBQU8sVUFBVSxDQUFDO01BQ2xCLEVBQUUsRUFBRSxDQUFDLENBQUM7O0FBRVIsU0FBSSxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRTtBQUM3QixpQkFBVyxDQUFDLEtBQUssR0FBRywrQkFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3BELGlCQUFXLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQzs7QUFFN0QsaUJBQVcsQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLG1CQUFRLFdBQVcsQ0FBQyxPQUFPLENBQUMsVUFBVSxJQUFJLFdBQVcsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDOztBQUU1RyxVQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRTtBQUN0QyxlQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7T0FDdEI7TUFDRDs7eUNBRU0sSUFBSTs7Ozs7OztFQUNYO0NBQ0QiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcmVxdWlyZUFsbCBmcm9tICdyZXF1aXJlLWFsbCc7XG5pbXBvcnQge3Jlc29sdmV9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IHFmcyBmcm9tICdxLWlvL2ZzJztcblxuaW1wb3J0IGNhY2hlIGZyb20gJy4vcGF0dGVybi1jYWNoZSc7XG5pbXBvcnQgcGF0dGVybkZhY3RvcnkgZnJvbSAnLi9wYXR0ZXJuJztcbmltcG9ydCB7UGF0dGVybn0gZnJvbSAnLi9wYXR0ZXJuJztcbmltcG9ydCBnZXRQYXR0ZXJucyBmcm9tICcuLi8uLi8uLi9saWJyYXJ5L3V0aWxpdGllcy9nZXQtcGF0dGVybnMnO1xuXG5hc3luYyBmdW5jdGlvbiBwb3B1bGF0ZShhcHBsaWNhdGlvbikge1xuXHRsZXQgY29uZmlnID0ge1xuXHRcdCdwYXR0ZXJucyc6IGFwcGxpY2F0aW9uLmNvbmZpZ3VyYXRpb24ucGF0dGVybnMsXG5cdFx0J3RyYW5zZm9ybXMnOiBhcHBsaWNhdGlvbi5jb25maWd1cmF0aW9uLnRyYW5zZm9ybXNcblx0fTtcblxuXHRsZXQgaWQgPSAnLic7XG5cdGxldCBjd2QgPSBhcHBsaWNhdGlvbi5ydW50aW1lLnBhdHRlcm5jd2QgfHwgYXBwbGljYXRpb24ucnVudGltZS5jd2Q7XG5cblx0bGV0IGJhc2UgPSByZXNvbHZlKGN3ZCwgY29uZmlnLnBhdHRlcm5zLnBhdGgpO1xuXHRsZXQgZmFjdG9yeSA9IGFwcGxpY2F0aW9uLnBhdHRlcm4uZmFjdG9yeTtcblx0bGV0IHRyYW5zZm9ybXMgPSBhcHBsaWNhdGlvbi50cmFuc2Zvcm1zO1xuXG5cdGFwcGxpY2F0aW9uLmxvZy5pbmZvKGBQb3B1bGF0aW5nIGNhY2hlIGZyb20gJHtiYXNlfS4uLmApO1xuXHRsZXQgc3RhcnQgPSBEYXRlLm5vdygpO1xuXG5cdGF3YWl0IGdldFBhdHRlcm5zKHtcblx0XHRpZCwgY29uZmlnLCBiYXNlLCBmYWN0b3J5LCB0cmFuc2Zvcm1zLFxuXHRcdCdsb2cnOiBmdW5jdGlvbiguLi5hcmdzKSB7XG5cdFx0XHRhcHBsaWNhdGlvbi5sb2cuc2lsbHkoLi4uWydbY2FjaGU6cGF0dGVybjpnZXRwYXR0ZXJuXScsIC4uLmFyZ3NdKTtcblx0XHR9XG5cdH0sIGFwcGxpY2F0aW9uLmNhY2hlLCBmYWxzZSk7XG5cblx0bGV0IGRlbHRhID0gRGF0ZS5ub3coKSAtIHN0YXJ0IC8gMTAwMDtcblxuXHRhcHBsaWNhdGlvbi5jYWNoZS5yZWFkeSA9IHRydWU7XG5cdGFwcGxpY2F0aW9uLmxvZy5pbmZvKGBQb3B1bGF0ZWQgY2FjaGUgZnJvbSAke2Jhc2V9IGluICR7ZGVsdGF9c2ApO1xufVxuXG5leHBvcnQgZGVmYXVsdCB7XG5cdCd3YWl0JzogdHJ1ZSxcblx0J2FmdGVyJzogWydob29rczpsb2c6c3RhcnQ6YWZ0ZXInXSxcblx0J3N0YXJ0JzogYXN5bmMgZnVuY3Rpb24gc3RhcnRQYXR0ZXJuSG9vayAoYXBwbGljYXRpb24pIHtcblx0XHRhcHBsaWNhdGlvbi5wYXR0ZXJuID0ge1xuXHRcdFx0J2ZhY3RvcnknOiAoLi4uYXJncykgPT4ge1xuXHRcdFx0XHRyZXR1cm4gcGF0dGVybkZhY3RvcnkoLi4uWy4uLmFyZ3MsIGFwcGxpY2F0aW9uLmNhY2hlXSk7XG5cdFx0XHR9LFxuXHRcdFx0J2NsYXNzJzogUGF0dGVyblxuXHRcdH07XG5cblx0XHR0aGlzLmNvbmZpZ3VyYXRpb24udHJhbnNmb3JtUGF0aCA9IEFycmF5LmlzQXJyYXkodGhpcy5jb25maWd1cmF0aW9uLnRyYW5zZm9ybVBhdGgpXG5cdFx0XHQ/IHRoaXMuY29uZmlndXJhdGlvbi50cmFuc2Zvcm1QYXRoXG5cdFx0XHQ6IFt0aGlzLmNvbmZpZ3VyYXRpb24udHJhbnNmb3JtUGF0aF07XG5cblx0XHQvLyBUT0RPOiBGaXggZm9yIG15c3RlcmlvdXNseSBzcGxpdCBsYXN0IHBhdGgsIGludmVzdGlnYXRlXG5cdFx0dGhpcy5jb25maWd1cmF0aW9uLnRyYW5zZm9ybVBhdGggPSB0aGlzLmNvbmZpZ3VyYXRpb24udHJhbnNmb3JtUGF0aC5maWx0ZXIoKGl0ZW0pID0+IGl0ZW0ubGVuZ3RoID4gMSk7XG5cblx0XHRsZXQgdHJhbnNmb3JtUGF0aHMgPSB0aGlzLmNvbmZpZ3VyYXRpb24udHJhbnNmb3JtUGF0aFxuXHRcdFx0LnJlZHVjZSgoaXRlbXMsIGl0ZW0pID0+IGl0ZW1zLmNvbmNhdChcblx0XHRcdFx0YXBwbGljYXRpb24ucnVudGltZS5jd2RzLm1hcCgoY3dkKSA9PiByZXNvbHZlKGN3ZCwgaXRlbSkpXG5cdFx0XHQpLCBbXSk7XG5cblx0XHRsZXQgdHJhbnNmb3JtRmFjdG9yaWVzID0ge307XG5cblx0XHRmb3IgKGxldCB0cmFuc2Zvcm1QYXRoIG9mIHRyYW5zZm9ybVBhdGhzKSB7XG5cdFx0XHRsZXQgcmVzb2x2ZWRUcmFuc2Zvcm1QYXRoID0gcmVzb2x2ZShhcHBsaWNhdGlvbi5ydW50aW1lLmN3ZCwgdHJhbnNmb3JtUGF0aCk7XG5cblx0XHRcdGlmIChhd2FpdCBxZnMuZXhpc3RzKHJlc29sdmVkVHJhbnNmb3JtUGF0aCkpIHtcblx0XHRcdFx0dGhpcy5sb2cuc2lsbHkoYEltcG9ydGluZyB0cmFuc2Zvcm1zIGZyb206ICR7cmVzb2x2ZWRUcmFuc2Zvcm1QYXRofWApO1xuXHRcdFx0XHRsZXQgcmVzb2x2ZWRUcmFuc2Zvcm1GYWN0b3JpZXMgPSByZXF1aXJlQWxsKHtcblx0XHRcdFx0XHQnZGlybmFtZSc6IHJlc29sdmVkVHJhbnNmb3JtUGF0aCxcblx0XHRcdFx0XHQnZmlsdGVyJzogL14oLiopXFwuKGpzfGpzb24pJC9cblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0T2JqZWN0LmFzc2lnbih0cmFuc2Zvcm1GYWN0b3JpZXMsIHJlc29sdmVkVHJhbnNmb3JtRmFjdG9yaWVzKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRhcHBsaWNhdGlvbi50cmFuc2Zvcm1zID0gT2JqZWN0LmtleXModHJhbnNmb3JtRmFjdG9yaWVzKVxuXHRcdFx0LnJlZHVjZShmdW5jdGlvbiBnZXRUcmFuc2Zvcm0gKHRyYW5zZm9ybXMsIHRyYW5zZm9ybU5hbWUpIHtcblx0XHRcdFx0aWYgKHR5cGVvZiB0cmFuc2Zvcm1GYWN0b3JpZXNbdHJhbnNmb3JtTmFtZV0uaW5kZXggPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHRhcHBsaWNhdGlvbi5sb2cuaW5mbyhgW2FwcGxpY2F0aW9uOmhvb2s6cGF0dGVybnNdIExvYWRpbmcgdHJhbnNmb3JtIGZhY3RvcnkgXCIke3RyYW5zZm9ybU5hbWV9XCJgKTtcblx0XHRcdFx0XHRsZXQgZm4gPSB0cmFuc2Zvcm1GYWN0b3JpZXNbdHJhbnNmb3JtTmFtZV0uaW5kZXgoYXBwbGljYXRpb24pO1xuXG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBmbiAhPT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdFx0YXBwbGljYXRpb24ubG9nLmluZm8oYFthcHBsaWNhdGlvbjpob29rOnBhdHRlcm5zXSB0cmFuc2Zvcm0gZmFjdG9yeSBcIiR7dHJhbnNmb3JtTmFtZX1cIiBkaWQgbm90IHJldHVybiBhIHZhbGlkIHRyYW5zZm9ybS5gKTtcblx0XHRcdFx0XHRcdHJldHVybiB0cmFuc2Zvcm1zO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGFwcGxpY2F0aW9uLmxvZy5pbmZvKGBbYXBwbGljYXRpb246aG9vazpwYXR0ZXJuc10gdHJhbnNmb3JtIFwiJHt0cmFuc2Zvcm1OYW1lfVwiIGF2YWlsYWJsZS5gKTtcblx0XHRcdFx0XHR0cmFuc2Zvcm1zW3RyYW5zZm9ybU5hbWVdID0gZm47XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRyYW5zZm9ybXM7XG5cdFx0XHR9LCB7fSk7XG5cblx0XHRpZiAodGhpcy5jb25maWd1cmF0aW9uLmNhY2hlKSB7XG5cdFx0XHRhcHBsaWNhdGlvbi5jYWNoZSA9IGNhY2hlKHRoaXMuY29uZmlndXJhdGlvbi5jYWNoZSk7XG5cdFx0XHRhcHBsaWNhdGlvbi5jYWNoZS5yZWFkeSA9ICF0aGlzLmNvbmZpZ3VyYXRpb24uY2FjaGUucG9wdWxhdGU7XG5cblx0XHRcdGFwcGxpY2F0aW9uLmNhY2hlLnN0YXRpY1Jvb3QgPSByZXNvbHZlKGFwcGxpY2F0aW9uLnJ1bnRpbWUucGF0dGVybmN3ZCB8fCBhcHBsaWNhdGlvbi5ydW50aW1lLmN3ZCwgJy5jYWNoZScpOyAvLyBUT0RPOiBNYWtlIHRoaXMgY29uZmlndXJhYmxlXG5cblx0XHRcdGlmICh0aGlzLmNvbmZpZ3VyYXRpb24uY2FjaGUucG9wdWxhdGUpIHtcblx0XHRcdFx0cG9wdWxhdGUoYXBwbGljYXRpb24pO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG59O1xuIl19