import { Connection } from "../src/node-tarantool";
import {
    TCodePing,
    TKeyCode,
    TKeyIndexId,
    TKeyIterator,
    TKeyKey,
    TKeyLimit,
    TKeyOffset,
    TKeySchemaId,
    TKeySpaceId,
    TKeySync,
} from "../src/tarantool-types";

const con = new Connection({
    port: 3301,
});
con.connect();

// msgpack map https://github.com/msgpack/msgpack/blob/master/spec.md#map-format-family
const header = new Buffer([
    0b10000011, // msgpack map with N=2
    TKeyCode, TCodePing, // code => ping
    TKeySync, 42, // sync => 1
    TKeySchemaId, 0x34, // schemaId => 52
]);
console.log(header);

const body = new Buffer([
    0b10000001, // msgpack map with N=6
    TKeySpaceId, 0xcd, 0x02, 0x00, // spaceId => 512
    TKeyIndexId, 0xcd, 0x02, 0x00, // keyId => 512
    TKeyLimit, 0, // itaretor => all (0)
    TKeyOffset, 0, // itaretor => all (0)
    TKeyIterator, 0, // itaretor => all (0)
    TKeyKey, 0, // itaretor => all (0)
]);

setTimeout(() => {
    con.send(header, body);
}, 1000);
