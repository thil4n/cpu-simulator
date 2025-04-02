import { useMemoryContext } from "@context";

const useIntcpy = () => {
  const { memset } = useMemoryContext();

  const intcpy = (dest: number, value: number) => {
    // Create a buffer of 4 bytes (32-bit) and a DataView to write int32
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);

    // Store the value as a signed 32-bit integer
    view.setInt32(0, value, true); // true for little-endian

    // Update memory state using memset
    memset((prevMemory) => {
      const newMemory = { ...prevMemory };
      for (let i = 0; i < 4; i++) {
        newMemory[dest + i] = view.getUint8(i);
      }
      return newMemory;
    });
  };

  return { intcpy };
};

export default useIntcpy;
