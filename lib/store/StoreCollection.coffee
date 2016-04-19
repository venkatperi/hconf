Store = require "./Store"
Q = require "q"
_ = require "underscore"

module.exports = class StoreCollection
  constructor : ->
    @stores = {}

  has : ( uri ) => @stores[ uri ]?

  get : ( uri ) => @stores[ uri ]

  add : ( opts, mod ) =>
    try
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
    catch err
      console.log err
      throw err


  dump: =>
    @stores
      

    
    
    
