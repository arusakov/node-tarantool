/* tslint:disable:no-bitwise */

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
    return (buf[offset + 1] << 8) | buf[offset + 2];
}

export function decodeInt64(buf: Buffer, offset: number): number {
    return (buf[offset + 1] << 8) | buf[offset + 2];
}

export function decodeInt(buf: Buffer, offset: number): number {
    const lastBit = 0b01 & buf[0];
    if (0b10 & buf[0]) {
        return lastBit ? decodeInt64(buf, offset) : decodeInt32(buf, offset);
    }
    return lastBit ? decodeInt16(buf, offset) : decodeInt8(buf, offset);
 }
