denodeified = require "denodeified"
dfs = denodeified.fs
fs = require "fs"
path = require "path"
Store = require "./Store"
JsonFormat = require "../formats/JsonFormat"

module.exports = class FileStore extends Store

  constructor : ( opts = {} ) ->
    @file = opts.file or throw new Error( "missing option: file" )
    @format = opts.format or JsonFormat
    super opts

  load : =>
    dfs.stat @file
    .then ( stat ) =>
      return stat unless stat.isDirectory()
      @file = path.join @file, ".#{@name}"
      dfs.stat @file
    .then ( stat ) =>
      return unless stat.isFile()
      dfs.readFile @file, "utf8"
    .then ( fileData ) =>
      fileData = fileData.substr( 1 ) if fileData.charAt( 0 ) == '\ufeff'
      @data = @format.parse( fileData )
      @
    .fail ( ex ) =>
      return if ex.code is "ENOENT"
      throw new Error( 'Error parsing your configuration file: [' + @file + ']: ' + ex.message )

  loadSync : =>
    try
      stat = fs.statSync @file
      if stat.isDirectory()
        @file = path.join @file, ".#{@name}"
        stat = fs.statSync @file
      return unless stat?.isFile()
    catch err
      return

    try
      fileData = fs.readFileSync( @file, 'utf8' )
      fileData = fileData.substr( 1 ) if fileData.charAt( 0 ) == '\ufeff'
      @data = @format.parse( fileData )
    catch ex
      throw new Error( 'Error parsing your configuration file: [' + @file + ']: ' + ex.message )



