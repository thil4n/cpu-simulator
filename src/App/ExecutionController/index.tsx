import { useMemoryContext, useRegisterContext } from "@context";
import { bitArrayToNumber, parseSingleLine } from "@utils";
import { disassemble } from "@lib";
import { Cpu } from "lucide-react";

const ExecutionController = () => {
    const { getMemoryBytes } = useMemoryContext();
    const { registers } = useRegisterContext();

    let rip = bitArrayToNumber(registers.rip);

    return "df";
};

export default ExecutionController;
