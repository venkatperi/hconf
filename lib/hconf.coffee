Conf = require "./Conf"
_ = require "underscore"

provider = new Conf

hconf = ( opts ) ->
  provider.loadForModule opts
  hconf

hconf = _.extend hconf,
  provider : provider
  Conf : Conf
  FileStore : require "./store/File"

[ "then", "fail", "done", "promiseDispatch" ].forEach ( f ) ->
  hconf[ f ] = ( args ) ->  provider.initialized[ f ] args

[ "clear", "ready", 'dump', "get", "getObject", "watch", "unwatch", "unwatchAll" ].forEach ( f ) ->
  hconf[ f ] = provider[ f ]

module.exports = hconf
