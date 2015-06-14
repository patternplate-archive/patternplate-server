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
				version = application.configuration.pkg.version;
				context$1$0.next = 38;
				return regeneratorRuntime.awrap(_libraryUtilitiesGit2['default'].short());

			case 38:
				revision = context$1$0.sent;
				context$1$0.next = 41;
				return regeneratorRuntime.awrap(_libraryUtilitiesGit2['default'].branch());

			case 41:
				branch = context$1$0.sent;
				context$1$0.next = 44;
				return regeneratorRuntime.awrap(_libraryUtilitiesGit2['default'].tag());

			case 44:
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
				context$1$0.prev = 53;
				_iterator = Object.keys(virtualPattern.results)[Symbol.iterator]();

			case 55:
				if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
					context$1$0.next = 68;
					break;
				}

				resultName = _step.value;
				result = virtualPattern.results[resultName];
				contents = result.buffer.toString('utf-8');
				ext = result.out;
				path = (0, _path.resolve)(tmpBase, ['index', ext].join('.'));

				application.log.info('[console:run] Writing ' + ext + ' to ' + path + ' ...');
				contents = '' + comment + '\n' + contents;

				context$1$0.next = 65;
				return regeneratorRuntime.awrap(_qIoFs2['default'].write(path, contents));

			case 65:
				_iteratorNormalCompletion = true;
				context$1$0.next = 55;
				break;

			case 68:
				context$1$0.next = 74;
				break;

			case 70:
				context$1$0.prev = 70;
				context$1$0.t1 = context$1$0['catch'](53);
				_didIteratorError = true;
				_iteratorError = context$1$0.t1;

			case 74:
				context$1$0.prev = 74;
				context$1$0.prev = 75;

				if (!_iteratorNormalCompletion && _iterator['return']) {
					_iterator['return']();
				}

			case 77:
				context$1$0.prev = 77;

				if (!_didIteratorError) {
					context$1$0.next = 80;
					break;
				}

				throw _iteratorError;

			case 80:
				return context$1$0.finish(77);

			case 81:
				return context$1$0.finish(74);

			case 82:
				archive = (0, _archiver2['default'])('zip');
				output = (0, _fs.createWriteStream)((0, _path.resolve)(outputBase, 'build-' + version + '.zip'));

				archive.pipe(output);
				archive.directory(tmpBase, false);
				archive.finalize();

				return context$1$0.abrupt('return', new Promise(function (fulfill, reject) {
					output.on('close', fulfill);
					archive.on('error', reject);
				}));

			case 88:
			case 'end':
				return context$1$0.stop();
		}
	}, null, this, [[7, 14, 17, 21], [53, 70, 74, 82], [75,, 77, 81]]);
}

exports['default'] = build;
module.exports = exports['default'];