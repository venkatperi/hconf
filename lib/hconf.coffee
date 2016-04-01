Conf = require "./Conf"
_ = require "underscore"

provider = new Conf

hconf = ( opts ) -> provider.loadForModule opts

hconf = _.extend hconf,
  provider : provider
  Conf : Conf

###
# make hconf a Q promise, so that we can do:
#   hconf.then ->
###

#for f in [ "then", "promiseDispatch" ]
#  hconf[ f ] = provider.ready[ f ]

for f in [ "ready", "get", "getObject", "watch", "unwatch", "unwatchAll" ]
  hconf[ f ] = provider[ f ]


module.exports = hconf

