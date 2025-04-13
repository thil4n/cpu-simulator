import {
    useLoggerContext,
    useMemoryContext,
    useRegisterContext,
} from "@context";

import { Button, Modal } from "@components";
import { useModal } from "@hooks";
import InstructionParser from "./InstructionParser";

const ProgramLoader = () => {
    const logger = useLoggerContext();
    const { clearMemory } = useMemoryContext();
    const { clearRegisters } = useRegisterContext();

    const { modalStatus, openModal, closeModal } = useModal();

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
                            text="Reset"
                            handleClick={() => {
                                clearMemory();
                                logger.info("Clearing the memory.");

                                clearRegisters();
                                logger.info("Clearing the registers.");

                                logger.info(
                                    "Pointing the RIP to the start of text section."
                                );
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgramLoader;
