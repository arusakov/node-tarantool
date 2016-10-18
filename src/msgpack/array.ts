import { FIXARR } from "./types";

/**
 * fixmap 1001xxxx
 */
export function isFixArray(byte: number): boolean {
    /* tslint:disable:no-bitwise */
    return (byte & 0b11110000) === FIXARR;
    /* tslint:enable:no-bitwise */
}