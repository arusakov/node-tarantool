import {
    Greeting,
    GreetingSaltSize,
    GreetingTextSize,
} from './tarantool-types'

/**
 * https://tarantool.org/doc/dev_guide/internals_index.html#greeting-packet
 */
export function parseGreeting(buf: Buffer): Greeting {
    const salt = buf.slice(GreetingTextSize, GreetingTextSize + GreetingSaltSize)
    return {
        salt: salt.toString(),
    }
}

export function getPrefix(size: number): Buffer {
    const buf = Buffer.alloc(5) // 5 bytes
    buf[0] = 0xCE // https://github.com/msgpack/msgpack/blob/master/spec.md#int-format-family
    buf.writeInt32BE(size, 1)
    return buf
}
