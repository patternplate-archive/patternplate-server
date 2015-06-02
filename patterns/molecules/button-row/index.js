var atomButton = require('atom-button');

function demoDependencies() {
	atomButton();
	console.log('I should print things from atom-button.index')
}

module.exports = demoDependencies;
