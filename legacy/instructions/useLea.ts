import { useLoggerContext, useRegisterContext } from "@context";
import { isRegister, isNumericValue, numberToBitArray } from "@utils";

const useLea = () => {
    const { info, error } = useLoggerContext();
    const { regset } = useRegisterContext();

    /** LEA dest, imm — load effective address (simplified: loads immediate into register) */
    const lea = (dest: string, addr: string) => {
        if (!isRegister(dest)) {
            error("LEA: destination must be a register.");
            return;
        }
        if (!isNumericValue(addr)) {
            error("LEA: address must be a numeric value.");
            return;
        }

        const value = parseInt(addr, 10);
        regset(dest as any, numberToBitArray(value));
        info(`LEA ${dest}, ${value} — loaded address into register`);
    };

    return lea;
};

export default useLea;
