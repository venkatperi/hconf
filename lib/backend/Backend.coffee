TypedClass = require "../TypedClass"

module.exports = class Backend extends TypedClass
  constructor : ->
    throw new Error "missing option: name" unless @name?

  get : ( name ) => throw new Error "virtual function called"

  set : ( name, value ) => throw new Error "virtual function called"

  extend : ( from ) => throw new Error "virtual function called"

  @create : ( opt ) -> super opt, __dirname

