import * as React from 'react';
import compareSemver from 'compare-semver';

export default function () {
	return async file => {
		const hasReactDOM = compareSemver.gt(React.version, ['0.13.3']);

		const requireStatement = hasReactDOM ?
			`var ReactDOM = require('react-dom')` : '';

		const renderStatement = hasReactDOM ?
			'ReactDOM.render(mountableElement, mountElement);' :
			'React.render(mountableElement, mountElement);';

		const code = [
			requireStatement,
			`var mountableElement = React.createElement(module.exports);`,
			`var mountElement = document.querySelector('[data-mountpoint]');`,
			renderStatement
		].join('\n');

		file.buffer = `${file.buffer}\n${code}`;
		return file;
	};
}
