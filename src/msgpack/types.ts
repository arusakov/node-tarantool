/**
 * Msgpack types
 * https://github.com/msgpack/msgpack/blob/master/spec.md#overview
 */

export const POSFIXINT = 0; // 0xxxxxxx
export const NEGFIXINT = 0b11100000; // 111xxxxx

export const FIXMAP = 0b10000000; // 1000xxxx 
export const FIXARR = 0b10010000; // 1001xxxx
export const NIL    = 0b11000000; // 11xxxxxx
export const FALSE  = 0b11000010;
export const TRUE   = 0b11000011;
export const BIN8   = 0b11000100;
export const BIN16  = 0b11000101;
export const BIN32  = 0b11000110;

export const UINT8  = 0b11001100;
export const UINT16 = 0b11001101;
export const UINT32 = 0b11001110;
export const UINT64 = 0b11001111;

export const INT8   = 0b11010000;
export const INT16  = 0b11010001;
export const INT32  = 0b11010010;
export const INT64  = 0b11010011;

export const ARR16  = 0b11011100;
export const ARR32  = 0b11011101;
export const MAP16  = 0b11011110;
export const MAP32  = 0b11011111;
