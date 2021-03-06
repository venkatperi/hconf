capitalize = require "underscore.string/capitalize"
path = require "path"

module.exports = class TypedClass

  @create : ( opt, dir ) ->
    opt = {} unless opt?
    throw new Error "missing option: type" unless opt.type?
    dir = __dirname unless dir?

    type = capitalize opt.type
    klass = require path.join dir, type
    return new klass opt
