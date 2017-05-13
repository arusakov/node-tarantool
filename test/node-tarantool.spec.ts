import { Connection } from '../src/node-tarantool'
import { TKeyCode, TCodePing, TKeySync, TKeySpaceId, TKeyLimit, TKeyKey } from '../src/tarantool-types'
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

        const body = new Buffer([
            0b10000010, // msgpack map with N=1
            TKeySpaceId, 0xcd, 0x02, 0x00, // spaceId => 512
            TKeyLimit, 10,
            TKeyKey, 0,
        ]);

        const packet = [getPrefix(header.length +  body.length), header, body]

        con.send(Buffer.concat(packet))
        
        setTimeout(done, 1000)
    })

})
