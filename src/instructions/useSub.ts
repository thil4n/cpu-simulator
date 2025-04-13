import { useLoggerContext, useRegisterContext } from "@context";
import {
    isRegister,
    isNumericValue,
    bitArrayToNumber,
    numberToBitArray,
} from "@utils";

const useSub = () => {
    const { info, error } = useLoggerContext();
    const { registers, regset } = useRegisterContext();

    const sub = (dest: any, source: any) => {
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
            info(`Subtracting ${source} (${srcVal}) from ${dest} (${destVal})`);
        } else if (isNumericValue(source)) {
            srcVal = source;
            info(
                `Subtracting immediate value ${srcVal} from ${dest} (${destVal})`
            );
        } else {
            error("Source must be a register or an immediate number.");
            return;
        }

        const result = destVal - srcVal;
        const resultBits = numberToBitArray(result);
        regset(dest, resultBits);

        info(`${dest} updated to ${result}`);
    };

    return sub;
};

export default useSub;
