import {
    useLoggerContext,
    useMemoryContext,
    useRegisterContext,
} from "@context";
import { bitArrayToNumber, parseSingleLine } from "@utils";
import { assemble, disassemble } from "@lib";
import { Cpu } from "lucide-react";
import { Button, Input, Modal } from "@components";
import { useModal, useForm } from "@hooks";
import InstructionParser from "../InstructionParser";
import useInstructions from "../../instructions/useInstructions";

const ExecutionController = () => {
    const { getMemoryBytes } = useMemoryContext();
    const { registers } = useRegisterContext();
    const logger = useLoggerContext();

    let rip = bitArrayToNumber(registers.rip);

    const { modalStatus, openModal, closeModal } = useModal();

    const { formData, handleChange } = useForm({
        assemblyInput: "",
        addrInput: "",
    });

    const { push, mov } = useInstructions();

    const parseAssembly = () => {
        const instruction = formData.assemblyInput;

        const { operation, operandOne, operandTwo } =
            parseSingleLine(instruction);

        logger.info(
            `Parsing the instruction ${operation} with operand one is ${operandOne} ${
                operandTwo ? " and operand two is " + operandTwo : "."
            }`
        );

        const opcode = assemble({ operation, operandOne, operandTwo });

        function printHex(bytes: any[]) {
            return bytes
                .map((b: { toString: (arg0: number) => string }) =>
                    b.toString(16).padStart(2, "0")
                )
                .join(" ");
        }

        logger.info(`Opcode is ${printHex(opcode)}`);
        if (opcode.length == 0) {
            logger.error("No opcode generated.");
            return;
        }

        return;

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
        <div>
            {modalStatus.instructionModal && (
                <Modal
                    title="Instructions"
                    handleClose={() => {
                        closeModal("instructionModal");
                    }}
                >
                    <InstructionParser
                        handleClose={() => {
                            logger.info("Program loading completed.");
                            closeModal("instructionModal");
                        }}
                    />
                </Modal>
            )}

            <div className="bg-[#555] bg-opacity-50 backdrop-blur-lg">
                <h1 className="bg-primary text-secondary w-full py-1 text-sm text-center uppercase mb-3">
                    CONTROL EXECUTION
                </h1>
                <div className="px-2">
                    <div className="grid grid-cols-2 gap-1">
                        <Button
                            text="LOAD PROGRAM"
                            handleClick={() => {
                                openModal("instructionModal");
                            }}
                        />
                        <Button
                            text="Clear"
                            handleClick={() => {
                                logger.info("Cleared the instructions.");
                            }}
                        />
                    </div>
                    <div className="">
                        <Input
                            name="assemblyInput"
                            value={formData.assemblyInput}
                            handleChange={handleChange}
                            className=" bg-[#555] bg-opacity-50 backdrop-blur-lg text-secondary"
                        />
                    </div>
                    <div className="grid grid-cols-3 gap-1 -mt-1">
                        <Button text="BACK" handleClick={parseAssembly} />
                        <Button text="EXECUTE" handleClick={parseAssembly} />
                        <Button text="NEXT" handleClick={parseAssembly} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExecutionController;
