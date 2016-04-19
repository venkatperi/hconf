{dfs} = require "denodeified"
fs = require "fs"
path = require "path"
Store = require "./Store"
Format = require "../format"

module.exports = class FileStore extends Store

  constructor : ( opts = {} ) ->
    opts.type = "file"
    @file = opts.file or throw new Error( "missing option: file" )
    @format = Format.create type: opts.format or "json"
    super opts

  uri : =>
    "#{super()}:#{@file}"

  load : =>
    dfs.stat @file
    .then ( stat ) =>
      return stat unless stat.isDirectory()
      @file = path.join @file, ".#{@name}"
      dfs.stat @file
    .then ( stat ) =>
      dfs.readFile @file, "utf8" if stat.isFile()
    .then ( fileData ) =>
      return unless fileData?
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
