Q = require 'q'
Timer = require './Timer'

class SignalingEvent

  constructor : ( initialState = false ) ->
    @reset()
    @set if initialState?

  set : =>
    @signaled = true
    @signal.resolve true

  reset : =>
    @signaled = false
    @signal = Q.defer()

  wait : ( fn, timeout ) =>
    @signal.promise.then =>
      @timer.cancel() if @timer?
      fn()
    .done()

    if timeout?
      @timer = new Timer @onTimeout, timeout

  onTimeout : =>
    return if @signaled
    @signal.reject new Error "timeout"


