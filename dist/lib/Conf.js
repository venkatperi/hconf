var Backend, Conf, EventEmitter, ManualTimer, Q, Seq, StoreCollection, asArray, conventions, custom, minimatch, path, pkgInfo, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

path = require("path");

_ = require("underscore");

minimatch = require("minimatch");

Q = require("q");

pkgInfo = require("pkginfo-async");

Seq = require("seqx");

ManualTimer = require("./utils/ManualTimer");

Backend = require("./backend");

conventions = require("./conventions");

custom = require("./conventions/custom");

asArray = require('./utils/asArray');

StoreCollection = require("./store/StoreCollection");

EventEmitter = require('events').EventEmitter;

Conf = (function(_super) {
  __extends(Conf, _super);

  function Conf(opts) {
    this.opts = opts != null ? opts : {};
    this.onLoaded = __bind(this.onLoaded, this);
    this.merge = __bind(this.merge, this);
    this.createDeps = __bind(this.createDeps, this);
    this.convention = __bind(this.convention, this);
    this.actualLoad = __bind(this.actualLoad, this);
    this.loadForModule = __bind(this.loadForModule, this);
    this.add = __bind(this.add, this);
    this.unwatchAll = __bind(this.unwatchAll, this);
    this.unwatch = __bind(this.unwatch, this);
    this.watch = __bind(this.watch, this);
    this.dump = __bind(this.dump, this);
    this.get = __bind(this.get, this);
    this.clear = __bind(this.clear, this);
    this.clear();
  }

  Conf.prototype.clear = function() {
    this.initializing = Q.defer();
    this.initialized = this.initializing.promise;
    this.seq = new Seq();
    this.backend = Backend.create({
      type: "global"
    });
    this.backend.clear();
    this.stores = new StoreCollection();
    return this.loadingTimer = new ManualTimer(this.onLoaded, 100);
  };

  Conf.prototype.get = function() {
    var name;
    name = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return this.initialized.then((function(_this) {
      return function() {
        var n, res;
        res = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = name.length; _i < _len; _i++) {
            n = name[_i];
            _results.push(this.backend.get(n));
          }
          return _results;
        }).call(_this);
        if (name.length === 1) {
          return res[0];
        } else {
          return res;
        }
      };
    })(this));
  };

  Conf.prototype.dump = function() {
    return this.initialized.then((function(_this) {
      return function() {
        var x;
        x = {
          stores: _this.stores.dump(),
          merged: _this.backend.dump()
        };
        return JSON.stringify(x, null, 2);
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
        return _this.stores.add(store, mod);
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

  Conf.prototype.loadForModule = function(opts) {
    this.loadingTimer.stop();
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
        return _this.loadingTimer.start();
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

  Conf.prototype.createDeps = function() {
    var all, allDeps, modules, s, uri, _ref;
    return Q();
    all = [];
    allDeps = new Set();
    modules = new Set();
    _ref = this.stores.stores;
    for (uri in _ref) {
      if (!__hasProp.call(_ref, uri)) continue;
      s = _ref[uri];
      modules.add(s.originators);
    }
    modules.forEach(function(m) {
      var defer;
      defer = Q.defer();
      all.push(defer.promise);
      return dependson(m).on("ready", function() {
        this.names.forEach(function(n) {
          return allDeps.add;
        });
        return defer.resolve(true);
      });
    });
    return Q.all(all).then(function() {
      return allDeps;
    });
  };

  Conf.prototype.merge = function() {
    var s, uri, _ref;
    _ref = this.stores.stores;
    for (uri in _ref) {
      if (!__hasProp.call(_ref, uri)) continue;
      s = _ref[uri];
      this.backend.extend(s.data);
    }
    return;
    return this.createDeps().then((function(_this) {
      return function() {
        var all;
        all = (function() {
          var _ref1, _results;
          _ref1 = this.stores.stores;
          _results = [];
          for (uri in _ref1) {
            if (!__hasProp.call(_ref1, uri)) continue;
            s = _ref1[uri];
            _results.push(Q.fcall(this.backend.extend, s.data));
          }
          return _results;
        }).call(_this);
        return Q.all(all);
      };
    })(this));
  };

  Conf.prototype.onLoaded = function() {
    this.initializing.resolve(true);
    this.emit("ready");
    return;
    return Q.fcall(this.merge).then((function(_this) {
      return function() {
        _this.initializing.resolve(true);
        return _this.emit("ready");
      };
    })(this)).fail((function(_this) {
      return function(err) {
        console.log(err);
        return _this.emit("error", err);
      };
    })(this));
  };

  return Conf;

})(EventEmitter);

module.exports = Conf;
