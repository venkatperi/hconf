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

  it "loads a config file", ( done ) ->
    hconf
      module : module
      files : path.join fixtures, "dir1"

    hconf.get( "hconf.common" )
    .then ( val ) ->
      val.should.equal "from dir1"
      hconf.get( "hconf.dir1.unique" )
    .then ( val ) ->
      val.should.equal 1
      done()
    .fail done
    .done()

  it "attach watchers", ( done ) ->
    watcher = ( key, old, value ) ->
      key.should.equal "hconf.common"
      value.should.equal "from fixtures"
      hconf.unwatch "hconf.common", watcher
      done()

    hconf.watch "hconf.common", watcher

    hconf
      module : module
      files : path.join fixtures
    .fail done
    .done()

  it "watches for key patterns", ( done ) ->
    watcher = ( key, old, value ) ->
      key.indexOf( "hconf." ).should.equal 0
      hconf.unwatch "hconf.*", watcher
      done()

    hconf.watch "hconf.*", watcher

    hconf
      module : module
      files : path.join fixtures, "pattern"
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

  it "get()", ( done ) ->
    hconf.get "hconf.common"
    .then ( val ) ->
      val.should.equal "from dir2"
      done()
    .fail done
    .done()

  it "store uri", ( done ) ->
    fs = new hconf.FileStore name: "hconf", file: "/a/b/c"
    fs.uri().should.equal "hconf:file:/a/b/c"
    done()




