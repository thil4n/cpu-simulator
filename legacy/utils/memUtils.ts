// Converts number → [byte0, byte1, ..., byte7] (LSB first)
export const numberToLittleEndianBytes = (value: number | bigint): number[] => {
    const big = BigInt(value);
    const bytes = [];

    for (let i = 0n; i < 8n; i++) {
        const shifted = (big >> (i * 8n)) & 0xffn;
        bytes.push(Number(shifted));
    }

    return bytes;
};

// Converts [byte0, byte1, ..., byte7] → number (safe for values up to 2^53)
export const littleEndianBytesToNumber = (bytes: number[]): number => {
    let value = 0n;
    for (let i = 0; i < bytes.length; i++) {
        value |= BigInt(bytes[i] & 0xff) << BigInt(i * 8);
    }
    return Number(value);
};

// Converts 64-bit MSB-first bit array to number
export const bitArrayToNumber = (bitArray: number[]): number => {
    let value = 0n;
    for (let i = 0; i < bitArray.length; i++) {
        if (bitArray[i]) {
            value |= 1n << BigInt(bitArray.length - 1 - i);
        }
    }
    return Number(value);
};

// Converts number to 64-bit MSB-first bit array
export const numberToBitArray = (value: number): number[] => {
    const big = BigInt(value);
    const bits: number[] = [];
    for (let i = 63; i >= 0; i--) {
        bits.push(Number((big >> BigInt(i)) & 1n));
    }
    return bits;
};

// Converts 64-bit MSB-first bit array → 8 bytes (little-endian byte order)
// Bit array: [MSB...LSB] → byte[0] = least significant byte
export const bitsToBytes = (bitArray: number[]): number[] => {
    const bytes: number[] = [];

    // bitArray is MSB-first: bits[0..7] are the most significant byte
    // We need little-endian bytes, so reverse the byte order
    for (let i = 56; i >= 0; i -= 8) {
        const byteBits = bitArray.slice(i, i + 8);
        const byte = parseInt(byteBits.join(""), 2);
        bytes.push(byte);
    }

    return bytes;
};

// Converts 8 bytes (little-endian) → 64-bit MSB-first bit array
export const bytesToBits = (byteArray: number[]): number[] => {
    const bitArray: number[] = new Array(64).fill(0);

    // byte[0] is least significant → maps to bits[56..63]
    for (let byteIdx = 0; byteIdx < byteArray.length; byteIdx++) {
        const byte = byteArray[byteIdx] & 0xff;
        const bitOffset = 64 - (byteIdx + 1) * 8; // byte 0 → offset 56, byte 7 → offset 0
        for (let bit = 0; bit < 8; bit++) {
            bitArray[bitOffset + bit] = (byte >> (7 - bit)) & 1;
        }
    }

    return bitArray;
};
