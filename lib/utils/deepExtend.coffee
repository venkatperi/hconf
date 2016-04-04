traverse = require "traverse"

sub = (o, path) ->
  return o unless path? and path.length>0
  sub o[path[0]], path[1..-1]

module.exports = (target, source) ->
  traverse(source).map (node) ->
    return if this.isRoot
    o = sub target, this.path[0..-2]
    if this.isLeaf
      o[this.key] = this.node
    else 
      unless o[this.key]?
        o[this.key] = if this.node instanceof Array then [] else {}
    this.update this.node
  target
  


