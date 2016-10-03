import { Connection } from "../src/node-tarantool";
import { getPrefix } from "../src/protocol";
import { encode } from "msgpack-lite";

const con = new Connection({
    port: 3301,
});

con.connect();

const parts = new Array(2);

const header = encode([
    0x40, // code - ping
    0x02, // sync - requestId
    null, // schemaId
]);

parts[0] = getPrefix(header.byteLength);
parts[1] = header;

setTimeout(() => {
    con.send(Buffer.concat(parts));
}, 1000);
