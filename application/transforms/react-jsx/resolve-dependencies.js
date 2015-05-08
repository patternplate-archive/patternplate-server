'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _reactJsx = require('react-jsx');

var _reactJsx2 = _interopRequireDefault(_reactJsx);

var _pascalCase = require('pascal-case');

var _pascalCase2 = _interopRequireDefault(_pascalCase);

var _createClass = require('./create-class');

var _createClass2 = _interopRequireDefault(_createClass);

function resolveDependencies() {
	var dependencies = arguments[0] === undefined ? {} : arguments[0];

	var data = {};

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = Object.keys(dependencies)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var dependencyName = _step.value;

			var dependencyBuffer = dependencies[dependencyName].source || dependencies[dependencyName].results.Markup.source;
			var dependencySource = dependencyBuffer.toString('utf-8');
			var dependecyTemplate = _reactJsx2['default'].server(dependencySource, { 'raw': true });
			data[_pascalCase2['default'](dependencyName)] = _createClass2['default'](dependencyName, dependecyTemplate, dependencies[dependencyName]);
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator['return']) {
				_iterator['return']();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	return data;
}

exports['default'] = resolveDependencies;
module.exports = exports['default'];