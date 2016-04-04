Format = require "./Format"

module.exports = class Json extends Format

  replacer : null
  spacing : 2
  
  constructor : ( {@replacer, @spacing} ) ->

  stringify : ( obj ) => JSON.stringify obj, @replacer, @spacing

  parse : ( data ) => JSON.parse data



