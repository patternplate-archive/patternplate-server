import React from 'react';
import jsx from 'react-jsx';
import pascalCase from 'pascal-case';

export default function reactJSXTransformFactory (application) {
	return async function reactJSXTransform (file, dependencies) {
		let source = file.buffer.toString('utf-8');
		let sourceTemplate = jsx.server(source, {'raw': true});

		let data = {
			'props': {}
		};

		for (let dependencyName of Object.keys(dependencies)) {
			let dependencySource = dependencies[dependencyName].source.toString('utf-8');
			let dependecyTemplate = jsx.server(dependencySource, {'raw': true})

			data[pascalCase(dependencyName)] = React.createClass({
				'render': function () {
					return dependecyTemplate(this)
				}
			});
		}

		let result = sourceTemplate(data, {'html': true});

		file.buffer = new Buffer(result, 'utf-8');
		return file;
	};
}
