import {
    useLoggerContext,
    useMemoryContext,
    useRegisterContext,
} from "@context";
import { bitArrayToNumber, numberToBitArray, parseSingleLine } from "@utils";
import { disassemble } from "@lib";

import { Button, Modal } from "@components";

import useInstructions from "../../instructions/useInstructions";
import { useModal } from "@hooks";
import CustomInstruction from "./CustomInstruction";

const ExecutionController = () => {
    const { getMemoryBytes } = useMemoryContext();
    const { registers, regset } = useRegisterContext();
    const logger = useLoggerContext();

    const { push, pop, mov, add, sub, cmp } = useInstructions();

    const { modalStatus, openModal, closeModal } = useModal();

    const execute = (line: string) => {
        const { operation, operandOne, operandTwo } = parseSingleLine(line);

        logger.info(
            `Parsing the instruction ${operation} with operand one is ${operandOne} ${
                operandTwo ? " and operand two is " + operandTwo : ""
            }.`
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

            case "pop":
                pop(operandOne);
                break;

            case "add":
                add(operandOne, operandTwo);
                break;

            case "sub":
                sub(operandOne, operandTwo);
                break;

            case "xor":
                // Reuse sub logic pattern — XOR on registers
                if (operandOne && operandTwo) {
                    const destBits = registers[operandOne] ?? Array(64).fill(0);
                    const srcBits = registers[operandTwo] ?? Array(64).fill(0);
                    const resultBits = destBits.map((bit: number, i: number) => bit ^ srcBits[i]);
                    regset(operandOne, resultBits);
                    logger.info(`XOR ${operandOne}, ${operandTwo}`);
                } else {
                    logger.error("XOR requires two register operands.");
                }
                break;

            case "cmp":
                cmp(operandOne, operandTwo);
                break;

            default:
                logger.error(`Unknown operation: ${operation}`);
                break;
        }
    };

    const executeCurrentInstruction = () => {
        let rip = bitArrayToNumber(registers.rip);
        const opcode = getMemoryBytes(rip, 10);

        const instructionLine = disassemble(opcode);

        execute(instructionLine.instruction);

        rip += instructionLine.length;

        regset("rip", numberToBitArray(rip));
    };

    return (
        <div>
            {modalStatus.customInstruction && (
                <Modal
                    title="Instruction"
                    handleClose={() => {
                        closeModal("customInstruction");
                    }}
                >
                    <CustomInstruction
                        handleExecution={(line: string) => {
                            execute(line);
                            closeModal("customInstruction");
                        }}
                    />
                </Modal>
            )}
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
                        <Button
                            text="Custom"
                            handleClick={() => openModal("customInstruction")}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExecutionController;
