import {
    useLoggerContext,
    useMemoryContext,
    useRegisterContext,
} from "@context";
import { bitArrayToNumber, parseSingleLine } from "@utils";
import { disassemble } from "@lib";

import { Button, Input, Modal } from "@components";
import { useModal, useForm } from "@hooks";
import InstructionParser from "../InstructionParser";
import useInstructions from "../../instructions/useInstructions";

const ProgramLoader = () => {
    const { getMemoryBytes } = useMemoryContext();
    const { registers } = useRegisterContext();
    const logger = useLoggerContext();

    let rip = bitArrayToNumber(registers.rip);

    const { modalStatus, openModal, closeModal } = useModal();

    const { formData, handleChange } = useForm({
        assemblyInput: "",
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
                    Program
                </h1>
                <div className="px-2">
                    <div className="grid grid-cols-2 gap-1">
                        <Button
                            className="-mt-1"
                            text="LOAD PROGRAM"
                            handleClick={() => {
                                openModal("instructionModal");
                            }}
                        />
                        <Button
                            className="-mt-1"
                            text="Clear"
                            handleClick={() => {
                                logger.info("Cleared the instructions.");
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgramLoader;
