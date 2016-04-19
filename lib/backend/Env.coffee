Backend = require './Backend'
Q = require 'q'

prefix = "HCONF_"
module.exports = class Env extends Backend

  constructor : ->
    @data = {}
    for own k,v of process.env
      if k.indexOf prefix is 0
        key = k[ prefix.length.. ].toLowerCase().replace( '_', '.' )
        @set key, v

