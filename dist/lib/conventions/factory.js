var path;

path = require("path");

module.exports = function(opts) {
  var filename, pkg;
  pkg = opts.pkg;
  filename = require("./filename")(opts);
  return {
    name: pkg.name,
    description: opts.description || "factory defaults",
    type: opts.type || 'file',
    file: path.join(pkg.dirname, filename)
  };
};
