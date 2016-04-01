var Store, objnest,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

objnest = require("objnest");

module.exports = Store = (function() {
  function Store(_arg) {
    this.name = _arg.name, this.description = _arg.description, this.type = _arg.type;
    this.flatten = __bind(this.flatten, this);
    this.save = __bind(this.save, this);
    this.loadSync = __bind(this.loadSync, this);
    this.load = __bind(this.load, this);
    this.data = {};
    if (this.name == null) {
      throw new Error("missing option: name");
    }
    if (this.type == null) {
      throw new Error("missing option: type");
    }
  }

  Store.prototype.load = function() {};

  Store.prototype.loadSync = function() {};

  Store.prototype.save = function() {};

  Store.prototype.flatten = function() {
    return objnest.flatten(this.data);
  };

  return Store;

})();
