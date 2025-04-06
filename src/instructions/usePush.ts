import {
    useLoggerContext,
    useMemoryContext,
    useRegisterContext,
} from "@context";
import { isRegister, isMemoryAddress, isNumericValue } from "@utils";
import useIntcpy from "./useIntcpy";

const usePush = () => {
    const { info, error } = useLoggerContext();
    const { registers, regset, memory, memset } = useMemoryContext();
    const { registers, regset } = useRegisterContext();
    const intcpy = useIntcpy();

    const push = (operand: any) => {
        let valueToPush: number | null = null;

        if (isRegister(operand)) {
            valueToPush = registers[operand];
            info(
                `Pushing the value of ${operand} register (${valueToPush}) onto the stack.`
            );
        } else if (isMemoryAddress(operand)) {
            valueToPush = memory[operand] || 0;
            info(
                `Pushing the value from the address ${operand} (${valueToPush}) onto the stack.`
            );
        } else if (isNumericValue(operand)) {
            valueToPush = parseInt(operand);
            info(`Pushing the value: ${valueToPush} onto the stack.`);
        } else {
            error("Invalid operand given for the push operation.");
            return;
        }

        if (valueToPush !== null) {
            // Decrease stack pointer (assuming a 4-byte stack)
            const newRsp = registers.rsp - 4;
            regset("rsp", newRsp);
        }
    };

    return push;
};

export default usePush;
