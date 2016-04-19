# hconf
An opinionated config loader for `nodejs`.

`hconf` looks for the file `.<package name>` (dot + package name from package.json) in the following directories (in case of conflicting property keys, the last one wins).
- `factory`: in the package's root (dir where package.json is located).
- `user`: in `process.env.HOME`, the current user's home directory.
- `custom files`: a list of filenames with path. `hconf` is of the opinion that this option should used rarely.

`hconf` also looks for `environment` variables that look like: `<uppercase package name>_A_B_C` will map to the property key `a.b.c` (all lowercase) for the package's config.

## Configuration data is `global`
Configuration data is merged into a nodejs `global` object. Once loaded, a package's config keys can be accessed with string keys `<package name>.path.to.the.config.property`.

## Multiple packages
The sequence of `require` statements determines the order of merging of config data into the global object and therefore determines which config wins in the case of conflicting keys.

### Example
For example, if `package2` uses `package1` and both packages use `hconf` for configuration management:

#### `package1`

```json
/* .package1 */
{
  "package1": {
    "some" : {
      "var" : "from package 1"
    }
  }
}
```

```coffeescript
# package1/index.coffee 
hconf = require('hconf')(module:module)

hconf.get("package1.some.var")
.then (value) ->
  # value is "from package 1"
```

#### `package2`

```json
/* .package2 */
{
  "package2": {
    "some" : {
      "var" : "from package 2"
    }
  },
  "package1": {
    "some" : {
      "var" : "now from package 2"
    }
  }
}
```

```coffeescript
# package2/index.coffee

# requiring package1 loads its config first
package1 = require 'package1'

# package2's data merges and mutates the global config object
hconf = require('hconf')(module:module)

hconf.get("package2.some.var", "package1.some.var")
.then ([p2, p1]) ->
  # p2 is "from package 2"
  # p1 is "now from package 2"
```

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
### Get config setting

```coffeescript
#package some-pkg
hconf.get("some-pkg.a.b.c")
.then (value) ->
  console.log "#{a.b.c}: #{value}"
```

# #
## Sample Config File

```json
{
  "hconf": {
    "factory": "defaults"
  }
}
```
