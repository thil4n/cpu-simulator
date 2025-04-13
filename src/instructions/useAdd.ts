import { useLoggerContext, useRegisterContext } from "@context";
import {
    isRegister,
    isNumericValue,
    bitArrayToNumber,
    numberToBitArray,
} from "@utils";

const useAdd = () => {
    const { info, error } = useLoggerContext();
    const { registers, regset } = useRegisterContext();

    const add = (dest: any, source: any) => {
        if (!isRegister(dest)) {
            error("Destination must be a register.");
            return;
        }

        const destBits = registers[dest] ?? Array(64).fill(0);
        const destVal = bitArrayToNumber(destBits);

        let srcVal: number;
        if (isRegister(source)) {
            const srcBits = registers[source] ?? Array(64).fill(0);
            srcVal = bitArrayToNumber(srcBits);
            info(
                `Adding value of ${source} (${srcVal}) to ${dest} (${destVal})`
            );
        } else if (isNumericValue(source)) {
            srcVal = source;
            info(`Adding immediate value ${srcVal} to ${dest} (${destVal})`);
        } else {
            error("Source must be a register or an immediate number.");
            return;
        }

        const result = destVal + srcVal;
        const resultBits = numberToBitArray(result);
        regset(dest, resultBits);

        info(`${dest} updated to ${result}`);
    };

    return add;
};

export default useAdd;
