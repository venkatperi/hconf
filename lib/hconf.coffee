Conf = require "./Conf"
_ = require "underscore"

provider = new Conf

hconf = ( opts ) ->
  provider.load opts
  hconf

hconf = _.extend hconf,
  provider : provider
  Conf : Conf

[ "then", "fail", "done", "promiseDispatch" ].forEach ( f ) ->
  hconf[ f ] = ( args ) ->  provider.initialized[ f ] args

[ "clear", 'dump', "get", "on" ].forEach ( f ) ->
  hconf[ f ] = provider[ f ]

module.exports = hconf
