import { useLoggerContext, useRegisterContext } from "@context";
import {
    isRegister,
    isMemoryAddress,
    isNumericValue,
    numberToLittleEndianBytes,
} from "@utils";
import useIntcpy from "./useIntcpy";

const useMov = () => {
    const { registers, regset } = useRegisterContext();

    const { info } = useLoggerContext();
    const { intcpy } = useIntcpy();

    const bitsToDecimal = (bits: number[]): number =>
        parseInt(bits.join(""), 2);

    const mov = (src: any, dest: any) => {
        // // reg to reg
        // if (isRegister(src) && isRegister(dest)) {
        //     const value = bitsToDecimal(registers[src] ?? []);
        //     regset(dest, value);
        //     info(`MOV: Moving ${value} from ${src} to ${dest}.`);
        // }

        // // reg to mem
        // else if (isRegister(src) && isMemoryAddress(dest)) {
        //     const value = bitsToDecimal(registers[src] ?? []);
        //     intcpy(dest, value);
        //     info(
        //         `MOV: Moving ${value} from ${src} to memory address ${dest}.`
        //     );
        // }

        // // mem to reg
        // else if (isMemoryAddress(src) && isRegister(dest)) {
        //     // Assuming you fetch the memory value inside intcpy, or directly get it
        //     const value = intcpy(src); // Or from context if you store memory elsewhere
        //     regset(dest, value);
        //     info(
        //         `MOV: Moving value at memory address ${src} to register ${dest}.`
        //     );
        // }

        // // mem to mem
        // else if (isMemoryAddress(src) && isMemoryAddress(dest)) {
        //     const value = intcpy(src);
        //     intcpy(dest, value);
        //     info(`MOV: Moving value from memory address ${src} to ${dest}.`);
        // }

        // immediate to reg
        if (isNumericValue(src) && isRegister(dest)) {
            regset(dest, numberToLittleEndianBytes(src));
            info(`Moving immediate value ${src} into register ${dest}.`);
        }

        // // immediate to mem
        // else if (isNumericValue(src) && isMemoryAddress(dest)) {
        //     intcpy(dest, parseInt(src));
        //     info(
        //         `MOV: Moving immediate value ${src} into memory address ${dest}.`
        //     );
        // } else {
        //     error("MOV: Invalid operands given.");
        // }
    };

    return mov;
};

export default useMov;
