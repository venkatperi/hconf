capitalize = require "underscore.string/capitalize"
path = require "path"

parts = path.parse __dirname
name = capitalize parts.name

module.exports = require "./#{name}"