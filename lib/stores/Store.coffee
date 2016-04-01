objnest = require "objnest"

module.exports = class Store

  constructor : ( {@name, @description, @type} ) ->
    @data = {}
    throw new Error "missing option: name" unless @name?
    throw new Error "missing option: type" unless @type?

  load : =>

  loadSync : =>

  save : =>

  flatten : =>
    objnest.flatten @data
    
