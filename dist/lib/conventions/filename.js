var _;

_ = require("underscore");

module.exports = function(opts) {
  if (opts.filename != null) {
    if (_.isFunction(opts.filename)) {
      return opts.filename(opts);
    }
    return opts.filename;
  }
  return "." + opts.pkg.name;
};
