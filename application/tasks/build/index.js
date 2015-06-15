'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _fs = require('fs');

var _qIoFs = require('q-io/fs');

var _qIoFs2 = _interopRequireDefault(_qIoFs);

var _archiver = require('archiver');

var _archiver2 = _interopRequireDefault(_archiver);

var _libraryUtilitiesGit = require('../../../library/utilities/git');

var _libraryUtilitiesGit2 = _interopRequireDefault(_libraryUtilitiesGit);

function build(application, config) {
	var patternHook, patternRoot, virtualPattern, outputBase, tmpBase, built, environment, mode, version, revision, branch, tag, meta, fragments, comment, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, resultName, result, contents, ext, path, archive, output;

	return regeneratorRuntime.async(function build$(context$1$0) {
		while (1) switch (context$1$0.prev = context$1$0.next) {
			case 0:
				patternHook = application.hooks.filter(function (hook) {
					return hook.name === 'patterns';
				})[0];
				patternRoot = (0, _path.resolve)(application.runtime.patterncwd || application.runtime.cwd, patternHook.configuration.path);
				context$1$0.next = 4;
				return regeneratorRuntime.awrap(application.pattern.factory('.tmp', patternRoot, application.configuration.patterns, application.transforms));

			case 4:
				virtualPattern = context$1$0.sent;
				context$1$0.next = 7;
				return regeneratorRuntime.awrap(virtualPattern.virtualize());

			case 7:
				context$1$0.prev = 7;
				context$1$0.next = 10;
				return regeneratorRuntime.awrap(virtualPattern.read());

			case 10:
				context$1$0.next = 12;
				return regeneratorRuntime.awrap(virtualPattern.transform(false, true));

			case 12:
				context$1$0.next = 17;
				break;

			case 14:
				context$1$0.prev = 14;
				context$1$0.t0 = context$1$0['catch'](7);
				throw context$1$0.t0;

			case 17:
				context$1$0.prev = 17;
				context$1$0.next = 20;
				return regeneratorRuntime.awrap(virtualPattern.clean());

			case 20:
				return context$1$0.finish(17);

			case 21:
				outputBase = (0, _path.resolve)(application.runtime.patterncwd || application.runtime.cwd, 'build');
				tmpBase = (0, _path.resolve)(application.runtime.patterncwd || application.runtime.cwd, '.tmp');
				context$1$0.next = 25;
				return regeneratorRuntime.awrap(_qIoFs2['default'].exists(tmpBase));

			case 25:
				if (!context$1$0.sent) {
					context$1$0.next = 28;
					break;
				}

				context$1$0.next = 28;
				return regeneratorRuntime.awrap(_qIoFs2['default'].removeTree(tmpBase));

			case 28:
				context$1$0.next = 30;
				return regeneratorRuntime.awrap(_qIoFs2['default'].makeTree(outputBase));

			case 30:
				context$1$0.next = 32;
				return regeneratorRuntime.awrap(_qIoFs2['default'].makeTree(tmpBase));

			case 32:
				built = new Date();
				environment = application.runtime.env;
				mode = application.runtime.mode;
				context$1$0.next = 37;
				return regeneratorRuntime.awrap(_libraryUtilitiesGit2['default'].tag());

			case 37:
				version = context$1$0.sent;
				context$1$0.next = 40;
				return regeneratorRuntime.awrap(_libraryUtilitiesGit2['default'].short());

			case 40:
				revision = context$1$0.sent;
				context$1$0.next = 43;
				return regeneratorRuntime.awrap(_libraryUtilitiesGit2['default'].branch());

			case 43:
				branch = context$1$0.sent;
				context$1$0.next = 46;
				return regeneratorRuntime.awrap(_libraryUtilitiesGit2['default'].tag());

			case 46:
				tag = context$1$0.sent;
				meta = { built: built, environment: environment, mode: mode, version: version, revision: revision, branch: branch, tag: tag };
				fragments = ['/**!'];
				comment = Object.keys(meta).reduce(function (results, fragmentName) {
					var name = '' + fragmentName[0].toUpperCase() + '' + fragmentName.slice(1);
					var value = meta[fragmentName];
					results.push(' * ' + name + ': ' + value);
					return results;
				}, fragments);

				comment.push(' **/');
				comment = comment.join('\n');

				_iteratorNormalCompletion = true;
				_didIteratorError = false;
				_iteratorError = undefined;
				context$1$0.prev = 55;
				_iterator = Object.keys(virtualPattern.results)[Symbol.iterator]();

			case 57:
				if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
					context$1$0.next = 70;
					break;
				}

				resultName = _step.value;
				result = virtualPattern.results[resultName];
				contents = result.buffer.toString('utf-8');
				ext = result.out;
				path = (0, _path.resolve)(tmpBase, ['index', ext].join('.'));

				application.log.info('[console:run] Writing ' + ext + ' to ' + path + ' ...');
				contents = '' + comment + '\n' + contents;

				context$1$0.next = 67;
				return regeneratorRuntime.awrap(_qIoFs2['default'].write(path, contents));

			case 67:
				_iteratorNormalCompletion = true;
				context$1$0.next = 57;
				break;

			case 70:
				context$1$0.next = 76;
				break;

			case 72:
				context$1$0.prev = 72;
				context$1$0.t1 = context$1$0['catch'](55);
				_didIteratorError = true;
				_iteratorError = context$1$0.t1;

			case 76:
				context$1$0.prev = 76;
				context$1$0.prev = 77;

				if (!_iteratorNormalCompletion && _iterator['return']) {
					_iterator['return']();
				}

			case 79:
				context$1$0.prev = 79;

				if (!_didIteratorError) {
					context$1$0.next = 82;
					break;
				}

				throw _iteratorError;

			case 82:
				return context$1$0.finish(79);

			case 83:
				return context$1$0.finish(76);

			case 84:
				archive = (0, _archiver2['default'])('zip');
				output = (0, _fs.createWriteStream)((0, _path.resolve)(outputBase, 'build-' + environment + '-' + revision + '-v' + version + '.zip'));

				archive.pipe(output);
				archive.directory(tmpBase, false);
				archive.finalize();

				return context$1$0.abrupt('return', new Promise(function (fulfill, reject) {
					output.on('close', fulfill);
					archive.on('error', reject);
				}));

			case 90:
			case 'end':
				return context$1$0.stop();
		}
	}, null, this, [[7, 14, 17, 21], [55, 72, 76, 84], [77,, 79, 83]]);
}

exports['default'] = build;
module.exports = exports['default'];