import { isPosFixInt } from "./int";
import {
    getFixMapSize, isFixMap,
} from "./map";

const TYPE_ARRAY: 1 = 1;
const TYPE_MAP: 2 = 2;

interface SegmentBase {
    contains: number;
    expected: number;
    result: any;
}

interface SegmentArray extends SegmentBase {
    type: typeof TYPE_ARRAY;
}

interface SegmentMap extends SegmentBase {
    key: any;
    type: typeof TYPE_MAP;
}

type Segment = SegmentMap | SegmentArray;

type Decoder = {
    bytes: number;
    stack: Segment[];
}

// function createSegmentArray(count: number): SegmentArray {
//     return {
//         contains: 0,
//         expected: count,
//         result: new Array(count),
//         type: TYPE_ARRAY,
//     };
// }

function createSegmentMap(count: number): SegmentMap {
    return {
        contains: 0,
        expected: count * 2,
        result: {},
        type: TYPE_MAP,
        key: null,
    };
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
    let completed: boolean; // true for all simple types and empty maps and arrayes
    let seg: Segment | null = null;

    while (bi < bytesLen) {
        byte = buf[bi];
        if (isPosFixInt(byte)) {
            result = byte;
            bInc = 1;
            completed = true;
        } else if (isFixMap(byte)) {
            const size = getFixMapSize(byte);
            if (size) {
                seg = createSegmentMap(size);
                ctx.stack.push(seg);
                completed = false;
            } else {
                result = {};
                completed = true;
            }
            bInc = 1;
        } else {
            // todo unsupported
            bInc = 1;
            completed = true;
        }
        bi += bInc;

        if (completed) {
            while (seg) {
                if (!addValueToSegment(seg, result)) {
                    break;
                }
                result = seg.result;
                ctx.stack.pop();
                if (!ctx.stack.length) {
                    // decoding ended, so prepare ctx and return
                    ctx.bytes = bi;
                    return result;
                }
                seg = ctx.stack[ctx.stack.length - 1];
            }
        }
    }

    ctx.bytes = bi;
    return result;
}
