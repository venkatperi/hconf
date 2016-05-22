custom = require './custom'
asArray = require '../utils/asArray'

factory = ( opts ) -> [ require('./factory') opts ]
cwd = ( opts ) -> [ require('./cwd') opts ]
user = ( opts ) -> [ require('./user') opts ]
env = ( opts ) -> [ require('./env') opts ]

files = ( opts ) ->
  return [] unless opts.files?
  custom pkg : opts.pkg, file : f for f in asArray opts.files

module.exports = ( opts ) ->
  conventions = [ factory, user, cwd, files, env ]
  stores = []

  stores = stores.concat c(opts) for c in conventions
  stores
