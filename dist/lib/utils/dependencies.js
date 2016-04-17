var Q, denodeified, dfs, ignoreList, path, pkginfo, walk,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

pkginfo = require("pkginfo-async");

path = require("path");

denodeified = require("denodeified");

dfs = denodeified.fs;

Q = require("q");

ignoreList = [".bin"];

walk = function(pkgdir, list) {
  return dfs.readdir(path.join(pkgdir, "node_modules")).then(function(files) {
    var d;
    d = Q(true);
    files.forEach(function(f) {
      if (__indexOf.call(ignoreList, f) >= 0) {
        return d;
      }
      return d = d.then(function() {
        return dfs.stat(path.join(pkgdir, "node_modules", f)).then(function(stat) {
          if (!stat.isDirectory()) {
            return;
          }
          list.add(f);
          return walk(path.join(pkgdir, "node_modules", f), list);
        }).fail(function(err) {
          if (err.code !== "ENOENT") {
            throw err;
          }
        });
      });
    });
    return d;
  });
};

module.exports = function(opts) {
  var list;
  list = new Set();
  if (opts == null) {
    opts = {};
  }
  if (opts.module == null) {
    opts.module = module;
  }
  return pkginfo(opts.module).then(function(pkg) {
    return walk(pkg.dirname, list);
  }).then(function() {
    return list;
  });
};
