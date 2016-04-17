var Conf, hconf, provider, _;

Conf = require("./Conf");

_ = require("underscore");

provider = new Conf;

hconf = function(opts) {
  provider.loadForModule(opts);
  return hconf;
};

hconf = _.extend(hconf, {
  provider: provider,
  Conf: Conf,
  FileStore: require("./store/File")
});

["then", "fail", "done", "promiseDispatch"].forEach(function(f) {
  return hconf[f] = function(args) {
    return provider.initialized[f](args);
  };
});

["clear", "ready", 'dump', "get", "getObject", "watch", "unwatch", "unwatchAll"].forEach(function(f) {
  return hconf[f] = provider[f];
});

module.exports = hconf;
