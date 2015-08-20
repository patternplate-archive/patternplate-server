let template = `
	var originalRequire = require;
	var __localDependencies__ = {
		$$localDependencies$$
	};
	var require = function(id) {
		if (__localDependencies__[id]) {
			var moduleScope = {exports:{}};
			__localDependencies__[id](moduleScope, moduleScope.exports, require);
			return moduleScope.exports;
		}
		return originalRequire(id);
	}
`;

export default template;
