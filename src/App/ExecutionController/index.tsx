import {
    useLoggerContext,
    useMemoryContext,
    useRegisterContext,
} from "@context";
import { bitArrayToNumber, parseSingleLine } from "@utils";
import { disassemble } from "@lib";

import { Button } from "@components";

import useInstructions from "../../instructions/useInstructions";

const ExecutionController = () => {
    const { getMemoryBytes } = useMemoryContext();
    const { registers } = useRegisterContext();
    const logger = useLoggerContext();

    const { push, mov } = useInstructions();

    const execute = (line: string) => {
        const { operation, operandOne, operandTwo } = parseSingleLine(line);

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

    const executeCurrentInstruction = () => {
        let rip = bitArrayToNumber(registers.rip);
        const opcode = getMemoryBytes(rip, 10);

        const instructionLine = disassemble(opcode);

        execute(instructionLine.instruction);
    };

    return (
        <div className="bg-[#555] bg-opacity-50 backdrop-blur-lg mt-2">
            <h1 className="bg-primary text-secondary w-full py-1 text-sm text-center uppercase mb-3">
                Control execution
            </h1>
            <div className="px-2">
                <div className="grid grid-cols-2 gap-1 -mt-1">
                    <Button
                        text="Execute"
                        handleClick={() => executeCurrentInstruction()}
                    />
                    <Button text="Custom" handleClick={null} />
                </div>
            </div>
        </div>
    );
};

export default ExecutionController;
