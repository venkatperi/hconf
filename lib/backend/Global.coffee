_ = require "underscore"
ObservableMap = require "observable-map"
minimatch = require "minimatch"
Backend = require './Backend'
observable = require "observable"
deepExtend = require "../utils/deepExtend"


isGlob = ( key ) ->
  /[\*\+\{\}]/.test

unless global.hconf?
  global.hconf =
    global :
      data : observable {}


class Global extends Backend

  constructor : () ->
    @watchers = {}
    @globWatchers = {}
    @data = global.hconf.global.data
    throw new Error "no data?" unless @data?
    @data.on "changed", @onDataChanged

  set : ( name, value ) =>
    parts = name.split "."
    d = @data
    for p in parts[ 0..-2 ]
      d[ p ] = {} unless d[ p ]?
      d = d[ p ]
    d[ parts[ parts.length - 1 ] ] = value

  get : ( name ) =>
    return unless name?
    parts = name.split "."
    d = @data
    for p in parts
      d = d[ p ]
      return unless d?
    d

  extend : ( source ) =>
    deepExtend @data, source

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

  onDataChanged : ( key, old, value ) =>
    @getWatchers( key ).forEach ( cb ) -> cb key, old, value
    for own glob, callbacks of @globWatchers
      if minimatch( key, glob )
        callbacks.forEach ( cb ) -> cb key, old, value

  getWatchers : ( key ) =>
    @watchers[ key ] = new Set() unless @watchers[ key ]?
    @watchers[ key ]

  getGlobWatchers : ( key ) =>
    @globWatchers[ key ] = new Set() unless @globWatchers[ key ]?
    @globWatchers[ key ]


module.exports = Global
