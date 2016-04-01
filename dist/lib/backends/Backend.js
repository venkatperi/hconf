var Backend,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

module.exports = Backend = (function() {
  function Backend(opts) {
    if (opts == null) {
      opts = {};
    }
    this.extend = __bind(this.extend, this);
    this.setObject = __bind(this.setObject, this);
    this.set = __bind(this.set, this);
    this.getObject = __bind(this.getObject, this);
    this.get = __bind(this.get, this);
    if (this.name == null) {
      throw new Error("missing option: name");
    }
  }

  Backend.prototype.get = function(name) {
    throw new Error("virtual function called");
  };

  Backend.prototype.getObject = function(name) {
    throw new Error("virtual function called");
  };

  Backend.prototype.set = function(name, value) {
    throw new Error("virtual function called");
  };

  Backend.prototype.setObject = function(name, value) {
    throw new Error("virtual function called");
  };

  Backend.prototype.extend = function(data) {
    throw new Error("virtual function called");
  };

  return Backend;

})();
