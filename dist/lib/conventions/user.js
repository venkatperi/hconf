var path;

path = require("path");

module.exports = function(opts) {
  var filename, pkg;
  pkg = opts.pkg;
  filename = require("./filename")(opts);
  return {
    name: opts.pkg.name,
    description: opts.description || "user defaults",
    type: opts.type || 'file',
    file: path.join(process.env.HOME, filename)
  };
};
