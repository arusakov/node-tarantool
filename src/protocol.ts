import {
    TGreeting,
    TGreetingSaltSize,
    TGreetingTextSize,
} from "./tarantool-types";

/**
 * https://tarantool.org/doc/dev_guide/internals_index.html#greeting-packet 
 */
export function parseGreeting(buf: Buffer): TGreeting {
    const salt = buf.slice(TGreetingTextSize, TGreetingTextSize + TGreetingSaltSize);
    return {
        salt: salt.toString(),
    };
}
