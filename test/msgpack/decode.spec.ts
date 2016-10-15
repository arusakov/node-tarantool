import assert = require("assert");

import { decode } from "../../src/msgpack/decode";

describe("msgpack/decode", () => {
    it("positive fixint", () => {
        const posFixIntMax = 0b01111111;
        for (let i = 0; i < posFixIntMax; ++i) {
            assert(i === decode(Buffer.from([i])));
        }
    });
});
