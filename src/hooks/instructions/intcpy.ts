import { useMemoryContext } from "@context";

const intcpy = (dest: number, value: number) => {
    const { memory, memset } = useMemoryContext();

    const memoryValuesCopy = { ...memory };

    // Create a buffer of 4 bytes (32-bit) and a DataView to write int32
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);

    // Store the value as a signed 32-bit integer
    view.setInt32(0, value, true); // true for little-endian

    // Store each byte in memory
    for (let i = 0; i < 4; i++) {
        memoryValuesCopy[dest + i] = view.getUint8(i);
    }

    memset(memoryValuesCopy);
};

export default intcpy;
