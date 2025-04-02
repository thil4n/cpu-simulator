import { isMemoryAddress, isRegister, parseAddr } from "@utils";
import intcpy from "./useIntcpy";

const add = (src: any, dest: any) => {
    // src & dest : reg
    if (isRegister(src) && isRegister(dest)) {
        registers[dest] += registers[src];
        logger.info(`ADD ${src} -> ${dest} (Register to Register)`);
    }

    // src : reg | dest : mem addr
    else if (isRegister(src) && isMemoryAddress(dest)) {
        let result = registers[src] + intcpy(parseAddr(dest));
        intcpy(parseAddr(dest), result);
        logger.info(`ADD ${src} -> ${parseAddr(dest)} (Register to Memory)`);
    }

    // src : mem | dest : reg
    else if (isMemoryAddress(src) && isRegister(dest)) {
        registers[dest] += intcpy(parseAddr(src));
        logger.info(`ADD ${parseAddr(src)} -> ${dest} (Memory to Register)`);
    }

    // src & dest : mem addr
    else if (isMemoryAddress(src) && isMemoryAddress(dest)) {
        let result = intcpy(parseAddr(src)) + intcpy(parseAddr(dest));
        intcpy(parseAddr(dest), result);
        logger.info(
            `ADD ${parseAddr(src)} -> ${parseAddr(dest)} (Memory to Memory)`
        );
    }

    // src : num value | dest : reg
    else if (isNumericValue(src) && isRegister(dest)) {
        registers[dest] += parseInt(src);
        logger.info(`ADD ${src} -> ${dest} (Immediate to Register)`);
    }

    // src : num value | dest : mem addr
    else if (isNumericValue(src) && isMemoryAddress(dest)) {
        let result = parseInt(src) + intcpy(parseAddr(dest));
        intcpy(parseAddr(dest), result);
        logger.info(`ADD ${src} -> ${parseAddr(dest)} (Immediate to Memory)`);
    }

    // Invalid operation
    else {
        logger.error("Invalid operands given for the ADD operation.");
    }
};

export default add;
