_ = require "underscore"
minimatch = require "minimatch"
Backend = require './Backend'
observable = require "node-observable"
deepExtend = require "../utils/deepExtend"

isGlob = ( key ) ->
  /[\*\+\{\}]/.test

unless global.hconf?
  global.hconf =
    global :
      data : observable {}

class Global extends Backend

  constructor : ->
    @watchers = {}
    @globWatchers = {}
    @clear()
    throw new Error "no data?" unless @data?

  clear : =>
    @data = global.hconf.global.data = observable {}
    @data.on "changed", @onDataChanged


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
