var Backend, Global, deepExtend, isGlob, minimatch, observable, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require("underscore");

minimatch = require("minimatch");

Backend = require('./Backend');

observable = require("node-observable");

deepExtend = require("../utils/deepExtend");

isGlob = function(key) {
  return /[\*\+\{\}]/.test;
};

if (global.hconf == null) {
  global.hconf = {
    global: {
      data: observable({})
    }
  };
}

Global = (function(_super) {
  __extends(Global, _super);

  function Global() {
    this.getGlobWatchers = __bind(this.getGlobWatchers, this);
    this.getWatchers = __bind(this.getWatchers, this);
    this.onDataChanged = __bind(this.onDataChanged, this);
    this.unwatchAll = __bind(this.unwatchAll, this);
    this.unwatch = __bind(this.unwatch, this);
    this.watch = __bind(this.watch, this);
    this.dump = __bind(this.dump, this);
    this.extend = __bind(this.extend, this);
    this.get = __bind(this.get, this);
    this.set = __bind(this.set, this);
    this.clear = __bind(this.clear, this);
    this.watchers = {};
    this.globWatchers = {};
    this.clear();
    if (this.data == null) {
      throw new Error("no data?");
    }
  }

  Global.prototype.clear = function() {
    this.data = global.hconf.global.data = observable({});
    return this.data.on("changed", this.onDataChanged);
  };

  Global.prototype.set = function(name, value) {
    var d, p, parts, _i, _len, _ref;
    parts = name.split(".");
    d = this.data;
    _ref = parts.slice(0, -1);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      p = _ref[_i];
      if (d[p] == null) {
        d[p] = {};
      }
      d = d[p];
    }
    return d[parts[parts.length - 1]] = value;
  };

  Global.prototype.get = function(name) {
    var d, p, parts, _i, _len;
    if (name == null) {
      return;
    }
    parts = name.split(".");
    d = this.data;
    for (_i = 0, _len = parts.length; _i < _len; _i++) {
      p = parts[_i];
      d = d[p];
      if (d == null) {
        return;
      }
    }
    return d;
  };

  Global.prototype.extend = function(source) {
    return deepExtend(this.data, source);
  };

  Global.prototype.dump = function() {
    return this.data;
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

  Global.prototype.onDataChanged = function(key, old, value) {
    var callbacks, glob, _ref, _results;
    this.getWatchers(key).forEach(function(cb) {
      return cb(key, old, value);
    });
    _ref = this.globWatchers;
    _results = [];
    for (glob in _ref) {
      if (!__hasProp.call(_ref, glob)) continue;
      callbacks = _ref[glob];
      if (minimatch(key, glob)) {
        _results.push(callbacks.forEach(function(cb) {
          return cb(key, old, value);
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
