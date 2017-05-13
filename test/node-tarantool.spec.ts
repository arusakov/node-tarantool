import { Connection } from '../src/node-tarantool'
import { TKeyCode, TCodePing, TKeySync } from '../src/tarantool-types'
import { getPrefix } from '../src/protocol';

describe('node-tarantool', () => {

    it('new Connect()', (done) => {
        const con = new Connection({ port: 3301 }).connect()

        // msgpack map https://github.com/msgpack/msgpack/blob/master/spec.md#map-format-family
        const header = new Buffer([
            0b10000010, // msgpack map with N=2
            TKeyCode, TCodePing, // code => ping
            TKeySync, 1, // sync => 1
        ])

        const packet = [getPrefix(header.length), header]

        con.send(Buffer.concat(packet))
        
        setTimeout(done, 1000)
    })

})
