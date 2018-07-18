declare module 'msgpack-lite' {
    export function createDecodeStream(): NodeJS.ReadWriteStream
    export function encode(data: any): Buffer
}