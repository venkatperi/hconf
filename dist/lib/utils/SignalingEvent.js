var Q, SignalingEvent, Timer,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Q = require('q');

Timer = require('./Timer');

SignalingEvent = (function() {
  function SignalingEvent(initialState) {
    if (initialState == null) {
      initialState = false;
    }
    this.onTimeout = __bind(this.onTimeout, this);
    this.wait = __bind(this.wait, this);
    this.reset = __bind(this.reset, this);
    this.set = __bind(this.set, this);
    this.reset();
    if (initialState != null) {
      this.set;
    }
  }

  SignalingEvent.prototype.set = function() {
    this.signaled = true;
    return this.signal.resolve(true);
  };

  SignalingEvent.prototype.reset = function() {
    this.signaled = false;
    return this.signal = Q.defer();
  };

  SignalingEvent.prototype.wait = function(fn, timeout) {
    this.signal.promise.then((function(_this) {
      return function() {
        if (_this.timer != null) {
          _this.timer.cancel();
        }
        return fn();
      };
    })(this)).done();
    if (timeout != null) {
      return this.timer = new Timer(this.onTimeout, timeout);
    }
  };

  SignalingEvent.prototype.onTimeout = function() {
    if (this.signaled) {
      return;
    }
    return this.signal.reject(new Error("timeout"));
  };

  return SignalingEvent;

})();
