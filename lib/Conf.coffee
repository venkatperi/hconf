path = require "path"
_ = require "underscore"
minimatch = require "minimatch"
Q = require "q"
pkgInfo = require "pkginfo-async"
Seq = require "seqx"
ManualTimer = require "./utils/ManualTimer"
Backend = require "./backend"
Store = require "./store"
conventions = require "./conventions"
custom = require "./conventions/custom"
asArray = require './utils/asArray'

# Public: our Configuration Provider.
class Conf

  constructor : ( @opts = {} ) ->
    @clear()

  clear : =>
    @initialize = Q.defer()
    @initialized = @initialize.promise
    @seq = new Seq()
    @backend = Backend.create type : "global"
    @stores = new Set()
    @sources = {}
    @initTimer = new ManualTimer (=> @initialize.resolve true), 100


  # Public: Gets the specified config property (can be nested e.g. a.b.c)
  #
  # * `name ` The property path as {String}.
  #
  # Returns a promise which resolves to the property value, or `undefined`.
  get : ( name ) =>
    @initialized.then =>
      @backend.get name

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
    @seq.add => @createStore store, mod
    @seq.add ( s ) => @backend.extend s.data if s?

  # Public: [Description]
  #
  # * `store ` The [description] as {[type]}.
  #
  # Returns the [Description] as `undefined`.
  createStore : ( opts, mod ) =>
    s = Store.create opts
    return unless s?
    uri = s.uri()
    @sources[ uri ] = [] unless @sources[ uri ]?
    @sources[ uri ].push mod.filename or mod.id
    return if @stores.has uri
    @stores.add uri
    s.load()


  # Public: [Description]
  #
  # * `opts ` The [description] as {[type]}.
  #
  # Returns the [Description] as `undefined`.
  loadForModule : ( opts ) =>
    @initTimer.stop()
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
    @seq.add => @initTimer.start()

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

module.exports = Conf
