import {
    useLoggerContext,
    useMemoryContext,
    useRegisterContext,
} from "@context";
import {
    isRegister,
    isNumericValue,
    numberToLittleEndianBytes,
    bytesToBits,
    isMemoryAddress,
    bitsToBytes,
    littleEndianBytesToNumber,
    parseAddr,
} from "@utils";

const useMov = () => {
    const { registers, regset } = useRegisterContext();
    const { setMemoryBytes, getMemoryBytes } = useMemoryContext();

    const { info, error } = useLoggerContext();

    const mov = (src: string, dest: string) => {
        // register to register
        if (isRegister(src) && isRegister(dest)) {
            const srcBits = registers[src] ?? Array(64).fill(0);
            regset(dest as any, srcBits);
            info(`Moving value from register ${src} to register ${dest}.`);
        }

        // immediate to reg
        else if (isNumericValue(src) && isRegister(dest)) {
            const srcBytes = numberToLittleEndianBytes(parseInt(src, 10));

            regset(dest as any, bytesToBits(srcBytes));
            info(`Moving immediate value ${src} into register ${dest}.`);
        }

        // reg to mem
        else if (isRegister(src) && isMemoryAddress(dest)) {
            const srcBits = registers[src] ?? Array(64).fill(0);
            const srcBytes = bitsToBytes(srcBits);
            const value = littleEndianBytesToNumber(srcBytes);

            setMemoryBytes(parseAddr(dest), srcBytes);

            info(`Moving ${value} from ${src} to memory address ${dest}.`);
        }

        // mem to reg
        else if (isMemoryAddress(src) && isRegister(dest)) {
            const srcBytes = getMemoryBytes(parseAddr(src), 8);
            regset(dest as any, bytesToBits(srcBytes));
            const value = littleEndianBytesToNumber(srcBytes);

            info(`Moving ${value} from ${src} to register ${dest}.`);
        }

        // immediate to mem
        else if (isNumericValue(src) && isMemoryAddress(dest)) {
            const srcBytes = numberToLittleEndianBytes(parseInt(src, 10));
            const value = littleEndianBytesToNumber(srcBytes);

            const address = parseAddr(dest);

            setMemoryBytes(address, srcBytes);

            info(`Moving ${value} to memory address ${dest}.`);
        } else {
            error("Invalid operands given.");
        }
    };

    return mov;
};

export default useMov;
