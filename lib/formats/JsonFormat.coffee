module.exports =
  stringify : ( obj, replacer, spacing ) ->
    JSON.stringify obj, replacer or null, spacing or 2
   
  parse : JSON.parse
