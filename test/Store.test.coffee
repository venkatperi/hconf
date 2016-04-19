should = require( "should" )
assert = require( "assert" )

Store = require '../lib/store'

describe "Store", ->

  it "get uri", ->
    fs = Store.create type: 'file', name : "hconf", file : "/a/b/c"
    fs.uri().should.equal "hconf:file:/a/b/c"
