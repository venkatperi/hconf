deepmerge = require 'deepmerge'
TypedClass = require "../TypedClass"
prop = require '../utils/prop'

module.exports = class Backend extends TypedClass

  constructor : -> @clear()

  get : ( name ) => prop.get @data, name

  set : ( name, value ) => prop.set @data, name, value

  clear : => @data = {}

  extend : ( from ) => @data = deepmerge @data, from if from?

  dump : => @data

  @create : ( opt ) -> super opt, __dirname

