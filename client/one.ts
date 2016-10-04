import { Connection } from "../src/node-tarantool";
import {
    TCodePing,
    TKeyCode,
    TKeyIndexId,
    TKeyIterator,
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
    TKeyCode, TCodePing, // code => ping
    TKeySync, 42, // sync => 1
]);
console.log(header);

const body = new Buffer([
    0b10000011, // msgpack map with N=1
    TKeySpaceId, 512, // spaceId => 272
    TKeyIndexId, 512, // keyId => 512
    TKeyIterator, 0, // itaretor => all (0)
]);

setTimeout(() => {
    con.send(header, body);
}, 1000);
