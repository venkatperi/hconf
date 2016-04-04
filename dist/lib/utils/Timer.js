var Timer,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

module.exports = Timer = (function() {
  function Timer(cb, timeout, autoStart) {
    this.cb = cb;
    this.timeout = timeout;
    this.autoStart = autoStart;
    this.stop = __bind(this.stop, this);
    this.start = __bind(this.start, this);
    if (this.autoStart) {
      this.start();
    }
  }

  Timer.prototype.start = function() {
    this.stop();
    return this.timer = setTimeout(((function(_this) {
      return function() {
        _this.timer = void 0;
        return _this.cb();
      };
    })(this)), this.timeout);
  };

  Timer.prototype.stop = function() {
    if (this.timer != null) {
      clearTimeout(this.timer);
      return this.timer = void 0;
    }
  };

  return Timer;

})();
