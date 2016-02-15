export default (application, configuration) => {
	return async function() {
		const {id} = this.params;
		this.type = 'js';
		this.body = `console.log('hello ${id}');`;
	}
};
