"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var template = "\nvar originalRequire = require;\nvar __localDependencies__ = {\n\t$$localDependencies$$\n};\nvar require = function(id) {\n\tif (__localDependencies__[id]) {\n\t\tvar moduleScope = {exports:{}};\n\t\t__localDependencies__[id](moduleScope, moduleScope.exports, require);\n\t\treturn moduleScope.exports;\n\t}\n\treturn originalRequire(id);\n}\n";

exports["default"] = template;
module.exports = exports["default"];