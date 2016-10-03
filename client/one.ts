import { Connection } from "../src/node-tarantool";

const con = new Connection({
    port: 3301,
});

console.log(con);
