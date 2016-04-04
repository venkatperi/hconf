Timer = require './Timer'

module.exports = class ManualTimer extends Timer

  constructor : ( cb, timeout ) ->
    super cb, timeout, false
    
