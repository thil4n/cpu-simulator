import { useLoggerContext, useRegisterContext } from "@context";
import { isRegister, isNumericValue, bitArrayToNumber } from "@utils";

const useCmp = () => {
    const { info, error } = useLoggerContext();
    const { registers, regset } = useRegisterContext();

    const cmp = (op1: any, op2: any) => {
        let val1: number;
        let val2: number;

        if (isRegister(op1)) {
            const bits1 = registers[op1] ?? Array(64).fill(0);
            val1 = bitArrayToNumber(bits1);
        } else {
            error("First operand must be a register.");
            return;
        }

        if (isRegister(op2)) {
            const bits2 = registers[op2] ?? Array(64).fill(0);
            val2 = bitArrayToNumber(bits2);
        } else if (isNumericValue(op2)) {
            val2 = op2;
        } else {
            error("Second operand must be a register or immediate value.");
            return;
        }

        const result = val1 - val2;

        const ZF = result === 0 ? 1 : 0;
        const SF = result < 0 ? 1 : 0;
        const CF = val1 < val2 ? 1 : 0;

        regset("rflags", {
            ...registers.rflags,
            ZF,
            SF,
            CF,
        });

        info(
            `Compared ${op1} (${val1}) with ${
                isRegister(op2) ? op2 : op2
            }, result: ${result}`
        );
        info(`Flags updated: ZF=${ZF}, SF=${SF}, CF=${CF}`);
    };

    return cmp;
};

export default useCmp;
