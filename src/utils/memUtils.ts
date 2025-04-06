// Converts number → [byte0, byte1, ..., byte7] (LSB first)
export const numberToLittleEndianBytes = (value: number): number[] => {
    const bytes = [];
    for (let i = 0; i < 8; i++) {
        bytes.push((value >> (i * 8)) & 0xff);
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
