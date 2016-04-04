path = require "path"

module.exports = ( opts ) ->
  pkg = opts.pkg
  filename = require( "./filename" ) opts

  name : pkg.name
  description : opts.description or "factory defaults"
  type : opts.type or 'file'
  file : path.join pkg.dirname, filename