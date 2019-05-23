const path = require("path")
const Module = require("module")

const options = {
    root: null,
    maps: {},
    regex: null
}

const req = Module.prototype.require
Module.prototype.require = (id) => {
    if (options.root === null) {
        throw new Error("@axel66/include was required but not initialized")
    }
    const source = id.replace(
        options.regex,
        (_, map) => {
            if (options.maps[map] === undefined) {
                return map
            }
            return path.resolve(
                options.root,
                options.maps[map]
            )
        }
    )
    return req(source)
}

module.exports = (info = {}) => {
    options.root = info.root || process.cwd()
    const maps = Object.keys(info).reduce(
        (m, key) => {
            if (key.startsWith("@") === true) {
                m[key] = info[key]
            }
            return m
        },
        {}
    )
    options.maps = maps
    options.regex = new RegExp(`^(${Object.keys(maps).join("|")})`)
}
