import { useState, useEffect } from "react";

import { useLoggerContext, useMemoryContext } from "@context";
import { Loader, Mobile, Modal, NavBar } from "@components";
import { useModal, useScreen } from "@hooks";

import Console from "./Console";
import MemoryView from "./MemoryView";
import RegisterView from "./RegisterView";
import MemoryBar from "./MemoryBar";
import InstructionView from "./InstructionView";
import ExecutionController from "./ExecutionController";
import ProgramLoader from "./programLoader";
import MemoryPanel from "./MemoryPanel";
import RegisterPanel from "./RegisterPanel";

interface ExamineMemory {
    startAddress: number;
    wordCount: number;
}

const App = () => {
    const [selectedRegister, setSelectedRegister] = useState<string | null>(
        null
    );

    const [examineMemory, setExamineMemory] = useState<ExamineMemory | null>(
        null
    );

    const [memoryRange, setMemRange] = useState<number[]>([]);
    const { modalStatus, openModal, closeModal } = useModal();

    const isDesktop = useScreen();

    const logger = useLoggerContext();
    const { memory } = useMemoryContext();

    const showMemory = (startAddr: number) => {
        const endAddr = startAddr + 200;
        let memRange = [];
        for (let index = startAddr; index < endAddr; index += 8) {
            memRange.push(index);
        }
        setMemRange(memRange);
    };

    const handleClickRegister = (register: string) => {
        setSelectedRegister(register);
        openModal("registerModal");
    };

    useEffect(() => {
        showMemory(1000);
    }, []);

    const loadingEnabled = import.meta.env.VITE_SHOW_LOADING == "true";
    const [loadingState, setLoadingState] = useState(loadingEnabled);

    return (
        <div className="w-full h-screen bg-[#2d3436]">
            {modalStatus.registerModal && selectedRegister && (
                <Modal
                    handleClose={() => {
                        closeModal("registerModal");
                        setExamineMemory(null);
                    }}
                    title={`Examine Register - ${selectedRegister.toUpperCase()}`}
                    className="w-[90%] text-secondary"
                >
                    <RegisterView register={selectedRegister} />
                </Modal>
            )}

            {modalStatus.memoryModal && examineMemory && (
                <Modal
                    handleClose={() => {
                        closeModal("memoryModal");
                        setExamineMemory(null);
                    }}
                    title={"Examine Memory"}
                    className="w-[90%] text-secondary"
                >
                    <MemoryView
                        startAddress={examineMemory?.startAddress}
                        wordCount={examineMemory?.wordCount}
                        memory={memory}
                    />
                </Modal>
            )}

            <NavBar />
            <div className="grid grid-cols-12 gap-2 fixed top-[30px]">
                <MemoryBar
                    handleExamineMemory={(address: any) => {
                        setExamineMemory({
                            startAddress: address,
                            wordCount: 8,
                        });
                        openModal("memoryModal");
                    }}
                    memoryRange={memoryRange}
                />
                <div className="relative min-h-screen flex flex-col col-span-7 w-full mt-4">
                    <div className="w-full col-span-5">
                        <InstructionView />
                    </div>

                    <div className="absolute bottom-[50px] w-full">
                        <Console />
                    </div>
                </div>

                <div className="w-full col-span-3 mt-4">
                    <ProgramLoader />
                    <ExecutionController />
                    <RegisterPanel handleClickRegister={handleClickRegister} />
                    <MemoryPanel showMemory={showMemory} />
                </div>
            </div>

            {loadingState && (
                <Loader
                    handleClose={() => {
                        logger.info("Initialization completed.");
                        setLoadingState(false);
                    }}
                />
            )}

            {!isDesktop && !loadingState && <Mobile />}
        </div>
    );
};

export default App;
