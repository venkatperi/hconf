
module.exports = class Backend
  constructor : ( opts = {} ) ->
    throw new Error "missing option: name" unless @name?

  get : ( name ) => throw new Error "virtual function called"
  getObject : ( name ) => throw new Error "virtual function called"

  set : ( name, value ) => throw new Error "virtual function called"
  setObject : ( name, value ) => throw new Error "virtual function called"
  extend : ( data ) => throw new Error "virtual function called"
    

