FileStore = require "./stores/FileStore"
_ = require "underscore"
ObservableMap = require "observable-map"
minimatch = require "minimatch"
Q = require "q"
path = require "path"
pkgInfo = require "pkginfo-async"
Seq = require "seqx"

HOME_DIR = process.env.HOME

backends =
  global : require "./backends/Global"

module.exports = class Conf

  constructor : ( opts = {} ) ->
    @createBackend opts.backend
    @seq = new Seq()
    @stores = []

  add : ( store ) =>
    @seq.add => @createStore store
    @seq.add @addStore

  get : ( name ) =>
    @initialized.then =>
      @seq.add => @backend.get name

  getObject : ( name ) =>
    @initialized.then =>
      @seq.add => @backend.getObject name

  watch : ( keys, cb ) =>
    @backend.watch keys, cb

  unwatch : ( keys, cb ) =>
    @backend.unwatch keys, cb

  unwatchAll : ( keys ) =>
    @backend.unwatch keys

#Private

  createStore : ( store ) =>
    handler = @[ "__#{store.type.toLowerCase()}StoreCreate" ] if store?.type?
    throw new Error "bad or missing type for store" unless handler
    handler( store )?.load()

  addStore : ( s ) =>
    return unless s?
    @stores.push s
    @backend.extend s.data
    for own k,v of s.flatten()
      @backend.set k, v

  __fileStoreCreate : ( store ) =>
    new FileStore( store )

  convention : ( opts ) => ( pkg ) =>
    name = pkg.name
    filename = opts.filename or ".#{name}"

    @add
      name : pkg.name
      description : "factory defaults",
      type : 'file',
      file : path.join pkg.dirname, filename

    @add
      name : pkg.name
      description : "user",
      type : 'file',
      file : path.join( HOME_DIR, filename )

    if opts.files?
      opts.files = [ opts.files ] unless _.isArray opts.files
      for f in opts.files
        @add
          name : pkg.name
          description : "custom file",
          type : 'file',
          file : f

  loadForModule : ( opts ) =>
    @initialize = Q.defer()
    @initialized = @initialize.promise
    opts = {} unless opts?
    throw new Error "missing option: module" unless opts.module?

    @seq.add -> pkgInfo opts.module
    @seq.add @convention opts
    @seq.add => @initialize.resolve true

  createBackend : ( opts ) =>
    opts = { type : "global" } unless opts?
    b = backends[ opts.type ]
    throw new Error "Unknown backend type: #{opts.type}" unless b
    @backend = new b opts
    
    
    
