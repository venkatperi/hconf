_ = require "underscore"
ObservableMap = require "observable-map"
minimatch = require "minimatch"
Backend = require './Backend'

isGlob = ( key ) ->
  /[\*\+\{\}]/.test

unless global.hconf?
  global.hconf =
    global: 
      data: new ObservableMap()
      data2: {}
      
data = global.hconf.global.data
data2 = global.hconf.global.data2
    
class Global extends Backend

  constructor : () ->
    @watchers = {}
    @globWatchers = {}
    data.on "change", @onDataChanged

  get : ( name ) =>
    data.get name

  set : ( name, value ) =>
    data.set name, value
    
  extend: (d) =>
    global.hconf.global.data2 = _.extend data2, d

  getObject : ( name ) =>
    parts = name.split "."
    d = data2
    for p in parts
      d = d[ p ]
    d

  watch : ( keys, cb ) =>
    keys = [ keys ] unless _.isArray keys
    for k in keys
      return @getGlobWatchers( k ).add cb if isGlob k
      @getWatchers( k ).add cb

  unwatch : ( keys, cb ) =>
    keys = [ keys ] unless _.isArray keys
    for k in keys
      return @getGlobWatchers( k ).delete cb if isGlob k
      @getWatchers( k ).delete cb

  unwatchAll : ( keys ) =>
    keys = [ keys ] unless _.isArray keys
    for key in keys
      return @globWatchers[ key ] = new Set() if isGlob key
      @watchers[ key ] = new Set()

#Private

  onDataChanged : ( e ) =>
    @getWatchers( e.key ).forEach ( cb ) -> cb e
    for own glob, callbacks of @globWatchers
      if minimatch( e.key, glob )
        callbacks.forEach ( cb ) -> cb e

  getWatchers : ( key ) =>
    @watchers[ key ] = new Set() unless @watchers[ key ]?
    @watchers[ key ]

  getGlobWatchers : ( key ) =>
    @globWatchers[ key ] = new Set() unless @globWatchers[ key ]?
    @globWatchers[ key ]


module.exports = Global
