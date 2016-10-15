/**
 * positive fix int 0xxx xxxx
 */
export function isPosFixInt(byte: number): boolean {
    /* tslint:disable:no-bitwise */
    return !(0b10000000 & byte);
    /* tslint:enable:no-bitwise */
}
/**
 * For this function Int is Int8, Int16 and Int32
 * Not Int64 
 */
export function decodeInt(buf: Buffer, offset: number, bytes: number): number {
    return buf.readIntBE(offset, bytes);
}
