import { useMemoryContext } from "@context";
import { isMemoryAddress, isRegister } from "@utils";

const pop = (operand: any) => {
    if (isRegister(operand)) {
        //intcpy(registers.rsp, registers[operand]);
        logger.info(
            `Copying the value of top of the stack to the ${operand} register.`
        );
    } else if (isMemoryAddress(operand)) {
        logger.info(
            `Copying the value of top of the stack to the address ${operand}.`
        );
    } else {
        logger.error("Invalid operand given for the pop operation.");
    }
};
