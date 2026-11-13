import { useLoggerContext, useRegisterContext } from "@context";
import { isRegister, bitArrayToNumber } from "@utils";

const useTest = () => {
    const { info, error } = useLoggerContext();
    const { registers, regset } = useRegisterContext();

    /** TEST dst, src — compute dst AND src, set flags, discard result */
    const test = (dst: string, src: string) => {
        if (!isRegister(dst) || !isRegister(src)) {
            error("TEST: both operands must be registers.");
            return;
        }

        const dstVal = bitArrayToNumber(registers[dst] ?? Array(64).fill(0));
        const srcVal = bitArrayToNumber(registers[src] ?? Array(64).fill(0));
        const result = dstVal & srcVal;

        const ZF = result === 0 ? 1 : 0;
        const SF = result < 0 ? 1 : 0;

        const rflagsBits = Array(64).fill(0);
        rflagsBits[63] = 0;   // CF always cleared
        rflagsBits[57] = ZF;  // Bit 6: Zero Flag
        rflagsBits[56] = SF;  // Bit 7: Sign Flag
        regset("rflags", rflagsBits);

        info(`TEST ${dst}(${dstVal}) & ${src}(${srcVal}) = ${result}  →  ZF=${ZF}, SF=${SF}`);
    };

    return test;
};

export default useTest;
