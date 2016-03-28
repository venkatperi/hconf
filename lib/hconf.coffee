nconf = require( "nconf" )
path = require "path"
_ = require "underscore"

HOME_DIR = process.env.HOME

unless global.hconf?
  global.hconf =
    stores : []
    provider : new nconf.Provider()

stores = global.hconf.stores
provider = global.hconf.provider

hconf = ( opts ) ->
  name = opts.name
  throw new Error "missing name" unless name?
  opts.filename = ".#{name}" unless opts.filename?

  if opts.defaults?
    stores.push
      name : "#{name}:defaults",
      type : 'literal',
      store : opts.defaults

  stores.push
    name : "#{name}:user",
    type : 'file',
    file : path.join( HOME_DIR, opts.filename )

  if opts.dirs?
    for own n, dir of opts.dirs
      stores.push
        name : "#{name}:#{n}",
        type : 'file',
        file : path.join( dir, opts.filename )

  if opts.overrides?
    stores.push
      name : "#{name}:overrides",
      type : 'literal',
      store : opts.overrides

  init()
  hconf

init = hconf.init = ->
  provider = global.hconf.provider = new nconf.Provider()
  console.log stores.reverse()
  for store in stores.reverse()
    store = _.clone store
    name = store.name
    delete store.name
    provider.use name, store

hconf.get = ( key ) ->
  provider.get key

hconf.stores = -> global.hconf.stores
hconf.provider = -> global.hconf.provider

module.exports = hconf

