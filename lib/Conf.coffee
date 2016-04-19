path = require "path"
_ = require "underscore"
minimatch = require "minimatch"
Q = require "q"
pkgInfo = require "pkginfo-async"
Seq = require "seqx"
ManualTimer = require "./utils/ManualTimer"
Backend = require "./backend"
conventions = require "./conventions"
custom = require "./conventions/custom"
asArray = require './utils/asArray'
StoreCollection = require "./store/StoreCollection"
EventEmitter = require( 'events' ).EventEmitter

# Public: our Configuration Provider.
class Conf extends EventEmitter

  constructor : ( @opts = {} ) ->
    @opts.defaults = {} unless @opts.defaults?
    @clear()

  clear : =>
    @initializing = Q.defer()
    @initialized = @initializing.promise

    @seq = new Seq()
    @backend = Backend.create type : "global"
#    @env = Backend.create type : "env"
    @backend.clear()
    @stores = new StoreCollection()
    @loadingTimer = new ManualTimer @onLoaded, 100


  # Public: Gets the specified config property (can be nested e.g. a.b.c)
  #
  # * `name ` The property path as {String|Array[{String}]}.
  #
  # Returns a promise which resolves to the property value(s), or `undefined`.
  get : ( name... ) =>
    @initialized.then =>
      res = for n in name
        @backend.get( n ) or @opts.defaults[ n ]

      if name.length == 1 then res[ 0 ] else res

  dump : =>
    @initialized.then =>
      x =
        stores : @stores.dump()
        merged : @backend.dump()
      JSON.stringify x, null, 2


  # Public: Add watcher(s) for a property (can be a nested/glob/wildcard)
  #
  # * `keys` The key or array of keys to watch as {String|[String]}.
  # * `cb `  The function to call when a watched property changes as {function}.
  watch : ( keys, cb ) =>
    @backend.watch keys, cb

  # Public: Removes previously added watchers
  #
  # * `keys` The key or array of keys as {String|[String]}.
  # * `cb `  The function to call when a watched property changes as {function}.
  unwatch : ( keys, cb ) =>
    @backend.unwatch keys, cb

  # Public: Remove all watches for the specified keys
  #
  # * `keys` The key or array of keys as {String|[String]}.
  unwatchAll : ( keys ) =>
    @backend.unwatch keys

  # Private: Add a store to the config
  #
  # * `store ` The [description] as {[type]}.
  #
  # Returns the [Description] as `undefined`.
  add : ( store, mod ) =>
    @seq.add => @stores.add store, mod
    @seq.add ( s ) => @backend.extend s.data if s?

  # Public: [Description]
  #
  # * `opts ` The [description] as {[type]}.
  #
  # Returns the [Description] as `undefined`.
  loadForModule : ( opts ) =>
    @loadingTimer.stop()
    @actualLoad opts

  # Public: [Description]
  #
  # * `opts ` The [description] as {[type]}.
  #
  # Returns the [Description] as `undefined`.
  actualLoad : ( opts ) =>
    throw new Error "missing option: module" unless opts?.module?
    @seq.add -> pkgInfo opts.module
    @seq.add @convention opts
    @seq.add => @loadingTimer.start()

  # Public: [Description]
  #
  # * `pkg ` The [description] as {[type]}.
  #
  # Returns the [Description] as `undefined`.
  convention : ( opts ) => ( pkg ) =>
    conventions.forEach ( c ) =>
      @add c( pkg : pkg, filename : opts.filename ), opts.module

    if opts.files?
      @add custom( pkg : pkg, file : f ), opts.module for f in asArray opts.files

  createDeps : =>
    return Q()
    all = []
    allDeps = new Set()

    modules = new Set()
    modules.add s.originators for own uri, s of @stores.stores

    modules.forEach ( m ) ->
      defer = Q.defer()
      all.push defer.promise

      dependson( m ).on "ready", ->
        @names.forEach ( n ) -> allDeps.add
        defer.resolve true

    Q.all( all ).then -> allDeps

  merge : =>
    for own uri, s of @stores.stores
      @backend.extend s.data
    return

    @createDeps()
    .then =>
      all = for own uri, s of @stores.stores
        Q.fcall @backend.extend, s.data
      Q.all all

  onLoaded : =>
    #    @emit "load"
    #    @merge()
    @initializing.resolve true
    @emit "ready"
    return

    Q.fcall @merge
    .then =>
      @initializing.resolve true
      @emit "ready"
    .fail ( err ) =>
      console.log err
      @emit "error", err

module.exports = Conf
