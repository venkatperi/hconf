var Backend, TypedClass,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

TypedClass = require("../TypedClass");

module.exports = Backend = (function(_super) {
  __extends(Backend, _super);

  function Backend() {
    this.dump = __bind(this.dump, this);
    this.extend = __bind(this.extend, this);
    this.set = __bind(this.set, this);
    this.get = __bind(this.get, this);
    if (this.name == null) {
      throw new Error("missing option: name");
    }
  }

  Backend.prototype.get = function(name) {
    throw new Error("virtual function called");
  };

  Backend.prototype.set = function(name, value) {
    throw new Error("virtual function called");
  };

  Backend.prototype.extend = function(from) {
    throw new Error("virtual function called");
  };

  Backend.prototype.dump = function() {
    throw new Error("virtual function called");
  };

  Backend.create = function(opt) {
    return Backend.__super__.constructor.create.call(this, opt, __dirname);
  };

  return Backend;

})(TypedClass);
