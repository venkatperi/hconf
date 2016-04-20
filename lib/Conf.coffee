_ = require "underscore"
Q = require "q"
deepmerge = require 'deepmerge'
pkgInfo = require "pkginfo-async"
Seq = require "seqx"
ManualTimer = require "./utils/ManualTimer"
Backend = require "./backend"
conventions = require "./conventions"
StoreCollection = require "./store/StoreCollection"
EventEmitter = require( 'events' ).EventEmitter

# Public: our Configuration Provider.
class Conf extends EventEmitter

  # Public: constructor
  #
  constructor : ( @opts = {} ) ->
    @opts.defaults = {} unless @opts.defaults?
    @clear()

  # Public: Reset all data
  #
  clear : =>
    @initializing = Q.defer()
    @initialized = @initializing.promise

    @seq = new Seq()
    @backend = Backend.create type : "global"
    @backend.clear()
    @stores = new StoreCollection()
    @loadingTimer = new ManualTimer @onLoaded, 100

  onLoaded : =>
    @initializing.resolve true
    @emit "ready"


  # Public: Gets the specified config property (can be nested e.g. a.b.c)
  #
  # * `name ` The property path as {String|Array[{String}]}.
  #
  # Returns a promise which resolves to the property value(s), or `undefined`.
  get : ( name... ) =>
    @initialized.then =>
      res = (@backend.get n for n in name)
      if name.length == 1 then res[ 0 ] else res

  # Public: generate a dump for debugging
  #
  # Returns a string representation of this object
  dump : =>
    @initialized.then =>
      x =
        stores : @stores.dump()
        merged : @backend.dump()
      JSON.stringify x, null, 2

  # Public: [Description]
  #
  # * `opts ` The [description] as {[type]}.
  #
  # Returns the [Description] as `undefined`.
  load : ( opts ) =>
    throw new Error "missing option: module" unless opts?.module?
    @seq.add => @loadingTimer.stop()
    @seq.add -> pkgInfo opts.module
    @seq.add @applyConventions opts
    @seq.add => @loadingTimer.start()

  # Private: [Description]
  #
  # * `pkg ` The [description] as {[type]}.
  #
  # Returns the [Description] as `undefined`.
  applyConventions : ( opts ) => ( pkg ) =>
    @addStore( c, pkg.name, opts.module ) for c in conventions( _.extend opts, pkg : pkg )

  # Private: Add a store to the config
  #
  # * `store ` The [description] as {[type]}.
  #
  # Returns the [Description] as `undefined`.
  addStore : ( store, prefix, mod ) =>
    @seq.add => @stores.add store, mod
    @seq.add ( s ) =>
      return unless s?
      pkgConfig = deepmerge {}, s.data
      delete pkgConfig.__packages if pkgConfig.__packages?
      @backend.extend "#{prefix}" : pkgConfig if s?

      # merge configs for other packages, if present
      return unless s.data.__packages?
      for own p, cfg of s.data.__packages
        @backend.extend "#{p}" : cfg

module.exports = Conf
