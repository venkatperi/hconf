module.exports = ( opts ) ->
  pkg = opts.pkg

  name : pkg.name
  prefix : "#{pkg.name.toUpperCase()}_"
  description : opts.description or "env variables"
  type : 'env'
