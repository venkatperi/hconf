var Format, Json,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Format = require("./Format");

module.exports = Json = (function(_super) {
  __extends(Json, _super);

  Json.prototype.replacer = null;

  Json.prototype.spacing = 2;

  function Json(_arg) {
    this.replacer = _arg.replacer, this.spacing = _arg.spacing;
    this.parse = __bind(this.parse, this);
    this.stringify = __bind(this.stringify, this);
  }

  Json.prototype.stringify = function(obj) {
    return JSON.stringify(obj, this.replacer, this.spacing);
  };

  Json.prototype.parse = function(data) {
    return JSON.parse(data);
  };

  return Json;

})(Format);
