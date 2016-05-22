path = require 'path'

module.exports = ( opts ) ->
  filename = require('./filename') opts

  name : opts.pkg.name
  description : opts.description or 'user defaults'
  type : opts.type or 'file'
  file : path.join process.cwd(), filename