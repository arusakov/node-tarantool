import { Tarantool } from './tarantool-types';
/**
 * https://tarantool.org/doc/dev_guide/internals_index.html#greeting-packet
 */
export declare function parseGreeting(buf: Buffer): Tarantool.Greeting;
