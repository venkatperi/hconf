var FileStore, Format, Store, dfs, fs, path,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

dfs = require("denodeified").dfs;

fs = require("fs");

path = require("path");

Store = require("./Store");

Format = require("../format");

module.exports = FileStore = (function(_super) {
  __extends(FileStore, _super);

  function FileStore(opts) {
    if (opts == null) {
      opts = {};
    }
    this.loadSync = __bind(this.loadSync, this);
    this.load = __bind(this.load, this);
    this.uri = __bind(this.uri, this);
    opts.type = "file";
    this.file = opts.file || (function() {
      throw new Error("missing option: file");
    })();
    this.format = Format.create({
      type: opts.format || "json"
    });
    FileStore.__super__.constructor.call(this, opts);
  }

  FileStore.prototype.uri = function() {
    return "" + (FileStore.__super__.uri.call(this)) + ":" + this.file;
  };

  FileStore.prototype.load = function() {
    return dfs.stat(this.file).then((function(_this) {
      return function(stat) {
        if (!stat.isDirectory()) {
          return stat;
        }
        _this.file = path.join(_this.file, "." + _this.name);
        return dfs.stat(_this.file);
      };
    })(this)).then((function(_this) {
      return function(stat) {
        if (!stat.isFile()) {
          return;
        }
        return dfs.readFile(_this.file, "utf8");
      };
    })(this)).then((function(_this) {
      return function(fileData) {
        if (fileData.charAt(0) === '\ufeff') {
          fileData = fileData.substr(1);
        }
        _this.data = _this.format.parse(fileData);
        return _this;
      };
    })(this)).fail((function(_this) {
      return function(ex) {
        if (ex.code === "ENOENT") {
          return;
        }
        throw new Error('Error parsing your configuration file: [' + _this.file + ']: ' + ex.message);
      };
    })(this));
  };

  FileStore.prototype.loadSync = function() {
    var err, ex, fileData, stat;
    try {
      stat = fs.statSync(this.file);
      if (stat.isDirectory()) {
        this.file = path.join(this.file, "." + this.name);
        stat = fs.statSync(this.file);
      }
      if (!(stat != null ? stat.isFile() : void 0)) {
        return;
      }
    } catch (_error) {
      err = _error;
      return;
    }
    try {
      fileData = fs.readFileSync(this.file, 'utf8');
      if (fileData.charAt(0) === '\ufeff') {
        fileData = fileData.substr(1);
      }
      return this.data = this.format.parse(fileData);
    } catch (_error) {
      ex = _error;
      throw new Error('Error parsing your configuration file: [' + this.file + ']: ' + ex.message);
    }
  };

  return FileStore;

})(Store);
