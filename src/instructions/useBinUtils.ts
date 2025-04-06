import { useRegisterContext } from "@context";

export const useBinaryUtils = () => {
    const { registers, regset, regget } = useRegisterContext();

    // Register getter (ensures default zeros)
    const getRegisterBits = (reg: string): number[] => {
        return registers[reg] ?? Array(64).fill(0);
    };

    return {
        getRegisterBits,
        regset,
        regget,
    };
};
