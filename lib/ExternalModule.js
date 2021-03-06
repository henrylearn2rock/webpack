/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var Module = require("./Module");
var OriginalSource = require("webpack-core/lib/OriginalSource");
var RawSource = require("webpack-core/lib/RawSource");

function ExternalModule(request, type) {
	Module.call(this);
	this.request = request;
	this.type = type;
	this.built = false;
}
module.exports = ExternalModule;

ExternalModule.prototype = Object.create(Module.prototype);

ExternalModule.prototype.external = true;

ExternalModule.prototype.identifier = function() {
	return "external " + JSON.stringify(this.request);
};

ExternalModule.prototype.readableIdentifier = function(requestShortener) {
	return "external " + JSON.stringify(this.request);
};

ExternalModule.prototype.needRebuild = function(fileTimestamps, contextTimestamps) {
	return false;
};

ExternalModule.prototype.build = function(options, compilation, resolver, fs, callback) {
	this.builtTime = new Date().getTime();
	callback();
};

ExternalModule.prototype.source = function(dependencyTemplates, outputOptions, requestShortener) {
	var str = "throw new Error('Externals not supported');";
	var request = this.request;
	if(typeof request === "object") request = request[this.type];
	switch(this.type) {
	case "this":
	case "window":
	case "global":
		if(Array.isArray(request)) {
			str = "(function() { module.exports = " + this.type + request.map(function(r) {
				return "[" + JSON.stringify(r) + "]";
			}).join("") + "; }());";
		} else
			str = "(function() { module.exports = " + this.type + "[" + JSON.stringify(request) + "]; }());";
		break;
	case "commonjs":
	case "commonjs2":
		if(Array.isArray(request)) {
			str = "module.exports = require(" + JSON.stringify(request[0]) + ")" + request.slice(1).map(function(r) {
				return "[" + JSON.stringify(r) + "]";
			}).join("") + ";";
		} else 
			str = "module.exports = require(" + JSON.stringify(request) + ");";
		break;
	case "amd":
	case "umd":
		str = "module.exports = __WEBPACK_EXTERNAL_MODULE_" + this.id + "__;";
		break;
	default:
		str = "module.exports = " + request + ";";
		break;
	}
	if(this.useSourceMap) {
		return new OriginalSource(str, this.identifier());
	} else {
		return new RawSource(str);
	}
};

ExternalModule.prototype.size = function() {
	return 42;
};