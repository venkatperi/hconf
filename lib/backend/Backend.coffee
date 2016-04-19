TypedClass = require "../TypedClass"

module.exports = class Backend extends TypedClass
  get : ( name ) =>
    return unless name?
    parts = name.split "."
    d = @data
    for p in parts
      d = d[ p ]
      return unless d?
    d

  set : ( name, value ) =>
    parts = name.split "."
    d = @data
    for p in parts[ 0..-2 ]
      d[ p ] = {} unless d[ p ]?
      d = d[ p ]
    d[ parts[ parts.length - 1 ] ] = value


  extend : ( from ) => throw new Error "virtual function called"

  dump : =>
    @data

  @create : ( opt ) -> super opt, __dirname

