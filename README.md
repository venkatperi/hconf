# hconf
A conventions based configuration manager for `nodejs`.

## Installation
Install with npm

```
npm install hconf
```

## Usage

```coffeescript
hconf = require("hconf") module: module
```

## Example
### Get a config setting

```coffeescript
hconf.get("a.b.c")
.then (value) ->
  console.log "#{a.b.c}: #{value}"
```
