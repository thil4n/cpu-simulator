import { useLoggerContext, useRegisterContext } from "@context";
import {
    isRegister,
    isNumericValue,
    bitArrayToNumber,
    numberToBitArray,
} from "@utils";

const useShift = () => {
    const { info, error } = useLoggerContext();
    const { registers, regset } = useRegisterContext();

    const shl = (reg: string, amount: string) => {
        if (!isRegister(reg)) {
            error("SHL: operand must be a register.");
            return;
        }
        if (!isNumericValue(amount)) {
            error("SHL: shift amount must be an immediate value.");
            return;
        }

        const val = bitArrayToNumber(registers[reg] ?? Array(64).fill(0));
        const shift = parseInt(amount, 10) & 63; // mask to 6 bits like x86
        const result = val << shift;
        regset(reg as any, numberToBitArray(result));
        info(`SHL ${reg} by ${shift} — result: ${result}`);
    };

    const shr = (reg: string, amount: string) => {
        if (!isRegister(reg)) {
            error("SHR: operand must be a register.");
            return;
        }
        if (!isNumericValue(amount)) {
            error("SHR: shift amount must be an immediate value.");
            return;
        }

        const val = bitArrayToNumber(registers[reg] ?? Array(64).fill(0));
        const shift = parseInt(amount, 10) & 63;
        const result = val >>> shift; // logical shift right
        regset(reg as any, numberToBitArray(result));
        info(`SHR ${reg} by ${shift} — result: ${result}`);
    };

    return { shl, shr };
};

export default useShift;
