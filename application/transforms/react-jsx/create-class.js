'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _pascalCase = require('pascal-case');

var _pascalCase2 = _interopRequireDefault(_pascalCase);

var _resolveDependencies = require('./resolve-dependencies');

var _resolveDependencies2 = _interopRequireDefault(_resolveDependencies);

function createClass(name, template, file) {
	var dependencyData = _resolveDependencies2['default'](file.dependencies);

	return _react2['default'].createClass({
		'displayName': _pascalCase2['default'](name),
		'render': function renderDependencyTemplate() {
			return template(Object.assign({}, this, dependencyData));
		}
	});
}

exports['default'] = createClass;
module.exports = exports['default'];