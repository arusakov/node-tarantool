export const TGreetingSaltSize = 44;
export const TGreetingTextSize = 64;

export type TGreeting = {
    salt: any;
}

export const TKeyCode = 0x00;
export const TKeySync = 0x01;
export const TKeySchemaId = 0x05;
export const TKeySpaceId = 0x10;
export const TKeyIndexId = 0x11;

// todo @arusakov more constants
// from https://tarantool.org/doc/dev_guide/internals_index.html#unified-packet-structure

export const TCodeSelect = 0x01;
export const TCodePing = 0x40;

export const TCodeResponseOk = 0x00;
