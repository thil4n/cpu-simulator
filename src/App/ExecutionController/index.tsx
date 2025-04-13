import {
    useLoggerContext,
    useMemoryContext,
    useRegisterContext,
} from "@context";
import { bitArrayToNumber, parseSingleLine } from "@utils";
import { disassemble } from "@lib";

import { Button, Input } from "@components";

import useInstructions from "../../instructions/useInstructions";

const ExecutionController = () => {
    const { getMemoryBytes } = useMemoryContext();
    const { registers } = useRegisterContext();
    const logger = useLoggerContext();

    let rip = bitArrayToNumber(registers.rip);

    const { push, mov } = useInstructions();

    const parseAssembly = () => {
        const instruction = "formData.assemblyInput";

        const { operation, operandOne, operandTwo } =
            parseSingleLine(instruction);

        logger.info(
            `Parsing the instruction ${operation} with operand one is ${operandOne} ${
                operandTwo ? " and operand two is " + operandTwo : "."
            }`
        );

        switch (operation) {
            case "mov":
                const src = operandTwo;
                const dest = operandOne;
                mov(src, dest);
                break;

            case "push":
                push(operandOne);
                break;

            default:
                logger.error("Invalid operation given.");
                break;
        }
    };

    return (
        <div className="bg-[#555] bg-opacity-50 backdrop-blur-lg mt-2">
            <h1 className="bg-primary text-secondary w-full py-1 text-sm text-center uppercase mb-3">
                Control execution
            </h1>
            <div className="px-2">
                <div className="grid grid-cols-2 gap-1 -mt-1">
                    <Button text="Execute" handleClick={parseAssembly} />
                    <Button text="Custom" handleClick={parseAssembly} />
                </div>
            </div>
        </div>
    );
};

export default ExecutionController;
