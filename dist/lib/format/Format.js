var Format, TypedClass,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

TypedClass = require("../TypedClass");

module.exports = Format = (function(_super) {
  __extends(Format, _super);

  function Format(opts) {
    this.parse = __bind(this.parse, this);
    this.stringify = __bind(this.stringify, this);
  }

  Format.prototype.stringify = function(obj) {
    throw new Error("virtual function called");
  };

  Format.prototype.parse = function(data) {
    throw new Error("virtual function called");
  };

  Format.create = function(opt) {
    return Format.__super__.constructor.create.call(this, opt, __dirname);
  };

  return Format;

})(TypedClass);
