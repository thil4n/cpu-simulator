import { isMemoryAddress, isNumericValue, isRegister, parseAddr } from "@utils";
import intcpy from "./useIntcpy";

const sub = (src: any, dest: any) => {
    // src & dest : reg
    if (isRegister(src) && isRegister(dest)) {
        registers[dest] -= registers[src];
        logger.info(`SUB ${src} -> ${dest} (Register to Register)`);
    }

    // src : reg | dest : mem addr
    else if (isRegister(src) && isMemoryAddress(dest)) {
        let result = intcpy(parseAddr(dest)) - registers[src];
        intcpy(parseAddr(dest), result);
        logger.info(`SUB ${src} -> ${parseAddr(dest)} (Register from Memory)`);
    }

    // src : mem | dest : reg
    else if (isMemoryAddress(src) && isRegister(dest)) {
        registers[dest] -= intcpy(parseAddr(src));
        logger.info(`SUB ${parseAddr(src)} -> ${dest} (Memory to Register)`);
    }

    // src & dest : mem addr
    else if (isMemoryAddress(src) && isMemoryAddress(dest)) {
        let result = intcpy(parseAddr(dest)) - intcpy(parseAddr(src));
        intcpy(parseAddr(dest), result);
        logger.info(
            `SUB ${parseAddr(src)} -> ${parseAddr(dest)} (Memory to Memory)`
        );
    }

    // src : num value | dest : reg
    else if (isNumericValue(src) && isRegister(dest)) {
        registers[dest] -= parseInt(src);
        logger.info(`SUB ${src} -> ${dest} (Immediate to Register)`);
    }

    // src : num value | dest : mem addr
    else if (isNumericValue(src) && isMemoryAddress(dest)) {
        let result = intcpy(parseAddr(dest)) - parseInt(src);
        intcpy(parseAddr(dest), result);
        logger.info(`SUB ${src} -> ${parseAddr(dest)} (Immediate to Memory)`);
    }

    // Invalid operation
    else {
        logger.error("Invalid operands given for the SUB operation.");
    }
};

export default sub;
