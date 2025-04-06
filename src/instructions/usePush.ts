import {
    useLoggerContext,
    useMemoryContext,
    useRegisterContext,
} from "@context";
import {
    isRegister,
    bitsToBytes,
    isNumericValue,
    numberToLittleEndianBytes,
    bitArrayToNumber,
    numberToBitArray,
} from "@utils";

const usePush = () => {
    const { info, error } = useLoggerContext();
    const { setMemoryBytes } = useMemoryContext();
    const { registers, regset } = useRegisterContext();

    const push = (operand: any) => {
        let byteArray: number[] | null = null;

        if (isRegister(operand)) {
            const bitArray = registers[operand] ?? Array(64).fill(0);
            byteArray = bitsToBytes(bitArray);

            info(`Pushing the value of ${operand} register onto the stack.`);
        } else if (isNumericValue(operand)) {
            byteArray = numberToLittleEndianBytes(operand);
            info(`Pushing the value: ${operand} onto the stack.`);
        } else {
            error("Invalid operand given for the push operation.");
            return;
        }

        // Ensure it's 8 bytes
        while (byteArray.length < 8) {
            byteArray.push(0);
        }

        const rspBits = registers.rsp ?? Array(64).fill(0);
        const rspValue = bitArrayToNumber(rspBits);
        const newRspValue = rspValue - 8;

        setMemoryBytes(newRspValue, byteArray); // Store at new RSP (after decrement)

        const newRspBits = numberToBitArray(newRspValue);
        regset("rsp", newRspBits);

        info(`Updated RSP from ${rspValue} to ${newRspValue}.`);
    };

    return push;
};

export default usePush;
