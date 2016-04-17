var Store, TypedClass,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

TypedClass = require("../TypedClass");

module.exports = Store = (function(_super) {
  __extends(Store, _super);

  function Store(_arg) {
    this.name = _arg.name, this.description = _arg.description, this.type = _arg.type;
    this.requestedFrom = __bind(this.requestedFrom, this);
    this.saveSync = __bind(this.saveSync, this);
    this.save = __bind(this.save, this);
    this.loadSync = __bind(this.loadSync, this);
    this.load = __bind(this.load, this);
    this.uri = __bind(this.uri, this);
    if (this.name == null) {
      throw new Error("missing option: name");
    }
    if (this.type == null) {
      throw new Error("missing option: type");
    }
    this.data = {};
    this.originators = [];
  }

  Store.prototype.uri = function() {
    return "" + this.name + ":" + this.type;
  };

  Store.prototype.load = function() {};

  Store.prototype.loadSync = function() {};

  Store.prototype.save = function() {};

  Store.prototype.saveSync = function() {};

  Store.prototype.requestedFrom = function(mod) {
    var filename;
    filename = typeof mod === "string" ? mod : mod.filename || mod.id;
    return this.originators.push(filename);
  };

  Store.create = function(opt) {
    return Store.__super__.constructor.create.call(this, opt, __dirname);
  };

  return Store;

})(TypedClass);
