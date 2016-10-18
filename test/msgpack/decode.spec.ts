import assert = require("assert");

import { decode } from "../../src/msgpack/decode";

describe("msgpack/decode", () => {
    it("positive fixint", () => {
        const posFixIntMax = 0b01111111;
        for (let i = 0; i < posFixIntMax; ++i) {
            assert(decode(Buffer.from([i])) === i);
        }
    });

    it("fixmap empty", () => {
        assert.deepStrictEqual(decode(Buffer.from([0x80])), {});
    });

    it("fixmap flat", () => {
        assert.deepStrictEqual(
            decode(Buffer.from([0x81, 0, 0])),
            { 0: 0 }
        );
        assert.deepStrictEqual(
            decode(Buffer.from([0x82, 0, 1, 2, 3])),
            { 0: 1, 2: 3 }
        );
    });

    it("fixmap nested", () => {
        assert.deepStrictEqual(
            decode(Buffer.from([0x81, 0, 0x80])),
            { 0: {} }
        );
        assert.deepStrictEqual(
            decode(Buffer.from([0x81, 0, 0x81, 1, 2])),
            { 0: { 1: 2 } }
        );
        assert.deepStrictEqual(
            decode(Buffer.from([0x82, 0, 0x81, 1, 2, 3, 4])),
            { 0: { 1: 2 }, 3: 4 }
        );
        assert.deepStrictEqual(
            decode(Buffer.from([0x82, 0, 1, 2, 0x82, 3, 4, 5, 0x81, 6, 7])),
            { 0: 1, 2: { 3: 4, 5: { 6: 7 } } }
        );
    });

    it("fixmap with arrays", () => {
        assert.deepStrictEqual(
            decode(Buffer.from([0x82, 0, 0x92, 1, 2, 3, 0x91, 4])),
            { 0: [1, 2], 3: [4] }
        );
    });

    it("fixarray empty", () => {
        assert.deepStrictEqual(decode(Buffer.from([0x90])), []);
    });

    it("fixarray flat", () => {
        assert.deepStrictEqual(
            decode(Buffer.from([0x91, 0])),
            [0]
        );
        assert.deepStrictEqual(
            decode(Buffer.from([0x93, 1, 2, 3])),
            [1, 2, 3]
        );
    });

    it("fixarray nested", () => {
        assert.deepStrictEqual(
            decode(Buffer.from([0x92, 0, 0x90])),
            [0, []]
        );
        assert.deepStrictEqual(
            decode(Buffer.from([0x92, 0, 0x92, 0x90, 1])),
            [0, [[], 1]]
        );
    });

    it("fixarray with objects", () => {
        assert.deepStrictEqual(
            decode(Buffer.from([0x91, 0x80])),
            [{}]
        );
        assert.deepStrictEqual(
            decode(Buffer.from([0x93, 0, 0x81, 1, 2, 3])),
            [0, { 1: 2 }, 3]
        );
    });
});
