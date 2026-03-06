import { useLoggerContext, useRegisterContext } from "@context";
import { isRegister, bitArrayToNumber, numberToBitArray } from "@utils";

const useIncDec = () => {
    const { info, error } = useLoggerContext();
    const { registers, regset } = useRegisterContext();

    const inc = (reg: string) => {
        if (!isRegister(reg)) {
            error("INC: operand must be a register.");
            return;
        }

        const val = bitArrayToNumber(registers[reg] ?? Array(64).fill(0));
        const result = val + 1;
        regset(reg as any, numberToBitArray(result));
        info(`INC ${reg}: ${val} → ${result}`);
    };

    const dec = (reg: string) => {
        if (!isRegister(reg)) {
            error("DEC: operand must be a register.");
            return;
        }

        const val = bitArrayToNumber(registers[reg] ?? Array(64).fill(0));
        const result = val - 1;
        regset(reg as any, numberToBitArray(result));
        info(`DEC ${reg}: ${val} → ${result}`);
    };

    const neg = (reg: string) => {
        if (!isRegister(reg)) {
            error("NEG: operand must be a register.");
            return;
        }

        const val = bitArrayToNumber(registers[reg] ?? Array(64).fill(0));
        const result = -val;
        regset(reg as any, numberToBitArray(result));
        info(`NEG ${reg}: ${val} → ${result}`);
    };

    return { inc, dec, neg };
};

export default useIncDec;
