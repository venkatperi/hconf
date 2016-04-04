_ = require "underscore"
module.exports = ( opts ) ->
  if opts.filename?
    return opts.filename opts if _.isFunction opts.filename
    return opts.filename

  ".#{opts.pkg.name}"