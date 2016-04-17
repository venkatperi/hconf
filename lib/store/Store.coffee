TypedClass = require "../TypedClass"

# Public: [Description].
module.exports = class Store extends TypedClass

  constructor : ( {@name, @description, @type} ) ->
    throw new Error "missing option: name" unless @name?
    throw new Error "missing option: type" unless @type?

    # the store data
    @data = {}

    # list of modules that requested this store (useful for debugging)
    @originators = []


  # Public: Get a URI that uniquely identifies this store
  #
  # Returns the URI as `String`.
  uri : => "#{@name}:#{@type}"

  # Public: Load this store (async)
  #
  # Returns a promise which resolves when the store is loaded
  load : =>

    # Public: Load this store synchronously
    #
    # Returns the store
  loadSync : =>

    # Public: Save this store (async)
    #
  save : =>

    # Public: Save this store (sync)
    #
  saveSync : =>


  requestedFrom : ( mod ) =>
    filename = if typeof mod is "string" then mod else mod.filename or mod.id
    @originators.push filename

  @create : ( opt ) ->
    super opt, __dirname

