import { useLoggerContext, useRegisterContext } from "@context";
import { isRegister, bitArrayToNumber, numberToBitArray } from "@utils";

const useMulDiv = () => {
    const { info, error } = useLoggerContext();
    const { registers, regset } = useRegisterContext();

    /** MUL reg — unsigned multiply: RDX:RAX = RAX * reg */
    const mul = (reg: string) => {
        if (!isRegister(reg)) {
            error("MUL: operand must be a register.");
            return;
        }

        const raxVal = bitArrayToNumber(registers.rax ?? Array(64).fill(0));
        const srcVal = bitArrayToNumber(registers[reg] ?? Array(64).fill(0));
        const result = raxVal * srcVal;

        // Low 64 bits → RAX, high bits → RDX (simplified: RDX = 0 for small numbers)
        regset("rax", numberToBitArray(result & 0xffffffff));
        regset("rdx", numberToBitArray(Math.floor(result / 0x100000000)));
        info(`MUL: RAX(${raxVal}) * ${reg}(${srcVal}) = ${result}  →  RAX=${result & 0xffffffff}, RDX=${Math.floor(result / 0x100000000)}`);
    };

    /** IMUL dest, src — signed two-operand multiply: dest = dest * src */
    const imul = (dest: string, src: string) => {
        if (!isRegister(dest) || !isRegister(src)) {
            error("IMUL: both operands must be registers.");
            return;
        }

        const destVal = bitArrayToNumber(registers[dest] ?? Array(64).fill(0));
        const srcVal = bitArrayToNumber(registers[src] ?? Array(64).fill(0));
        const result = destVal * srcVal;
        regset(dest as any, numberToBitArray(result));
        info(`IMUL ${dest}(${destVal}) * ${src}(${srcVal}) = ${result}`);
    };

    /** DIV reg — unsigned divide: RAX = RDX:RAX / reg, RDX = RDX:RAX % reg */
    const div = (reg: string) => {
        if (!isRegister(reg)) {
            error("DIV: operand must be a register.");
            return;
        }

        const raxVal = bitArrayToNumber(registers.rax ?? Array(64).fill(0));
        const srcVal = bitArrayToNumber(registers[reg] ?? Array(64).fill(0));

        if (srcVal === 0) {
            error("DIV: division by zero!");
            return;
        }

        const quotient = Math.trunc(raxVal / srcVal);
        const remainder = raxVal % srcVal;

        regset("rax", numberToBitArray(quotient));
        regset("rdx", numberToBitArray(remainder));
        info(`DIV: RAX(${raxVal}) / ${reg}(${srcVal}) → quotient=${quotient}, remainder=${remainder}`);
    };

    return { mul, imul, div };
};

export default useMulDiv;
