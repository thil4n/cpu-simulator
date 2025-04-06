import {
    useLoggerContext,
    useMemoryContext,
    useRegisterContext,
} from "@context";
import {
    isRegister,
    isNumericValue,
    numberToLittleEndianBytes,
    BytesToBits,
    isMemoryAddress,
    bitsToBytes,
    littleEndianBytesToNumber,
} from "@utils";

const useMov = () => {
    const { registers, regset } = useRegisterContext();
    const { setMemoryBytes, getMemoryBytes, memory } = useMemoryContext();

    const { info, error } = useLoggerContext();

    const mov = (src: any, dest: any) => {
        // register to register
        if (isRegister(src) && isRegister(dest)) {
            const srcBits = registers[src] ?? Array(64).fill(0);
            regset(dest, srcBits);
            info(`Moving value from register ${src} to register ${dest}.`);
        }

        // immediate to reg
        if (isNumericValue(src) && isRegister(dest)) {
            const srcBytes = numberToLittleEndianBytes(src);

            regset(dest, BytesToBits(srcBytes));
            info(`Moving immediate value ${src} into register ${dest}.`);
        }

        // reg to mem
        else if (isRegister(src) && isMemoryAddress(dest)) {
            const srcBits = registers[src] ?? Array(64).fill(0);
            const srcBytes = bitsToBytes(srcBits);
            const value = littleEndianBytesToNumber(srcBytes);

            setMemoryBytes(dest, srcBytes);

            info(`Moving ${value} from ${src} to memory address ${dest}.`);
        }

        // mem to reg
        else if (isMemoryAddress(src) && isRegister(dest)) {
            const srcBytes = getMemoryBytes(src, 8);
            regset(dest, BytesToBits(srcBytes));
            const value = littleEndianBytesToNumber(srcBytes);

            info(`Moving ${value} from ${src} to memory address ${dest}.`);
        }

        // immediate to mem
        else if (isNumericValue(src) && isMemoryAddress(dest)) {
            const srcBytes = numberToLittleEndianBytes(src);
            const value = littleEndianBytesToNumber(srcBytes);
            setMemoryBytes(dest, srcBytes);

            console.log(memory);

            info(`Moving ${value}  to memory address ${dest}.`);
        } else {
            error("Invalid operands given.");
        }
    };

    return mov;
};

export default useMov;
