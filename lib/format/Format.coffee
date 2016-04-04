TypedClass = require "../TypedClass"

module.exports = class Format extends TypedClass
  
  constructor: (opts) ->
    
  stringify : ( obj ) => throw new Error "virtual function called"
   
  parse : ( data ) => throw new Error "virtual function called"

  @create : ( opt ) -> super opt, __dirname

