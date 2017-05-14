import { Connection } from '../src/node-tarantool'
import * as T from '../src/tarantool-types'

describe('node-tarantool', () => {

    it('new Connect()', (done) => {
        const con = new Connection({ port: 3301 }).connect()

        // msgpack map https://github.com/msgpack/msgpack/blob/master/spec.md#map-format-family
        const header = new Buffer([
            0b10000010, // msgpack map with N=2
            T.KeyCode, T.CodeInsert, // code => select
            T.KeySync, 1, // sync => 1
        ])

        const body = new Buffer([
            0b10000010, // msgpack map with N=2
            T.KeySpaceId, 0xcd, 0x02, 0x00, // spaceId => 512
            T.KeyTuple, 0x92, 22, 22, // [22, 22]
            // TKeyKey, 0,
        ]);
        
        setTimeout(() => {
            con.sendRaw(header, body)

            setTimeout(done, 500)
        }, 100)
    })

})
