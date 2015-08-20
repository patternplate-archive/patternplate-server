import * as React from 'react';
import Button from 'button';

export default class TestReact extends React.Component {
	render() {
		let classname = ['some-class'].join(' ').trim();

		return (
			<div className={classname} a="b">
				<Button />
			</div>
		);
	}
}
