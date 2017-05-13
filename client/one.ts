import { Connection } from '../src/node-tarantool'
import { getPrefix } from '../src/protocol'
import {
    TCodePing,
    TKeyCode,
    TKeySync,
 } from '../src/tarantool-types'

const con = new Connection({
    port: 3301,
})

con.connect()

// msgpack map https://github.com/msgpack/msgpack/blob/master/spec.md#map-format-family
const header = new Buffer([
    0b10000010, // msgpack map with N=2
    TKeyCode, TCodePing, // code => ping
    TKeySync, 1, // sync => 1
])
console.log(header)

const packet = [getPrefix(header.length), header]

setTimeout(() => {
    con.send(Buffer.concat(packet))
}, 1000)
