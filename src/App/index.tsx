import { useState, useEffect } from "react";

import {
    useLoggerContext,
    useMemoryContext,
    useRegisterContext,
} from "@context";
import { Button, Loader, Mobile, Modal, NavBar } from "@components";
import { useModal, useScreen } from "@hooks";
import { adgp_registers, gp_registers } from "@lib";
import { bitArrayToNumber } from "@utils";

import Console from "./Console";
import MemoryView from "./MemoryView";
import RegisterView from "./RegisterView";
import MemoryBar from "./MemoryBar";
import InstructionView from "./InstructionView";
import ExecutionController from "./ExecutionController";
import ProgramLoader from "./programLoader";

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
    const { registers } = useRegisterContext();

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
                    <div className="bg-[#555] bg-opacity-50 backdrop-blur-lg mb-2 mt-2">
                        <h1 className="bg-primary  text-secondary w-full py-1 text-sm text-center uppercase">
                            CPU Registers
                        </h1>
                        <div className="grid grid-cols-3 gap-1 mt-3 px-2">
                            <div>
                                {gp_registers.map((register) => {
                                    return (
                                        <Button
                                            key={register}
                                            text={register}
                                            handleClick={() => {
                                                handleClickRegister(register);
                                            }}
                                        />
                                    );
                                })}
                            </div>
                            <div>
                                {adgp_registers.map((register) => {
                                    return (
                                        <Button
                                            key={register}
                                            text={register}
                                            handleClick={() => {
                                                handleClickRegister(register);
                                            }}
                                        />
                                    );
                                })}
                            </div>
                            <div>
                                <Button
                                    text={"RIP"}
                                    handleClick={() => {
                                        handleClickRegister("rip");
                                    }}
                                />
                                <Button
                                    text={"RFLAGS"}
                                    handleClick={() => {
                                        handleClickRegister("rflags");
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="bg-[#555] bg-opacity-50 backdrop-blur-lg">
                        <h1 className="bg-primary text-secondary w-full py-1 text-sm text-center uppercase">
                            Examine Memory
                        </h1>
                        <div className="px-2 py2 mt-3">
                            <div className="grid grid-cols-3 gap-x-1">
                                <Button
                                    text={"Stack"}
                                    handleClick={() => {
                                        const rsp = bitArrayToNumber(
                                            registers.rsp
                                        );

                                        logger.info("Showing the stack area");

                                        showMemory(rsp);
                                    }}
                                />
                                <Button
                                    text={"Heap"}
                                    handleClick={function (): void {
                                        throw new Error(
                                            "Function not implemented."
                                        );
                                    }}
                                />
                                <Button
                                    text={".BSS"}
                                    handleClick={function (): void {
                                        throw new Error(
                                            "Function not implemented."
                                        );
                                    }}
                                />
                                <Button
                                    text={".TXT"}
                                    handleClick={() => {
                                        const rip = bitArrayToNumber(
                                            registers.rip
                                        );

                                        logger.info("Showing the text segment");

                                        showMemory(rip);
                                    }}
                                />
                                <Button
                                    text={".DATA"}
                                    handleClick={function (): void {
                                        throw new Error(
                                            "Function not implemented."
                                        );
                                    }}
                                />
                                <Button
                                    text={"Address"}
                                    handleClick={function (): void {
                                        throw new Error(
                                            "Function not implemented."
                                        );
                                    }}
                                />
                            </div>
                        </div>
                    </div>
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
