import React from 'react';
import pascalCase from 'pascal-case';

import resolveDependencies from './resolve-dependencies';

function createClass (name, template, file) {
	let dependencyData = resolveDependencies(file.dependencies);

	return React.createClass({
		'displayName': pascalCase(name),
		'render': function renderDependencyTemplate () {
			return template(Object.assign({}, this, dependencyData));
		}
	});
}

export default createClass;
