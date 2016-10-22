'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _cache = require('./library/cache');

var _cache2 = _interopRequireDefault(_cache);

var _pattern = require('./library/pattern');

var _pattern2 = _interopRequireDefault(_pattern);

var _transforms = require('./library/transforms');

var _transforms2 = _interopRequireDefault(_transforms);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = (() => {
	var _ref = _asyncToGenerator(function* (options) {
		const instance = {
			name: 'patternplate-server',
			start: function start() {
				console.log(options);
			}
		};

		instance.configuration = instance.transforms = yield (0, _transforms2.default)(instance);
		instance.pattern = yield (0, _pattern2.default)(instance);
		instance.cache = yield (0, _cache2.default)(instance);

		return instance;
	});

	return function (_x) {
		return _ref.apply(this, arguments);
	};
})();

module.exports = exports['default'];