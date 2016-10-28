import { isPosFixInt } from "./int";
import { FIXARR, FIXMAP } from "./types";
import { get4FirstBites, get4lastBites } from "./utils";

export const TYPE_ARRAY: 1 = 1;
export const TYPE_MAP: 2 = 2;

export interface SegmentBase {
    contains: number;
    expected: number;
    result: any;
}

export interface SegmentArray extends SegmentBase {
    type: typeof TYPE_ARRAY;
}

export interface SegmentMap extends SegmentBase {
    key: any;
    type: typeof TYPE_MAP;
}

export type Segment = SegmentMap | SegmentArray;

export type Node<T> = {
    next: Node<T> | null;
    val: T
}

export type Decoder = {
    bytes: number;
    stack: Segment[];
}

function createSegmentArray(count: number): SegmentArray {
    return {
        contains: 0,
        expected: count,
        result: new Array(count),
        type: TYPE_ARRAY,
    };
}

function createSegmentMap(count: number): SegmentMap {
    return {
        contains: 0,
        expected: count * 2,
        result: {},
        type: TYPE_MAP,
        key: null,
    };
}

function createNode<T>(val: T, next: Node<T> | null): Node<T> {
    return { next, val };
}

function addValueToSegment(seg: Segment, val: any): boolean {
    if (seg.type === TYPE_ARRAY) {
        seg.result[seg.contains] = val;
    } else {
        if (seg.contains % 2) {
            seg.result[seg.key] = val;
        } else {
            seg.key = val;
        }
    }
    return ++seg.contains === seg.expected;
}

export function createDecoder(): Decoder {
    return {
        bytes: 0,
        stack: [],
    };
}

/**
 * decode any msgpack buffer to js type
 */
export function decode(buf: Buffer, ctx: Decoder = createDecoder()): any {
    const bytesLen = buf.byteLength;
    let bi = 0;
    let bInc: number;
    let result: any;
    let byte: number;
    let size: number;
    let completed: boolean; // true for all simple types and empty maps and arrayes
    let stack: Node<Segment> | null = null;
    let fixpart: number;

    while (bi < bytesLen) {
        byte = buf[bi];
        if (isPosFixInt(byte)) {
            result = byte;
            bInc = 1;
            completed = true;
        } else {
            fixpart = get4FirstBites(byte);
            // todo @arusakov decode fixstr before
            if (fixpart === FIXMAP) {
                size = get4lastBites(byte);
                if (size) {
                    stack = createNode(createSegmentMap(size), stack);
                    completed = false;
                } else {
                    result = {};
                    completed = true;
                }
                bInc = 1;
            } else if (fixpart === FIXARR) {
                size = get4lastBites(byte); // todo rename it
                if (size) {
                    stack = createNode(createSegmentArray(size), stack);
                    completed = false;
                } else {
                    result = [];
                    completed = true;
                }
                bInc = 1;
            } else {
                // todo unsupported
                bInc = 1;
                completed = true;
            }
        }
        bi += bInc;

        if (completed) {
            while (stack) {
                if (!addValueToSegment(stack.val, result)) {
                    break;
                }
                result = stack.val.result;
                stack = stack.next;
            }
            if (!stack) {
                // complete
                break;
            }
        }
    }

    ctx.bytes = bi;
    return result;
}
