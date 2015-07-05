import React from 'react';
import pascalCase from 'pascal-case';
import merge from 'lodash.merge';

import resolveDependencies from './resolve-dependencies';

function createClass (name, template, file, opts = {}) {
	let dependencyData = resolveDependencies(file.dependencies, opts);
	merge(dependencyData, opts);

	return React.createClass({
		'displayName': pascalCase(name),
		'render': function renderDependencyTemplate () {
			return template(Object.assign({}, this, dependencyData));
		}
	});
}

export default createClass;
