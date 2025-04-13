import {
    useLoggerContext,
    useMemoryContext,
    useRegisterContext,
} from "@context";
import {
    isRegister,
    bitArrayToNumber,
    numberToBitArray,
    bytesToBits,
} from "@utils";

const usePop = () => {
    const { info, error } = useLoggerContext();
    const { getMemoryBytes } = useMemoryContext();
    const { registers, regset } = useRegisterContext();

    const pop = (operand: any) => {
        if (!isRegister(operand)) {
            error("Invalid operand for pop. Must be a register.");
            return;
        }

        const rspBits = registers.rsp ?? Array(64).fill(0);
        const rspValue = bitArrayToNumber(rspBits);

        const byteArray = getMemoryBytes(rspValue, 8);
        if (!byteArray || byteArray.length !== 8) {
            error("Failed to retrieve 8 bytes from memory for pop.");
            return;
        }

        const valueBits = bytesToBits(byteArray);
        regset(operand, valueBits);
        info(`Popped value into register ${operand}.`);

        const newRspValue = rspValue + 8;
        const newRspBits = numberToBitArray(newRspValue);
        regset("rsp", newRspBits);
        info(`Updated RSP from ${rspValue} to ${newRspValue}.`);
    };

    return pop;
};

export default usePop;
