/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var ModuleDependency = require("./ModuleDependency");

function ModuleHotAcceptDependency(request, range) {
	ModuleDependency.call(this, request);
	this.Class = ModuleHotAcceptDependency;
	this.range = range;
}
module.exports = ModuleHotAcceptDependency;

ModuleHotAcceptDependency.prototype = Object.create(ModuleDependency.prototype);
ModuleHotAcceptDependency.prototype.type = "module.hot.accept";

ModuleHotAcceptDependency.Template = require("./ModuleDependencyTemplateAsId");
