nconf = require( "nconf" )
path = require "path"
_ = require "underscore"

HOME_DIR = process.env.HOME
stores = []
initialized = false

class Conf
  constructor : ( {@name, @filename, @dirs = {}, @defaults} ) ->
    throw new Error "missing name" unless @name?
    @filename = ".#{@name}" unless @filename?

    stores.push name : "#{@name}:user", type : 'file', file : path.join( HOME_DIR, @filename )
    stores.push name : "#{@name}:#{name}", type : 'file', file : path.join( dir, @filename ) for own name, dir of @dirs
    stores.push name : "#{@name}:defaults", type : 'literal', store : @defaults if @defaults?
    initialized = false

  init : =>
    return if initialized

    for store in stores.reverse()
      store = _.clone store
      name = store.name
      delete store.name
      nconf.use name, store
    initialized = true

  get : ( key ) =>
    @init() unless initialized
    nconf.get key

  defaults : ( opts ) =>
    stores.push name : "#{@name}:overrides", type : 'literal', store : @defaults if @defaults?
    initialized = false

  overrides : ( opts ) =>
    stores.push name : "#{@name}:overrides", type : 'literal', store : @defaults if @defaults?
    initialized = false


module.exports = ( opts ) -> new Conf( opts ) 

