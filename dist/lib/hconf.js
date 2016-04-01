var Conf, f, hconf, provider, _, _i, _j, _len, _len1, _ref, _ref1;

Conf = require("./Conf");

_ = require("underscore");

provider = new Conf;

hconf = function(opts) {
  return provider.loadForModule(opts);
};

hconf = _.extend(hconf, {
  provider: provider,
  Conf: Conf
});


/*
 * make hconf a Q promise, so that we can do:
 *   hconf.then ->
 */

_ref = ["then", "promiseDispatch"];
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  f = _ref[_i];
  hconf[f] = provider.ready[f];
}

_ref1 = ["ready", "get", "getObject", "watch", "unwatch", "unwatchAll"];
for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
  f = _ref1[_j];
  hconf[f] = provider[f];
}

module.exports = hconf;
