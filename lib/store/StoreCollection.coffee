Store = require "./Store"
Q = require "q"
_ = require "underscore"

module.exports = class StoreCollection
  constructor : ->
    @stores = {}
    @[Symbol.Iterator] = @stores[Symbol.Iterator]

  has : ( uri ) => @stores[ uri ]?

  get : ( uri ) => @stores[ uri ]

  add : ( opts, mod ) =>
    s = Store.create opts
    return unless s?
    s.requestedFrom mod
    uri = s.uri()
    unless @stores[ uri ]?
      @stores[ uri ] = s
      s.load()
    else
      @stores[ uri ].requestedFrom mod
      Q s

  dump: =>
    @stores
      

    
    
    
