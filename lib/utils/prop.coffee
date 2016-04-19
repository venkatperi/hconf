get = ( obj, name ) ->
  return unless name?
  parts = name.split "."
  d = obj
  for p in parts
    d = d[ p ]
    return unless d?
  d

set = ( obj, name, value ) ->
  return unless name?
  parts = name.split "."
  d = obj
  for p in parts[ 0..-2 ]
    d[ p ] = {} unless d[ p ]?
    d = d[ p ]
  d[ parts[ parts.length - 1 ] ] = value

module.exports =
  get: get
  set: set
