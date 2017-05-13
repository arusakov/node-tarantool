export const TGreetingSaltSize = 44
export const TGreetingTextSize = 64

export type TGreeting = {
    salt: any;
}

export const TKeyCode = 0x00
export const TKeySync = 0x01
export const TKeySchemaId = 0x05
export const TKeySpaceId = 0x10
export const TKeyIndexId = 0x11
export const TKeyLimit = 0x12;
export const TKeyOffset = 0x13;
export const TKeyIterator = 0x14;

export const TKeyKey = 0x20;
export const TKeyTuple = 0x21;

// todo @arusakov more constants
// from https://tarantool.org/doc/dev_guide/internals_index.html#unified-packet-structure

export const TCodeSelect: 0x01 = 0x01
export const TCodePing: 0x40 = 0x40

export type TCode = typeof TCodeSelect | typeof TCodePing

export const TCodeResponseOk: 0x00 = 0x00

export type TResponseHeader = {
    0: typeof TCodeResponseOk | number
    1: number
}

export type TResponse = {
}
