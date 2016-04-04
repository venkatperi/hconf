_ = require "underscore"

module.exports = ( obj ) ->
  if _.isArray obj then obj else [ obj ]