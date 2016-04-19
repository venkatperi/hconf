_ = require "underscore"
Backend = require './Backend'

unless global.hconf?
  global.hconf =
    global :
      data : {}

class Global extends Backend

  clear : =>
    @data = global.hconf.global.data = {}

module.exports = Global
