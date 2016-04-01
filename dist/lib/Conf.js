var Conf, FileStore, HOME_DIR, ObservableMap, Q, backends, minimatch, path, pkgInfo, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty;

FileStore = require("./stores/FileStore");

_ = require("underscore");

ObservableMap = require("observable-map");

minimatch = require("minimatch");

Q = require("q");

path = require("path");

pkgInfo = require("pkginfo-async");

HOME_DIR = process.env.HOME;

backends = {
  global: require("./backends/Global")
};

module.exports = Conf = (function() {
  function Conf(opts) {
    if (opts == null) {
      opts = {};
    }
    this.createBackend = __bind(this.createBackend, this);
    this.loadForModule = __bind(this.loadForModule, this);
    this.convention = __bind(this.convention, this);
    this.__fileStoreCreate = __bind(this.__fileStoreCreate, this);
    this.addStore = __bind(this.addStore, this);
    this.createStore = __bind(this.createStore, this);
    this.unwatchAll = __bind(this.unwatchAll, this);
    this.unwatch = __bind(this.unwatch, this);
    this.watch = __bind(this.watch, this);
    this.getObject = __bind(this.getObject, this);
    this.get = __bind(this.get, this);
    this.add = __bind(this.add, this);
    this.createBackend(opts.backend);
    this.ready = Q(true);
    this.stores = [];
  }

  Conf.prototype.add = function(store) {
    return this.ready = this.ready.then((function(_this) {
      return function() {
        return _this.createStore(store);
      };
    })(this)).then(this.addStore);
  };

  Conf.prototype.get = function(name) {
    return this.ready.then((function(_this) {
      return function() {
        return _this.backend.get(name);
      };
    })(this));
  };

  Conf.prototype.getObject = function(name) {
    return this.ready.then((function(_this) {
      return function() {
        return _this.backend.getObject(name);
      };
    })(this));
  };

  Conf.prototype.watch = function(keys, cb) {
    return this.backend.watch(keys, cb);
  };

  Conf.prototype.unwatch = function(keys, cb) {
    return this.backend.unwatch(keys, cb);
  };

  Conf.prototype.unwatchAll = function(keys) {
    return this.backend.unwatch(keys);
  };

  Conf.prototype.createStore = function(store) {
    var handler, _ref;
    if ((store != null ? store.type : void 0) != null) {
      handler = this["__" + (store.type.toLowerCase()) + "StoreCreate"];
    }
    if (!handler) {
      throw new Error("bad or missing type for store");
    }
    return (_ref = handler(store)) != null ? _ref.load() : void 0;
  };

  Conf.prototype.addStore = function(s) {
    var k, v, _ref, _results;
    if (s == null) {
      return;
    }
    this.stores.push(s);
    this.backend.extend(s.data);
    _ref = s.flatten();
    _results = [];
    for (k in _ref) {
      if (!__hasProp.call(_ref, k)) continue;
      v = _ref[k];
      _results.push(this.backend.set(k, v));
    }
    return _results;
  };

  Conf.prototype.__fileStoreCreate = function(store) {
    return new FileStore(store);
  };

  Conf.prototype.convention = function(opts) {
    return (function(_this) {
      return function(pkg) {
        var f, filename, name, _i, _len, _ref, _results;
        name = pkg.name;
        filename = opts.filename || ("." + name);
        _this.add({
          name: pkg.name,
          description: "factory defaults",
          type: 'file',
          file: path.join(pkg.dirname, filename)
        });
        _this.add({
          name: pkg.name,
          description: "user",
          type: 'file',
          file: path.join(HOME_DIR, filename)
        });
        if (opts.files != null) {
          if (!_.isArray(opts.files)) {
            opts.files = [opts.files];
          }
          _ref = opts.files;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            f = _ref[_i];
            _results.push(_this.add({
              name: pkg.name,
              description: "custom file",
              type: 'file',
              file: f
            }));
          }
          return _results;
        }
      };
    })(this);
  };

  Conf.prototype.loadForModule = function(opts) {
    if (opts == null) {
      opts = {};
    }
    if (opts.module == null) {
      throw new Error("missing option: module");
    }
    return this.ready = pkgInfo(opts.module).then(this.convention(opts));
  };

  Conf.prototype.createBackend = function(opts) {
    var b;
    if (opts == null) {
      opts = {
        type: "global"
      };
    }
    b = backends[opts.type];
    if (!b) {
      throw new Error("Unknown backend type: " + opts.type);
    }
    return this.backend = new b(opts);
  };

  return Conf;

})();
