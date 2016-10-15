import { isPosFixInt } from "./int";

export type Decoder = {
    bytes: number;
    current: any | null;
    stack: any[] | null;
}

export function createDecoder(): Decoder {
    return {
        bytes: 0,
        current: null,
        stack: null,
    };
}

/**
 * fixarray 100x xxxx
 * fixmap   101x xxxx
 */
export function isFixArrayOrFixMap(byte: number): boolean {
    /* tslint:disable:no-bitwise */
    return (byte >> 6) === 0b10;
    /* tslint:enable:no-bitwise */
}

/**
 * decode any msgpack buffer to js type
 */
export function decode(buf: Buffer): any {
    const bytesLen = buf.byteLength;
    let bi = 0;
    let result: any;
    let byte: number;

    while (bi < bytesLen) {
        byte = buf[bi];
        if (isPosFixInt(byte)) {
            result = byte;
        }
        bi += 1;
    }
    return result;
}
