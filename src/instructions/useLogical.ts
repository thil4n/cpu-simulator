import { useLoggerContext, useRegisterContext } from "@context";
import {
    isRegister,
    isNumericValue,
    bitArrayToNumber,
    numberToBitArray,
} from "@utils";

const useLogical = () => {
    const { info, error } = useLoggerContext();
    const { registers, regset } = useRegisterContext();

    const and = (dest: string, source: string) => {
        if (!isRegister(dest)) {
            error("AND: destination must be a register.");
            return;
        }

        const destBits = registers[dest] ?? Array(64).fill(0);
        const destVal = bitArrayToNumber(destBits);

        let srcVal: number;
        if (isRegister(source)) {
            srcVal = bitArrayToNumber(registers[source] ?? Array(64).fill(0));
            info(`AND ${dest} (${destVal}), ${source} (${srcVal})`);
        } else if (isNumericValue(source)) {
            srcVal = parseInt(source, 10);
            info(`AND ${dest} (${destVal}), ${srcVal}`);
        } else {
            error("AND: source must be a register or immediate.");
            return;
        }

        const result = destVal & srcVal;
        regset(dest as any, numberToBitArray(result));
        info(`${dest} updated to ${result}`);
    };

    const or = (dest: string, source: string) => {
        if (!isRegister(dest)) {
            error("OR: destination must be a register.");
            return;
        }

        const destBits = registers[dest] ?? Array(64).fill(0);
        const destVal = bitArrayToNumber(destBits);

        let srcVal: number;
        if (isRegister(source)) {
            srcVal = bitArrayToNumber(registers[source] ?? Array(64).fill(0));
            info(`OR ${dest} (${destVal}), ${source} (${srcVal})`);
        } else if (isNumericValue(source)) {
            srcVal = parseInt(source, 10);
            info(`OR ${dest} (${destVal}), ${srcVal}`);
        } else {
            error("OR: source must be a register or immediate.");
            return;
        }

        const result = destVal | srcVal;
        regset(dest as any, numberToBitArray(result));
        info(`${dest} updated to ${result}`);
    };

    const xor = (dest: string, source: string) => {
        if (!isRegister(dest) || !isRegister(source)) {
            error("XOR: both operands must be registers.");
            return;
        }

        const destBits = registers[dest] ?? Array(64).fill(0);
        const srcBits = registers[source] ?? Array(64).fill(0);
        const resultBits = destBits.map((bit: number, i: number) => bit ^ srcBits[i]);
        regset(dest as any, resultBits);
        info(`XOR ${dest}, ${source}`);
    };

    const not = (reg: string) => {
        if (!isRegister(reg)) {
            error("NOT: operand must be a register.");
            return;
        }

        const bits = registers[reg] ?? Array(64).fill(0);
        const resultBits = bits.map((bit: number) => bit ^ 1);
        regset(reg as any, resultBits);
        info(`NOT ${reg} — bitwise complement applied`);
    };

    return { and, or, xor, not };
};

export default useLogical;
