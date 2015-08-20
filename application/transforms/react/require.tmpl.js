"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var template = "\n\tvar originalRequire = require;\n\tvar __localDependencies__ = {\n\t\t$$localDependencies$$\n\t};\n\tvar require = function(id) {\n\t\tif (__localDependencies__[id]) {\n\t\t\tvar moduleScope = {exports:{}};\n\t\t\t__localDependencies__[id](moduleScope, moduleScope.exports, require);\n\t\t\treturn moduleScope.exports;\n\t\t}\n\t\treturn originalRequire(id);\n\t}\n";

exports["default"] = template;
module.exports = exports["default"];