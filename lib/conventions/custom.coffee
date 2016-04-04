
module.exports = ( opts ) ->
  name : opts.pkg.name
  description : opts.description or "custom file"
  type : opts.type or 'file'
  file : opts.file or opts.filename