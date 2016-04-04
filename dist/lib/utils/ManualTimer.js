var ManualTimer, Timer,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Timer = require('./Timer');

module.exports = ManualTimer = (function(_super) {
  __extends(ManualTimer, _super);

  function ManualTimer(cb, timeout) {
    ManualTimer.__super__.constructor.call(this, cb, timeout, false);
  }

  return ManualTimer;

})(Timer);
