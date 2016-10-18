/* tslint:disable:no-bitwise */
export function get4lastBites(byte: number): number {
    return byte & 0b00001111;
}

export function get4FirstBites(byte: number): number {
    return byte & 0b11110000;
}
