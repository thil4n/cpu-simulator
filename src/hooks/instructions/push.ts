import { useMemoryContext } from "@context";

const push = (operand: any) => {
    const { memory, memset } = useMemoryContext();

    if (isRegister(operand)) {
        intcpy(registers.rsp, registers[operand]);
        logger.info(`Pushing the value of ${operand} register onto the stack.`);
    } else if (isMemoryAddress(operand)) {
        logger.info(
            `Pushing the value from the address ${operand}  onto the stack.`
        );
    } else if (isNumericValue(operand)) {
        intcpy(registers.rsp, parseInt(operand));
        logger.info(`Pushing the value : ${operand}  onto the stack.`);
    } else {
        logger.error("Invalid operand given for the push operation.");
    }
};
