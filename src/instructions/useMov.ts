import { useMemoryContext, useLoggerContext } from "@context";
import { isRegister, isMemoryAddress, isNumericValue } from "@utils";
import useIntcpy from "./useIntcpy";

const useMov = () => {
    const { registers, regset } = useMemoryContext();
    const { info, error } = useLoggerContext();
    const { intcpy } = useIntcpy();

    const mov = (op_1: any, op_2: any) => {
        // op_1 & op_2 are registers
        if (isRegister(op_1) && isRegister(op_2)) {
            regset(op_2, registers[op_1]);
            info(`MOV: Moving ${registers[op_1]} from ${op_1} to ${op_2}.`);
        }

        // op_1 is register, op_2 is memory
        else if (isRegister(op_1) && isMemoryAddress(op_2)) {
            intcpy(op_2, registers[op_1]);
            info(`MOV: Moving ${registers[op_1]} from ${op_1} to memory address ${op_2}.`);
        }

        // op_1 is memory, op_2 is register
        else if (isMemoryAddress(op_1) && isRegister(op_2)) {
            regset(op_2, op_1); // Assuming `op_1` holds a numeric memory value
            info(`MOV: Moving value at memory address ${op_1} to register ${op_2}.`);
        }

        // Both operands are memory addresses
        else if (isMemoryAddress(op_1) && isMemoryAddress(op_2)) {
            intcpy(op_2, op_1);
            info(`MOV: Moving value from memory address ${op_1} to ${op_2}.`);
        }

        // op_1 is numeric, op_2 is register
        else if (isNumericValue(op_1) && isRegister(op_2)) {
            regset(op_2, parseInt(op_1));
            info(`MOV: Moving immediate value ${op_1} into register ${op_2}.`);
        }

        // op_1 is numeric, op_2 is memory
        else if (isNumericValue(op_1) && isMemoryAddress(op_2)) {
            intcpy(op_2, parseInt(op_1));
            info(`MOV: Moving immediate value ${op_1} into memory address ${op_2}.`);
        }

        // Invalid operation
        else {
            error("MOV: Invalid operands given.");
        }
    };

    return { mov };
};

export default useMov;
