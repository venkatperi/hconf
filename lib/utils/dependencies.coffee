pkginfo = require "pkginfo-async"
path = require "path"
denodeified = require "denodeified"
dfs = denodeified.fs
Q = require "q"

ignoreList = [ ".bin" ]

walk = ( pkgdir, list ) ->
  dfs.readdir path.join pkgdir, "node_modules"
  .then ( files ) ->
    d = Q( true )
    files.forEach ( f ) ->
      return d if f in ignoreList
      d = d.then ->
        dfs.stat path.join pkgdir, "node_modules", f
        .then ( stat ) ->
          return unless stat.isDirectory()
          list.add f
          walk path.join( pkgdir, "node_modules", f ), list
        .fail ( err ) ->
          throw err unless err.code == "ENOENT"
    d


module.exports = ( opts ) ->
  list = new Set()
  opts = {} unless opts?
  opts.module = module unless opts.module?

  pkginfo opts.module
  .then ( pkg ) ->
    walk pkg.dirname, list
  .then ->
    list
