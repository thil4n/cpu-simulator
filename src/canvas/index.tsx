import { useState, useEffect } from "react";

import { Button, Input, Loader, Mobile, Modal, NavBar } from "@components";

import { useForm, useModal, useScreen } from "@hooks";

import AssemblyParser from "./AssemblyParser";
import Console from "./Console";
import MemoryCell from "./MemoryCell";
import MemoryView from "./MemoryView";

import { parseSingleLine } from "@utils";

import { useLoggerContext, useMemoryContext } from "@context";
import useInstructions from "../instructions/useInstructions";
import { Cpu } from "lucide-react";
import RegisterView from "./RegisterView";

interface ExamineMemory {
    startAddress: number;
    wordCount: number;
}

const Canvas = () => {
    const [selectedRegister, setSelectedRegister] = useState<string | null>(
        null
    );

    const [examineMemory, setExamineMemory] = useState<ExamineMemory | null>(
        null
    );
    const [instructions, setInstructions] = useState([]);

    const { modalStatus, openModal, closeModal } = useModal();

    const { formData, handleChange } = useForm({
        assemblyInput: "",
        addrInput: "",
    });

    const [memoryRange, setMemRange] = useState([]);

    const logger = useLoggerContext();

    const isDesktop = useScreen();

    const { registers, regset, memory, memset, adgpRegisters, gpRegisters } =
        useMemoryContext();
    const { push, mov } = useInstructions();

    console.log(mov);

    const showMemory = (startAddr: number, highlightLength = 0) => {
        const endAddr = startAddr + 200;
        let memRange = [];
        for (let index = startAddr; index < endAddr; index += 8) {
            memRange.push({
                address: index,
                highlight: index - startAddr < highlightLength,
            });
        }
        setMemRange(memRange);
    };

    const handleClickRegister = (register) => {
        setSelectedRegister(register);
        openModal("registerModal");
    };

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

    useEffect(() => {
        showMemory(1000);
    }, []);

    const execute = () => {
        parseAssembly();
    };

    const [loadingState, setLoadingState] = useState(false);

    return (
        <div className="w-full h-screen bg-[#2d3436]">
            {modalStatus.instructionModal && (
                <Modal
                    title="Instructions"
                    handleClose={() => {
                        closeModal("instructionModal");
                    }}
                >
                    <AssemblyParser
                        setInstructions={(cpuInstructions) => {
                            setInstructions(cpuInstructions);
                            closeModal("instructionModal");
                        }}
                    />
                </Modal>
            )}

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
                <div
                    className="h-screen  overflow-y-auto w-full col-span-2 "
                    id="style-1"
                >
                    {memoryRange.map((cell) => {
                        return (
                            <MemoryCell
                                cell={cell}
                                key={Math.random()}
                                handleExamineMemory={() => {
                                    setExamineMemory({
                                        startAddress: cell.address,
                                        wordCount: 8,
                                    });
                                    openModal("memoryModal");
                                }}
                                value={memory[cell.address]}
                            />
                        );
                    })}
                </div>
                <div className="relative min-h-screen flex flex-col col-span-7 w-full mt-4">
                    <div className="w-full col-span-5">
                        <h1 className="bg-primary text-secondary w-full py-1 text-sm text-center uppercase">
                            ASSEMBLY INSTRUCTIONS
                        </h1>
                        <div className="bg-[#555] bg-opacity-50 backdrop-blur-lg px-6 py-4 min-h-[400px]">
                            {instructions.map((line: any) => {
                                return (
                                    <div className="flex py-1 px-2 border-b border-secondary hover:bg-primary text-slate-400 hover:text-secondary  cursor-pointer">
                                        <div className="w-32">
                                            {line.operation}
                                        </div>
                                        <div className="w-[300px]">
                                            {line.operandOne}
                                        </div>
                                        <div className="">
                                            {line.operandTwo}
                                        </div>
                                    </div>
                                );
                            })}
                            {instructions.length == 0 && (
                                <div className="w-full flex flex-col justify-center items-center">
                                    <Cpu
                                        size={64}
                                        className="text-7xl text-secondary mb-4"
                                    />
                                    <h1 className="text-secondary text-sm">
                                        No instructions loaded. Click on Load
                                        Program to load instructions.
                                    </h1>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="absolute bottom-1 w-full">
                        <Console logs={logger.logs} />
                    </div>
                </div>

                <div className="w-full col-span-3 mt-4">
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
                                        openModal("instructionModal");
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
                                <Button
                                    text="BACK"
                                    handleClick={parseAssembly}
                                />
                                <Button
                                    text="EXECUTE"
                                    handleClick={parseAssembly}
                                />
                                <Button
                                    text="NEXT"
                                    handleClick={parseAssembly}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="bg-[#555] bg-opacity-50 backdrop-blur-lg mb-2 mt-2">
                        <h1 className="bg-primary  text-secondary w-full py-1 text-sm text-center uppercase">
                            CPU REGISTERS
                        </h1>
                        <div className="grid grid-cols-3 gap-1 mt-3 px-2">
                            <div>
                                {gpRegisters.map((register) => {
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
                                {adgpRegisters.map((register) => {
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
                                        const rbp = registers.rbp;
                                        const rsp = registers.rsp;
                                        const stackLength = rsp - rbp;
                                        showMemory(rbp, stackLength);
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
                                    handleClick={function (): void {
                                        throw new Error(
                                            "Function not implemented."
                                        );
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

export default Canvas;
