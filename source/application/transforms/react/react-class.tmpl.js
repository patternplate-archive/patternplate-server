const template = `
	let React = require('react');
	$$dependencies$$

	export default class $$class-name$$ extends React.Component {
		render() {
			$$render-code$$
		}
	}
`;

export default template;
