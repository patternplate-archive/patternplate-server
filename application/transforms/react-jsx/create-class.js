'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _pascalCase = require('pascal-case');

var _pascalCase2 = _interopRequireDefault(_pascalCase);

var _lodashMerge = require('lodash.merge');

var _lodashMerge2 = _interopRequireDefault(_lodashMerge);

var _resolveDependencies = require('./resolve-dependencies');

var _resolveDependencies2 = _interopRequireDefault(_resolveDependencies);

function createClass(name, template, file) {
	var configuration = arguments[3] === undefined ? {} : arguments[3];

	var dependencyData = (0, _resolveDependencies2['default'])(file.dependencies);
	(0, _lodashMerge2['default'])(dependencyData, configuration);

	return _react2['default'].createClass({
		'displayName': (0, _pascalCase2['default'])(name),
		'render': function renderDependencyTemplate() {
			return template(Object.assign({}, this, dependencyData));
		}
	});
}

exports['default'] = createClass;
module.exports = exports['default'];