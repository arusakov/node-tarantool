import { Connection } from "../src/node-tarantool";
import {
    TCodeSelect,
    TKeyCode,
    TKeyIndexId,
    TKeyIterator,
    TKeyKey,
    TKeyLimit,
    TKeyOffset,
    // TKeySchemaId,
    TKeySpaceId,
    TKeySync,
} from "../src/tarantool-types";

const con = new Connection({
    port: 3301,
});
con.connect();

// msgpack map https://github.com/msgpack/msgpack/blob/master/spec.md#map-format-family
const header = new Buffer([
    0b10000010, // msgpack map with N=2
    TKeyCode, TCodeSelect, // code => ping
    TKeySync, 1, // sync => 1
    // TKeySchemaId, 0x34, // schemaId => 52
]);
console.log(header);

const body = new Buffer([
    0b10000010, // msgpack map with N=1
    TKeySpaceId, 0xcd, 0x02, 0x00, // spaceId => 512
    TKeyLimit, 10,
    // TKeyKey, 0,
]);

setTimeout(() => {
    con.send(header, body);
}, 1000);
