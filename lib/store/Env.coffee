Store = require './Store'
Q = require 'q'
prop = require '../utils/prop'

module.exports = class Env extends Store

  constructor : ( opts = {} ) ->
    opts.type = "env"
    @prefix = opts.prefix or "HCONF_"
    super opts

  load : =>
    @data = {}
    for own k,v of process.env
      do ( k, v ) =>
        if k.indexOf( @prefix ) is 0
          key = k[ @prefix.length.. ].toLowerCase().replace( '_', '.' )
          prop.set @data, key, v
    Q @

