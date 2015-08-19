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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NvdXJjZS9saWJyYXJ5L3V0aWxpdGllcy9naXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7c0JBQXFCLFNBQVM7Ozs7QUFFOUIsU0FBUyxJQUFJLENBQUUsRUFBRSxFQUFFO0FBQ2xCLFFBQU8sSUFBSSxPQUFPLENBQUMsU0FBUyxjQUFjLENBQUUsT0FBTyxFQUFFO0FBQ3BELElBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQztFQUNaLENBQUMsQ0FBQztDQUNIOztBQUVELElBQU0sR0FBRyxHQUFHO0FBQ1gsUUFBTyxFQUFFLFNBQVMsWUFBWSxHQUFJO0FBQ2pDLFNBQU8sSUFBSSxDQUFDLG9CQUFTLEtBQUssQ0FBQyxDQUFDO0VBQzVCOztBQUVELE9BQU0sRUFBRSxTQUFTLFdBQVcsR0FBSTtBQUMvQixTQUFPLElBQUksQ0FBQyxvQkFBUyxJQUFJLENBQUMsQ0FBQztFQUMzQjs7QUFFRCxTQUFRLEVBQUUsU0FBUyxhQUFhLEdBQUk7QUFDbkMsU0FBTyxJQUFJLENBQUMsb0JBQVMsTUFBTSxDQUFDLENBQUM7RUFDN0I7O0FBRUQsTUFBSyxFQUFFLFNBQVMsVUFBVSxHQUFJO0FBQzdCLFNBQU8sSUFBSSxDQUFDLG9CQUFTLEdBQUcsQ0FBQyxDQUFDO0VBQzFCO0NBQ0QsQ0FBQzs7cUJBRWEsR0FBRyIsImZpbGUiOiJnaXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcmV2aXNpb24gZnJvbSAnZ2l0LXJldic7XG5cbmZ1bmN0aW9uIHdyYXAgKGZuKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiBydW5XcmFwUHJvbWlzZSAoZnVsZmlsbCkge1xuXHRcdGZuKGZ1bGZpbGwpO1xuXHR9KTtcbn1cblxuY29uc3QgZ2l0ID0ge1xuXHQnc2hvcnQnOiBmdW5jdGlvbiBzaG9ydFdyYXBwZXIgKCkge1xuXHRcdHJldHVybiB3cmFwKHJldmlzaW9uLnNob3J0KTtcblx0fSxcblxuXHQnbG9uZyc6IGZ1bmN0aW9uIGxvbmdXcmFwcGVyICgpIHtcblx0XHRyZXR1cm4gd3JhcChyZXZpc2lvbi5sb25nKTtcblx0fSxcblxuXHQnYnJhbmNoJzogZnVuY3Rpb24gYnJhbmNoV3JhcHBlciAoKSB7XG5cdFx0cmV0dXJuIHdyYXAocmV2aXNpb24uYnJhbmNoKTtcblx0fSxcblxuXHQndGFnJzogZnVuY3Rpb24gdGFnV3JhcHBlciAoKSB7XG5cdFx0cmV0dXJuIHdyYXAocmV2aXNpb24udGFnKTtcblx0fVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2l0O1xuIl19