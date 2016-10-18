import { FIXMAP } from "./types";

/**
 * fixmap 1000xxxx
 */
export function isFixMap(byte: number): boolean {
    /* tslint:disable:no-bitwise */
    return (byte & 0b11110000) === FIXMAP;
    /* tslint:enable:no-bitwise */
}

export function getFixMapSize(byte: number): number {
    /* tslint:disable:no-bitwise */
    return byte & 0b00001111;
    /* tslint:enable:no-bitwise */
}
