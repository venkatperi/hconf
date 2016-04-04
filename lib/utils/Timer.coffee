module.exports = class Timer
  constructor : ( @cb, @timeout, @autoStart ) ->
    @start() if @autoStart

  start : =>
    @stop()
    @timer = setTimeout ( =>
      @timer = undefined
      @cb() ), @timeout

  stop : =>
    if @timer?
      clearTimeout @timer
      @timer = undefined


