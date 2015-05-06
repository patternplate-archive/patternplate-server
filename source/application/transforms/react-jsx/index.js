import React from 'react';
import jsx from 'react-jsx';
import pascalCase from 'pascal-case';

export default function reactJSXTransformFactory (application) {
	const config = application.configuration.transforms['react-jsx'] || {};

	return async function reactJSXTransform (file, dependencies, demo) {
		let source = file.buffer.toString('utf-8');
		let sourceTemplate = jsx.server(source, {'raw': true});

		var data = {
			'props': {}
		};

		for (let dependencyName of Object.keys(dependencies)) {
			let dependencyBuffer = dependencies[dependencyName].source || dependencies[dependencyName].results.Markup.source;
			let dependencySource = dependencyBuffer.toString('utf-8');
			let dependecyTemplate = jsx.server(dependencySource, {'raw': true});

			data[pascalCase(dependencyName)] = React.createClass({
				'render': function renderDependencyTemplate () {
					return dependecyTemplate(this);
				}
			});
		}

		let result = sourceTemplate(data, {'html': true});

		file.buffer = new Buffer(result, 'utf-8');
		file.in = config.inFormat;
		file.out = config.outFormat;

		if (demo) {
			let demoTemplate = jsx.server(demo.buffer.toString('utf-8'), {'raw': true});
			let demoData = Object.assign(data, {
				'Pattern': React.createClass({
					'render': function renderSourceTemplate () {
						return sourceTemplate(data);
					}
				})
			});

			let demoResult = demoTemplate(demoData, {'html': true});

			file.demoSource = demo.source;
			file.demoBuffer = new Buffer(demoResult, 'utf-8');
		}

		return file;
	};
}
