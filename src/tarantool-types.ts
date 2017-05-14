export const GreetingSaltSize = 44
export const GreetingTextSize = 64

export type Greeting = {
    salt: any;
}

export const KeyCode = 0x00
export const KeySync = 0x01
export const KeySchemaId = 0x05
export const KeySpaceId = 0x10
export const KeyIndexId = 0x11
export const KeyLimit = 0x12;
export const KeyOffset = 0x13;
export const KeyIterator = 0x14;

export const KeyKey = 0x20;
export const KeyTuple = 0x21;

// todo @arusakov more constants
// from https://tarantool.org/doc/dev_guide/internals_index.html#unified-packet-structure

export const CodeSelect: 0x01 = 0x01
export const CodeInsert: 0x02 = 0x02
export const CodePing: 0x40 = 0x40

export type TCode = typeof CodeSelect | typeof CodePing

export const TCodeResponseOk: 0x00 = 0x00

export type TResponseHeader = {
    0: typeof TCodeResponseOk | number
    1: number
}

export type TResponse = {
}
