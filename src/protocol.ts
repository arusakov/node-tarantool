import {
    TCode,
    TGreeting,
    TGreetingSaltSize,
    TGreetingTextSize,
    TKeyCode,
    TKeySync,
} from "./tarantool-types";

export class Protocol {
    private sync = 0;

    /**
     * https://tarantool.org/doc/dev_guide/internals_index.html#greeting-packet 
     */
    static parseGreeting(buf: Buffer): TGreeting {
        const salt = buf.slice(TGreetingTextSize, TGreetingTextSize + TGreetingSaltSize);
        return {
            salt: salt.toString(),
        };
    }

    getPrefix(size: number): Buffer {
        const buf = new Buffer(5); // 5 bytes
        buf[0] = 0xCE; // https://github.com/msgpack/msgpack/blob/master/spec.md#int-format-family
        buf.writeInt32BE(size, 1);
        return buf;
    }

    /**
     * Unified packet header
     * https://tarantool.org/doc/dev_guide/internals_index.html#unified-packet-structure
     */
    getHeader(code: TCode): Buffer {
        return new Buffer([
            0b10000010, // msgpack map with N=2
            TKeyCode, code, // code => ping
            TKeySync, this.genSync(), // sync => sync number
        ]);
    }

    genSync(): number {
        if (this.sync % 1024) {
            this.sync = 0;
        }
        return ++this.sync;
    }
}
