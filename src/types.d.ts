declare module 'msgpack-lite' {
    export function encode(smth: any): Buffer;
    export function decode<T>(smth: Buffer): T;
}