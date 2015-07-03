import jsx from 'react-jsx';
import pascalCase from 'pascal-case';

import createClass from './create-class';

function resolveDependencies (dependencies = {}, configuration = {}) {
	let data = {};

	for (let dependencyName of Object.keys(dependencies)) {
		let dependencyBuffer = dependencies[dependencyName].source;
		let dependencySource = dependencyBuffer.toString('utf-8');
		let dependecyTemplate = jsx.server(dependencySource, {'raw': true});
		data[pascalCase(dependencyName)] = createClass(dependencyName, dependecyTemplate, dependencies[dependencyName], configuration.opts);
	}

	return data;
}

export default resolveDependencies;
