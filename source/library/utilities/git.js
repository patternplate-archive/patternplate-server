import revision from 'git-rev';

function wrap (fn) {
	return new Promise(function runWrapPromise (fulfill) {
		fn(fulfill);
	});
}

const git = {
	'short': function shortWrapper () {
		return wrap(revision.short);
	},

	'long': function longWrapper () {
		return wrap(revision.long);
	},

	'branch': function branchWrapper () {
		return wrap(revision.branch);
	},

	'tag': function tagWrapper () {
		return wrap(revision.tag);
	}
};

export default git;
