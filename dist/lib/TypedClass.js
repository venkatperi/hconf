var TypedClass, capitalize, path;

capitalize = require("underscore.string/capitalize");

path = require("path");

module.exports = TypedClass = (function() {
  function TypedClass() {}

  TypedClass.create = function(opt, dir) {
    var klass, type;
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
    klass = require(path.join(dir, type));
    return new klass(opt);
  };

  return TypedClass;

})();
