import { useMemoryContext } from "@context";

const mov = (op_1: any, op_2: any) => {
    // op_1 | op_2 : reg
    if (isRegister(op_1) && isRegister(op_2)) {
        registers[op_2] = registers[op_1];
        logger.info(`Moving the value ${op_1} into ${parseAddr(op_2)}.`);
    }

    // op_1 : reg | op_2 : mem addr
    else if (isRegister(op_1) && isMemoryAddress(op_2)) {
        intcpy(op_2, registers[op_1]);
        logger.info(`Moving the value ${op_1} into ${parseAddr(op_2)}.`);
    }

    // op_1 : mem |  op_2 : reg
    else if (isMemoryAddress(op_1) && isRegister(op_2)) {
        intcpy(registers[op_2], op_1);
        logger.info(`Moving the value ${op_1} into ${parseAddr(op_2)}.`);
    }

    // op_1 | op_2 : mem addr
    else if (isMemoryAddress(op_1) && isMemoryAddress(op_2)) {
        intcpy(op_2, op_1);
        logger.info(`Moving the value ${op_1} into ${parseAddr(op_2)}.`);
    }

    // op_1 : num value | op_2 : reg
    else if (isNumericValue(op_1) && isRegister(op_2)) {
        intcpy(registers[op_1], parseInt(op_1));
        logger.info(`Moving the value ${op_1} into ${parseAddr(op_2)}.`);
    }

    // op_1 : num value | op_2 : mem addr
    else if (isNumericValue(op_1) && isMemoryAddress(op_2)) {
        intcpy(parseAddr(op_2), parseInt(op_1));
        logger.info(`Moving the value ${op_1} into ${parseAddr(op_2)}.`);
    }

    // Invalid operation
    else {
        logger.error("Invalid operands given for the mov operation.");
    }
};
