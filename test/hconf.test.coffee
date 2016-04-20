should = require( "should" )
assert = require( "assert" )
hconf = require '../index'
path = require "path"

fixtures = path.join __dirname, "fixtures"

describe "hconf", ->

  beforeEach ->
    hconf.clear()

  it "loads default configs", ( done ) ->
    hconf module : module

    hconf.get( "hconf.factory" )
    .then ( val ) ->
      assert.notEqual val, undefined, "get() must return an object"
      val.should.equal "defaults"
      done()
    .fail done
    .done()

  it "emits 'ready' event", ( done ) ->
    conf = new hconf.Conf()
    conf.on "ready", done
    conf.load module : module

  it "loads a config file", ( done ) ->
    hconf
      module : module
      files : path.join fixtures, "dir1"

    hconf.get( "hconf.common", 'hconf.dir1.unique' )
    .then ( [common, unique] ) ->
      common.should.equal "from dir1"
      unique.should.equal 1
      done()
    .fail done
    .done()

  it "merges with a config file", ( done ) ->
    hconf
      module : module
      files : path.join fixtures, "dir2"

    hconf.get( "hconf.common" )
    .then ( val ) ->
      val.should.equal "from dir2"
      hconf.get( "hconf.dir2.unique" )
    .then ( val ) ->
      val.should.equal 2
      done()
    .fail done
    .done()

  it "loads env vars", ( done ) ->
    hconf
      module : module

    hconf.get( "hconf.env" )
    .then ( env ) ->
      env.should.equal "from env"
      done()
    .fail done
    .done()

  it "env vars take precedence", ( done ) ->
    hconf
      module : module
      files : path.join fixtures, "dir2"

    hconf.get( "hconf.common", "hconf.env" )
    .then ( [common, env] ) ->
      common.should.equal "from dir2"
      env.should.equal "from env"
      done()
    .fail done
    .done()

  it "modify config of other packages", ( done ) ->
    hconf
      module : module
      files : path.join fixtures, "other"

    hconf.get( "hconf.common", "hconf.other.unique", "package1.some.var" )
    .then ( [common, unique, pkg1] ) ->
      common.should.equal "from other"
      unique.should.equal 99
      pkg1.should.equal "for package 1"
      done()
    .fail done
    .done()