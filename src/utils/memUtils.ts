// Converts number → [byte0, byte1, ..., byte7] (LSB first)
export const numberToLittleEndianBytes = (value: number | bigint): number[] => {
    const big = BigInt(value); // Convert to BigInt to support full 64-bit
    const bytes = [];

    for (let i = 0n; i < 8n; i++) {
        const shifted = (big >> (i * 8n)) & 0xffn;
        bytes.push(Number(shifted));
        console.log(`Byte ${i}:`, shifted.toString(16));
    }

    return bytes;
};

// Converts [byte0, byte1, ..., byte7] → number
export const littleEndianBytesToNumber = (bytes: number[]): number => {
    let value = 0;
    for (let i = 0; i < bytes.length; i++) {
        value |= (bytes[i] & 0xff) << (i * 8);
    }
    return value;
};

// Converts 64-bit bit array to number
export const bitArrayToNumber = (bitArray: number[]): number => {
    return parseInt(bitArray.join(""), 2);
};

// Converts number to 64-bit bit array
export const numberToBitArray = (value: number): number[] => {
    const binary = value.toString(2).padStart(64, "0");
    return Array.from(binary).map((bit) => parseInt(bit));
};
