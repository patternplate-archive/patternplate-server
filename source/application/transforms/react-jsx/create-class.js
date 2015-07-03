import React from 'react';
import pascalCase from 'pascal-case';
import merge from 'lodash.merge';

import resolveDependencies from './resolve-dependencies';

function createClass (name, template, file, configuration = {}) {
	let dependencyData = resolveDependencies(file.dependencies);
	merge(dependencyData, configuration);

	return React.createClass({
		'displayName': pascalCase(name),
		'render': function renderDependencyTemplate () {
			return template(Object.assign({}, this, dependencyData));
		}
	});
}

export default createClass;
