should = require( "should" )
assert = require( "assert" )
hconf = require '../index'
path = require "path"

name = "testconf"
fixtures = path.join __dirname, "fixtures"

describe "hconf", ->

  it "loads a config file", ( done ) ->
    conf = hconf
      name : name
      dirs :
        dir1 : path.join fixtures, "dir1"

    conf.get( "unique_dir1" ).should.equal "dir1"
    conf.get( "common" ).should.equal "from dir1"
    done()

  it "merges additional configs", ( done ) ->
    conf = hconf
      name : name
      dirs :
        dir2 : path.join fixtures, "dir2"

    conf.get( "unique_dir2" ).should.equal "dir2"
    conf.get( "common" ).should.equal "from dir2"
    done()



