import { decodeInt } from "../../src/msgpack/int";
import { INT8 } from "../../src/msgpack/types";

describe("msgpack/int", () => {
    it("decodeInt", () => {
        decodeInt(new Buffer([INT8, 0]), 0);
        // throw new Error('x');

    });
});
