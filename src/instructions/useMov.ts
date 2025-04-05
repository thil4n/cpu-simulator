import { useMemoryContext, useLoggerContext } from "@context";
import { isRegister, isMemoryAddress, isNumericValue } from "@utils";
import useIntcpy from "./useIntcpy";

const useMov = () => {
    const { registers, regset } = useMemoryContext();
    const { info, error } = useLoggerContext();
    const { intcpy } = useIntcpy();

    const bitsToDecimal = (bits: number[]): number =>
        parseInt(bits.join(""), 2);

    const mov = (op_1: any, op_2: any) => {
        // // reg to reg
        // if (isRegister(op_1) && isRegister(op_2)) {
        //     const value = bitsToDecimal(registers[op_1] ?? []);
        //     regset(op_2, value);
        //     info(`MOV: Moving ${value} from ${op_1} to ${op_2}.`);
        // }

        // // reg to mem
        // else if (isRegister(op_1) && isMemoryAddress(op_2)) {
        //     const value = bitsToDecimal(registers[op_1] ?? []);
        //     intcpy(op_2, value);
        //     info(
        //         `MOV: Moving ${value} from ${op_1} to memory address ${op_2}.`
        //     );
        // }

        // // mem to reg
        // else if (isMemoryAddress(op_1) && isRegister(op_2)) {
        //     // Assuming you fetch the memory value inside intcpy, or directly get it
        //     const value = intcpy(op_1); // Or from context if you store memory elsewhere
        //     regset(op_2, value);
        //     info(
        //         `MOV: Moving value at memory address ${op_1} to register ${op_2}.`
        //     );
        // }

        // // mem to mem
        // else if (isMemoryAddress(op_1) && isMemoryAddress(op_2)) {
        //     const value = intcpy(op_1);
        //     intcpy(op_2, value);
        //     info(`MOV: Moving value from memory address ${op_1} to ${op_2}.`);
        // }

        // immediate to reg
        if (isNumericValue(op_1) && isRegister(op_2)) {
            regset(op_2, parseInt(op_1));
            info(`MOV: Moving immediate value ${op_1} into register ${op_2}.`);
        }

        // // immediate to mem
        // else if (isNumericValue(op_1) && isMemoryAddress(op_2)) {
        //     intcpy(op_2, parseInt(op_1));
        //     info(
        //         `MOV: Moving immediate value ${op_1} into memory address ${op_2}.`
        //     );
        // } else {
        //     error("MOV: Invalid operands given.");
        // }
    };

    return { mov };
};
