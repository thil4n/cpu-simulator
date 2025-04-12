import { useState, useEffect } from "react";
import { Cpu } from "lucide-react";

import {
    useLoggerContext,
    useMemoryContext,
    useRegisterContext,
} from "@context";
import { Button, Input, Loader, Mobile, Modal, NavBar } from "@components";
import { useForm, useModal, useScreen } from "@hooks";
import { adgp_registers, gp_registers, assemble } from "@lib";
import { bitArrayToNumber, parseSingleLine } from "@utils";

import InstructionParser from "./InstructionParser";
import Console from "./Console";
import MemoryView from "./MemoryView";

import useInstructions from "../instructions/useInstructions";
import RegisterView from "./RegisterView";
import MemoryBar from "./MemoryBar";

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

    const [instructions, setInstructions] = useState([]);
    const [memoryRange, setMemRange] = useState<number[]>([]);

    const { modalStatus, openModal, closeModal } = useModal();

    const { formData, handleChange } = useForm({
        assemblyInput: "",
        addrInput: "",
    });

    const isDesktop = useScreen();

    const logger = useLoggerContext();
    const { memory } = useMemoryContext();
    const { registers } = useRegisterContext();

    const { push, mov } = useInstructions();

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

    useEffect(() => {
        showMemory(1000);
    }, []);

    const loadingEnabled = import.meta.env.VITE_SHOW_LOADING == "true";
    const [loadingState, setLoadingState] = useState(loadingEnabled);

    return (
        <div className="w-full h-screen bg-[#2d3436]">
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

                    <div className="absolute bottom-[50px] w-full">
                        <Console />
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
                                        setInstructions([]);
                                        logger.info(
                                            "Cleared the instructions."
                                        );
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
