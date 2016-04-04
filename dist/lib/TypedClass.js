var TypedClass, capitalize, path;

capitalize = require("underscore.string/capitalize");

path = require("path");

module.exports = TypedClass = (function() {
  function TypedClass() {}

  TypedClass.create = function(opt, dir) {
    var er, klass, type;
    if (opt == null) {
      opt = {};
    }
    if (opt.type == null) {
      throw new Error("missing option: type");
    }
    if (dir == null) {
      dir = __dirname;
    }
    type = capitalize(opt.type);
    try {
      klass = require(path.join(dir, type));
      return new klass(opt);
    } catch (_error) {
      er = _error;
      throw new Error("bad or missing type: " + opt.type);
    }
  };

  return TypedClass;

})();
