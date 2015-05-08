import jsx from 'react-jsx';
import pascalCase from 'pascal-case';

import createClass from './create-class';

function resolveDependencies (dependencies = {}) {
	let data = {};

	for (let dependencyName of Object.keys(dependencies)) {
		let dependencyBuffer = dependencies[dependencyName].source || dependencies[dependencyName].results.Markup.source;
		let dependencySource = dependencyBuffer.toString('utf-8');
		let dependecyTemplate = jsx.server(dependencySource, {'raw': true});
		data[pascalCase(dependencyName)] = createClass(dependencyName, dependecyTemplate, dependencies[dependencyName]);
	}

	return data;
}

export default resolveDependencies;
