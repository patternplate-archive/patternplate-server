'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _gitRev = require('git-rev');

var _gitRev2 = _interopRequireDefault(_gitRev);

function wrap(fn) {
	return new Promise(function runWrapPromise(fulfill) {
		fn(fulfill);
	});
}

var git = {
	'short': function shortWrapper() {
		return wrap(_gitRev2['default'].short);
	},

	'long': function longWrapper() {
		return wrap(_gitRev2['default'].long);
	},

	'branch': function branchWrapper() {
		return wrap(_gitRev2['default'].branch);
	},

	'tag': function tagWrapper() {
		return wrap(_gitRev2['default'].tag);
	}
};

exports['default'] = git;
module.exports = exports['default'];