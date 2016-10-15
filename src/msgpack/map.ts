/**
 * fixmap 1000xxxx
 */
export function isFixMap(byte: number): boolean {
    /* tslint:disable:no-bitwise */
    return (byte >> 4) === 0b1000;
    /* tslint:enable:no-bitwise */
}

export function getFixMapSize(byte: number): number {
    /* tslint:disable:no-bitwise */
    return byte & 0b00001111;
    /* tslint:enable:no-bitwise */
}
