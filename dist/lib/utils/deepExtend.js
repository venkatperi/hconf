var sub, traverse;

traverse = require("traverse");

sub = function(o, path) {
  if (!((path != null) && path.length > 0)) {
    return o;
  }
  return sub(o[path[0]], path.slice(1));
};

module.exports = function(target, source) {
  traverse(source).map(function(node) {
    var o;
    if (this.isRoot) {
      return;
    }
    o = sub(target, this.path.slice(0, -1));
    if (this.isLeaf) {
      o[this.key] = this.node;
    } else {
      if (o[this.key] == null) {
        o[this.key] = this.node instanceof Array ? [] : {};
      }
    }
    return this.update(this.node);
  });
  return target;
};
