/* tslint:disable:no-bitwise */

// import { INT8, INT16, INT32, INT64 } from './types';

// Big Endian for all int and uint

export function decodePositiveFixInt(buf: Buffer, offset: number): number {
    return buf[offset];
}

export function decodeInt8(buf: Buffer, offset: number): number {
    return buf[offset + 1];
}

export function decodeInt16(buf: Buffer, offset: number): number {
    return (buf[offset + 1] << 8) | buf[offset + 2];
}

export function decodeInt32(buf: Buffer, offset: number): number {
    return (buf[offset + 1] << 24) | (buf[offset + 2] << 16) | (buf[offset + 3] << 8) | buf[offset + 4];
}

// export function decodeInt64(buf: Buffer, offset: number): number {
// }

export function decodeInt(buf: Buffer, offset: number): number {
    const lastBit = buf[0] & 0b1;
    if (buf[0] & 0b10) {
        return lastBit ? 0 /* todo */ : decodeInt32(buf, offset);
    }
    return lastBit ? decodeInt16(buf, offset) : decodeInt8(buf, offset);
 }
