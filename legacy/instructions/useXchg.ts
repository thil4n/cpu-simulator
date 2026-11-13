import { useLoggerContext, useRegisterContext } from "@context";
import { isRegister } from "@utils";

const useXchg = () => {
    const { info, error } = useLoggerContext();
    const { registers, regset } = useRegisterContext();

    /** XCHG reg1, reg2 — swap the values of two registers */
    const xchg = (reg1: string, reg2: string) => {
        if (!isRegister(reg1) || !isRegister(reg2)) {
            error("XCHG: both operands must be registers.");
            return;
        }

        const bits1 = registers[reg1] ?? Array(64).fill(0);
        const bits2 = registers[reg2] ?? Array(64).fill(0);

        regset(reg1 as any, [...bits2]);
        regset(reg2 as any, [...bits1]);
        info(`XCHG ${reg1} ↔ ${reg2}`);
    };

    return xchg;
};

export default useXchg;
