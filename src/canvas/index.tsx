import { useState, useEffect } from "react";

import { Button, Input, Loader, Modal } from "@components";

import { useForm, useModal } from "@hooks";

import AssemblyParser from "./AssemblyParser";
import Console from "./Console";
import MemoryCell from "./MemoryCell";
import MemoryView from "./MemoryView";

import { parseSingleLine } from "@utils";

import { useLoggerContext, useMemoryContext } from "@context";
import useInstructions from "../instructions/useInstructions";

interface ExamineMemory {
    startAddress: number;
    wordCount: number;
}

const Canvas = () => {
    const [selectedRegister, setSelectedRegister] = useState(null);
    const [examineMemory, setExamineMemory] = useState<ExamineMemory | null>(
        null
    );
    const [instructions, setInstructions] = useState([]);

    const { modalStatus, openModal, closeModal } = useModal({
        instructionsModal: false,
        registersModal: false,
        memoryModal: false,
    });

    const { formData, handleChange } = useForm({
        assemblyInput: "",
        addrInput: "",
    });

    const [memoryRange, setMemRange] = useState([]);

    const logger = useLoggerContext();

    const { registers, regset, memory, memset, adgpRegisters, gpRegisters } =
        useMemoryContext();
    const { pop, push, mov } = useInstructions();

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

            case "pop":
                pop(operandOne);
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
        <div className="w-full h-screen bg-[#2d3436] px-4">
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
            <div className="grid grid-cols-12 gap-2">
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
                <div className="relative min-h-screen flex flex-col col-span-7 w-full">
                    <div className="w-full col-span-5 mt-5">
                        <h1 className="bg-primary text-secondary w-full py-1 text-sm text-center uppercase">
                            ASSEMBLY INSTRUCTIONS
                        </h1>
                        <div className="bg-[#555] bg-opacity-50 backdrop-blur-lg px-6 py-4">
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
                        </div>
                    </div>

                    <div className="absolute bottom-1 w-full">
                        <Console logs={logger.logs} />
                    </div>
                </div>

                <div className="w-full col-span-3">
                    <div className="bg-[#555] bg-opacity-50 backdrop-blur-lg">
                        <h1 className="bg-primary text-secondary w-full py-1 text-sm text-center uppercase mb-3">
                            CONTROL EXECUTION
                        </h1>
                        <div className="px-2">
                            <Button
                                text="LOAD PROGRAM"
                                handleClick={() => {
                                    openModal("instructionModal");
                                }}
                            />
                            <div className="grid grid-cols-3 gap-1">
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
                            <Input
                                name="assemblyInput"
                                inputClassName="placeholder-gray-500"
                                placeholder="Assembly instruction"
                                value={formData.assemblyInput}
                                handleChange={handleChange}
                            />
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
                            <div className="grid grid-cols-3 gap-1">
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
        </div>
    );
};

export default Canvas;
