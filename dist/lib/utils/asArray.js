var _;

_ = require("underscore");

module.exports = function(obj) {
  if (_.isArray(obj)) {
    return obj;
  } else {
    return [obj];
  }
};
