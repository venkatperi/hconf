var Backend, Global, ObservableMap, data, data2, isGlob, minimatch, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require("underscore");

ObservableMap = require("observable-map");

minimatch = require("minimatch");

Backend = require('./Backend');

isGlob = function(key) {
  return /[\*\+\{\}]/.test;
};

if (global.hconf == null) {
  global.hconf = {
    global: {
      data: new ObservableMap(),
      data2: {}
    }
  };
}

data = global.hconf.global.data;

data2 = global.hconf.global.data2;

Global = (function(_super) {
  __extends(Global, _super);

  function Global() {
    this.getGlobWatchers = __bind(this.getGlobWatchers, this);
    this.getWatchers = __bind(this.getWatchers, this);
    this.onDataChanged = __bind(this.onDataChanged, this);
    this.unwatchAll = __bind(this.unwatchAll, this);
    this.unwatch = __bind(this.unwatch, this);
    this.watch = __bind(this.watch, this);
    this.getObject = __bind(this.getObject, this);
    this.extend = __bind(this.extend, this);
    this.set = __bind(this.set, this);
    this.get = __bind(this.get, this);
    this.watchers = {};
    this.globWatchers = {};
    data.on("change", this.onDataChanged);
  }

  Global.prototype.get = function(name) {
    return data.get(name);
  };

  Global.prototype.set = function(name, value) {
    return data.set(name, value);
  };

  Global.prototype.extend = function(d) {
    return global.hconf.global.data2 = _.extend(data2, d);
  };

  Global.prototype.getObject = function(name) {
    var d, p, parts, _i, _len;
    parts = name.split(".");
    d = data2;
    for (_i = 0, _len = parts.length; _i < _len; _i++) {
      p = parts[_i];
      d = d[p];
    }
    return d;
  };

  Global.prototype.watch = function(keys, cb) {
    var k, _i, _len;
    if (!_.isArray(keys)) {
      keys = [keys];
    }
    for (_i = 0, _len = keys.length; _i < _len; _i++) {
      k = keys[_i];
      if (isGlob(k)) {
        return this.getGlobWatchers(k).add(cb);
      }
      this.getWatchers(k).add(cb);
    }
  };

  Global.prototype.unwatch = function(keys, cb) {
    var k, _i, _len;
    if (!_.isArray(keys)) {
      keys = [keys];
    }
    for (_i = 0, _len = keys.length; _i < _len; _i++) {
      k = keys[_i];
      if (isGlob(k)) {
        return this.getGlobWatchers(k)["delete"](cb);
      }
      this.getWatchers(k)["delete"](cb);
    }
  };

  Global.prototype.unwatchAll = function(keys) {
    var key, _i, _len;
    if (!_.isArray(keys)) {
      keys = [keys];
    }
    for (_i = 0, _len = keys.length; _i < _len; _i++) {
      key = keys[_i];
      if (isGlob(key)) {
        return this.globWatchers[key] = new Set();
      }
      this.watchers[key] = new Set();
    }
  };

  Global.prototype.onDataChanged = function(e) {
    var callbacks, glob, _ref, _results;
    this.getWatchers(e.key).forEach(function(cb) {
      return cb(e);
    });
    _ref = this.globWatchers;
    _results = [];
    for (glob in _ref) {
      if (!__hasProp.call(_ref, glob)) continue;
      callbacks = _ref[glob];
      if (minimatch(e.key, glob)) {
        _results.push(callbacks.forEach(function(cb) {
          return cb(e);
        }));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  Global.prototype.getWatchers = function(key) {
    if (this.watchers[key] == null) {
      this.watchers[key] = new Set();
    }
    return this.watchers[key];
  };

  Global.prototype.getGlobWatchers = function(key) {
    if (this.globWatchers[key] == null) {
      this.globWatchers[key] = new Set();
    }
    return this.globWatchers[key];
  };

  return Global;

})(Backend);

module.exports = Global;
