var Backend, Conf, ManualTimer, Q, Seq, Store, asArray, conventions, custom, minimatch, path, pkgInfo, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

path = require("path");

_ = require("underscore");

minimatch = require("minimatch");

Q = require("q");

pkgInfo = require("pkginfo-async");

Seq = require("seqx");

ManualTimer = require("./utils/ManualTimer");

Backend = require("./backend");

Store = require("./store");

conventions = require("./conventions");

custom = require("./conventions/custom");

asArray = require('./utils/asArray');

Conf = (function() {
  function Conf(opts) {
    this.opts = opts != null ? opts : {};
    this.convention = __bind(this.convention, this);
    this.actualLoad = __bind(this.actualLoad, this);
    this.loadForModule = __bind(this.loadForModule, this);
    this.createStore = __bind(this.createStore, this);
    this.add = __bind(this.add, this);
    this.unwatchAll = __bind(this.unwatchAll, this);
    this.unwatch = __bind(this.unwatch, this);
    this.watch = __bind(this.watch, this);
    this.get = __bind(this.get, this);
    this.clear = __bind(this.clear, this);
    this.clear();
  }

  Conf.prototype.clear = function() {
    this.initialize = Q.defer();
    this.initialized = this.initialize.promise;
    this.seq = new Seq();
    this.backend = Backend.create({
      type: "global"
    });
    this.stores = new Set();
    this.sources = {};
    return this.initTimer = new ManualTimer(((function(_this) {
      return function() {
        return _this.initialize.resolve(true);
      };
    })(this)), 100);
  };

  Conf.prototype.get = function(name) {
    return this.initialized.then((function(_this) {
      return function() {
        return _this.backend.get(name);
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

  Conf.prototype.add = function(store, mod) {
    this.seq.add((function(_this) {
      return function() {
        return _this.createStore(store, mod);
      };
    })(this));
    return this.seq.add((function(_this) {
      return function(s) {
        if (s != null) {
          return _this.backend.extend(s.data);
        }
      };
    })(this));
  };

  Conf.prototype.createStore = function(opts, mod) {
    var s, uri;
    s = Store.create(opts);
    if (s == null) {
      return;
    }
    uri = s.uri();
    if (this.sources[uri] == null) {
      this.sources[uri] = [];
    }
    this.sources[uri].push(mod.filename || mod.id);
    if (this.stores.has(uri)) {
      return;
    }
    this.stores.add(uri);
    return s.load();
  };

  Conf.prototype.loadForModule = function(opts) {
    this.initTimer.stop();
    return this.actualLoad(opts);
  };

  Conf.prototype.actualLoad = function(opts) {
    if ((opts != null ? opts.module : void 0) == null) {
      throw new Error("missing option: module");
    }
    this.seq.add(function() {
      return pkgInfo(opts.module);
    });
    this.seq.add(this.convention(opts));
    return this.seq.add((function(_this) {
      return function() {
        return _this.initTimer.start();
      };
    })(this));
  };

  Conf.prototype.convention = function(opts) {
    return (function(_this) {
      return function(pkg) {
        var f, _i, _len, _ref, _results;
        conventions.forEach(function(c) {
          return _this.add(c({
            pkg: pkg,
            filename: opts.filename
          }), opts.module);
        });
        if (opts.files != null) {
          _ref = asArray(opts.files);
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            f = _ref[_i];
            _results.push(_this.add(custom({
              pkg: pkg,
              file: f
            }), opts.module));
          }
          return _results;
        }
      };
    })(this);
  };

  return Conf;

})();

module.exports = Conf;
