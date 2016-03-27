nconf = require( "nconf" )
path = require "path"
_ = require "underscore"

HOME_DIR = process.env.HOME
stores = []

class Conf
  constructor : ( {@name, @filename, @dirs, @defaults, @overrides} ) ->
    throw new Error "missing name" unless @name?
    @filename = ".#{@name}" unless @filename?

    stores.push name : "#{@name}:defaults", type : 'literal', store : @defaults if @defaults?
    stores.push name : "#{@name}:user", type : 'file', file : path.join( HOME_DIR, @filename )
    stores.push
      name : "#{@name}:#{name}", type : 'file', file : path.join( dir, @filename ) for own name, dir of @dirs if @dirs?
    stores.push name : "#{@name}:overrides", type : 'literal', store : @overrides if @overrides?

    @init()

  init : =>
    for store in stores.reverse()
      store = _.clone store
      name = store.name
      delete store.name
      nconf.use name, store

  get : ( key ) =>
    nconf.get key


module.exports = ( opts ) -> new Conf( opts ) 

