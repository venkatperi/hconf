var Q, Store, StoreCollection, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Store = require("./Store");

Q = require("q");

_ = require("underscore");

module.exports = StoreCollection = (function() {
  function StoreCollection() {
    this.dump = __bind(this.dump, this);
    this.add = __bind(this.add, this);
    this.get = __bind(this.get, this);
    this.has = __bind(this.has, this);
    this.stores = {};
    this[Symbol.Iterator] = this.stores[Symbol.Iterator];
  }

  StoreCollection.prototype.has = function(uri) {
    return this.stores[uri] != null;
  };

  StoreCollection.prototype.get = function(uri) {
    return this.stores[uri];
  };

  StoreCollection.prototype.add = function(opts, mod) {
    var s, uri;
    s = Store.create(opts);
    if (s == null) {
      return;
    }
    s.requestedFrom(mod);
    uri = s.uri();
    if (this.stores[uri] == null) {
      this.stores[uri] = s;
      return s.load();
    } else {
      this.stores[uri].requestedFrom(mod);
      return Q(s);
    }
  };

  StoreCollection.prototype.dump = function() {
    return this.stores;
  };

  return StoreCollection;

})();
