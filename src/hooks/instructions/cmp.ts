import { isMemoryAddress, isNumericValue, isRegister, parseAddr } from "@utils";
import intcpy from "./intcpy";

const cmp = (src: any, dest: any) => {
    let result;

    // src & dest : reg
    if (isRegister(src) && isRegister(dest)) {
        result = registers[dest] - registers[src];
        logger.info(`CMP ${src} -> ${dest} (Register to Register)`);
    }

    // src : reg | dest : mem addr
    else if (isRegister(src) && isMemoryAddress(dest)) {
        result = intcpy(parseAddr(dest)) - registers[src];
        logger.info(`CMP ${src} -> ${parseAddr(dest)} (Register to Memory)`);
    }

    // src : mem | dest : reg
    else if (isMemoryAddress(src) && isRegister(dest)) {
        result = registers[dest] - intcpy(parseAddr(src));
        logger.info(`CMP ${parseAddr(src)} -> ${dest} (Memory to Register)`);
    }

    // src & dest : mem addr
    else if (isMemoryAddress(src) && isMemoryAddress(dest)) {
        result = intcpy(parseAddr(dest)) - intcpy(parseAddr(src));
        logger.info(
            `CMP ${parseAddr(src)} -> ${parseAddr(dest)} (Memory to Memory)`
        );
    }

    // src : num value | dest : reg
    else if (isNumericValue(src) && isRegister(dest)) {
        result = registers[dest] - parseInt(src);
        logger.info(`CMP ${src} -> ${dest} (Immediate to Register)`);
    }

    // src : num value | dest : mem addr
    else if (isNumericValue(src) && isMemoryAddress(dest)) {
        result = intcpy(parseAddr(dest)) - parseInt(src);
        logger.info(`CMP ${src} -> ${parseAddr(dest)} (Immediate to Memory)`);
    }

    // Invalid operation
    else {
        logger.error("Invalid operands given for the CMP operation.");
        return;
    }

    // Set flags based on the result of the comparison
    setFlags(result);
};
