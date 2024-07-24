import { useState, useEffect, SetStateAction } from "react";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";

import { Button, Input, Loader } from "@components";

import MemoryCell from "./MemoryCell";
import Register from "./Register";
import MemoryView from "./MemoryView";
import { useForm } from "@hooks";
import { log } from "console";

const Canvas = () => {
    const [selectedRegister, setSelectedRegister] = useState(null);
    const [examineMemory, setExamineMemory] = useState(null);

    const [loadingState, setLoadingState] = useState(true);
    const { formData, handleChange, setErrors } = useForm({
        assemblyInput: "",
        addrInput: "",
    });

    const [memory, setMemory] = useState([]);
    const [memoryValues, memset] = useState({});

    const registers = {
        rax: { key: "rax", data: null, desc: "Accumulator Register" },
        rbx: { key: "rbx", data: null, desc: "Base Register" },
        rcx: { key: "rcx", data: null, desc: "Counter Register" },
        rdx: { key: "rdx", data: null, desc: "Data Register" },

        rsi: { key: "rsi", data: null, desc: "Source Index Register" },
        rdi: { key: "rdi", data: null, desc: "Destination Index Register" },

        rbp: { key: "rbp", data: 10000, desc: "Base Pointer Register" },
        rsp: { key: "rsp", data: 10100, desc: "Stack Pointer Register" },

        r8: { key: "r8", data: null, desc: "R8 Register" },
        r9: { key: "r9", data: null, desc: "R9 Register" },
        r10: { key: "r10", data: null, desc: "R10 Register" },
        r11: { key: "r11", data: null, desc: "R11 Register" },
        r12: { key: "r12", data: null, desc: "R12 Register" },
        r13: { key: "r13", data: null, desc: "R13 Register" },
        r14: { key: "r14", data: null, desc: "R14 Register" },
        r15: { key: "r15", data: null, desc: "R15 Register" },

        rip: { key: "rip", data: null, desc: "Instruction Pointer Register" },

        rflags: { key: "rflags", data: null, desc: "R Flags Register" },
    };

    const gp_registers = [
        "rax",
        "rbx",
        "rcx",
        "rdx",
        "rsi",
        "rdi",
        "rbp",
        "rsp",
    ];
    const adgp_registers = [
        "r8",
        "r9",
        "r10",
        "r11",
        "r12",
        "r13",
        "r14",
        "r15",
    ];

    const showMemory = (startAddr: number, highlightLength = 0) => {
        const endAddr = startAddr + 200;
        let memory = [];

        for (let index = startAddr; index < endAddr; index += 8) {
            memory.push({
                address: index,
                highlight: index - startAddr < highlightLength,
            });
        }

        setMemory(memory);
    };

    const is64BitRegister = (str: string) => {
        const gpRegisters = [
            "rax",
            "rbx",
            "rcx",
            "rdx",

            "rsi",
            "rdi",

            "rbp",
            "rsp",
        ];

        const adgpRegisters = [
            "r8",
            "r9",
            "r10",
            "r11",
            "r12",
            "r13",
            "r14",
            "r15",
        ];

        const sppRegisters = ["rip", "rflags"];

        return (
            gpRegisters.includes(str) ||
            adgpRegisters.includes(str) ||
            sppRegisters.includes(str)
        );
    };

    const is32BitRegister = (str: string) => {
        const gpRegisters = [
            "eax",
            "ebx",
            "ecx",
            "edx",

            "esi",
            "edi",

            "ebp",
            "esp",
        ];

        const adgpRegisters = [
            "r8d",
            "r9d",
            "r10d",
            "r11d",
            "r12d",
            "r13d",
            "r14d",
            "r15d",
        ];

        return gpRegisters.includes(str) || adgpRegisters.includes(str);
    };

    const is16BitRegister = (str: string) => {
        const gpRegisters = ["ax", "bx", "cx", "dx", "si", "di", "bp", "sp"];

        const adgpRegisters = [
            "r8w",
            "r9w",
            "r10w",
            "r11w",
            "r12w",
            "r13w",
            "r14w",
            "r15w",
        ];

        return gpRegisters.includes(str) || adgpRegisters.includes(str);
    };

    const is8BitRegister = (str: string) => {
        const gpRegistersLower = ["al", "bl", "cl", "dl"];
        const gpRegistersHigher = ["ah", "bh", "ch", "dh"];

        const idgpRegisters = ["sil", "dil"];

        const adgpRegisters = [
            "r8b",
            "r9b",
            "r10b",
            "r11b",
            "r12b",
            "r13b",
            "r14b",
            "r15b",
        ];

        return (
            gpRegistersLower.includes(str) ||
            gpRegistersHigher.includes(str) ||
            idgpRegisters.includes(str) ||
            adgpRegisters.includes(str)
        );
    };

    const isRegister = (str: string): boolean => {
        const registers = [
            "rax",
            "rbx",
            "rcx",
            "rdx",
            "rsi",
            "rdi",
            "rbp",
            "rsp",
            "r8",
            "r9",
            "r10",
            "r11",
            "r12",
            "r13",
            "r14",
            "r15",
            "eax",
            "ebx",
            "ecx",
            "edx",
            "esi",
            "edi",
            "ebp",
            "esp",
            "ax",
            "bx",
            "cx",
            "dx",
            "si",
            "di",
            "bp",
            "sp",
            "al",
            "bl",
            "cl",
            "dl",
            "ah",
            "bh",
            "ch",
            "dh",
            "sil",
            "dil",
            "r8b",
            "r9b",
            "r10b",
            "r11b",
            "r12b",
            "r13b",
            "r14b",
            "r15b",
        ];
        return registers.includes(str.toLowerCase());
    };

    const isNumericValue = (str: string): boolean => {
        return /^[0-9]+$/.test(str);
    };

    const isMemoryAddress = (str: string): boolean => {
        return /^0x[0-9a-fA-F]+$/.test(str);
    };

    const handleClickRegister = (register: SetStateAction<null>) => {
        setSelectedRegister(register);
    };

    const handleMove = (src: any, dest: any) => {};

    const accessMemory = (src: any, dest: any) => {};

    const intcpy = (dest: number, value: number) => {
        const memoryValuesCopy = { ...memoryValues };
        const binaryString = value.toString(2).padStart(64, "0");

        for (let i = 0; i < 8; i++) {
            const byteString = binaryString.slice(i * 8, (i + 1) * 8);

            memoryValuesCopy[dest + 7 - i] = byteString;
        }

        memset(memoryValuesCopy);

        console.log(registers.rsp.data);
    };

    const strcpy = (dest: number, string: string) => {
        const memoryValuesCopy = { ...memoryValues };
        const binaryString = value.toString(2).padStart(64, "0");

        for (let i = 0; i < 8; i++) {
            const byteString = binaryString.slice(i * 8, (i + 1) * 8);

            memoryValuesCopy[dest + 7 - i] = byteString;
        }

        memset(memoryValuesCopy);
    };

    const handlePush = (operand: any) => {
        if (isRegister(operand)) {
            intcpy(registers.rsp.data, registers[operand].data);
            toast.info(" operand  is a register");
        } else if (isMemoryAddress(operand)) {
            toast.info(" operand  is a memory address");
        } else if (isNumericValue(operand)) {
            toast.info(" operand  is a value");
            intcpy(registers.rsp.data, parseInt(operand));
        } else {
            toast.info(" Invalid operand");
        }
    };

    const handlePop = (dest: any) => {};
    const handleAdd = (src: any, dest: any) => {};
    const handleSub = (src: any, dest: any) => {};
    const handleCmp = (src: any, dest: any) => {};

    const parseSingleLine = (instruction: string) => {
        const [operation, operands] = instruction
            .match(/(\S+)\s+(.*)/)
            .slice(1);
        const [operandOne, operandTwo] = operands.split(/[,\s]+/);

        console.log("operation: " + operation);
        console.log("operandOne: " + operandOne);
        console.log("operandTwo: " + operandTwo);

        return [operation, operandOne, operandTwo];
    };
    const parseAssembly = () => {
        const instruction = formData.assemblyInput;

        const [operation, operandOne, operandTwo] =
            parseSingleLine(instruction);

        switch (operation) {
            case "mov":
                const src = operandTwo;
                const dest = operandOne;

                break;

            case "push":
                handlePush(operandOne);

                break;

            default:
                break;
        }
    };

    useEffect(() => {
        showMemory(20000);
    }, []);

    const cpuInstructions = [
        { instruction: "push", operands: ["ebp"] },
        { instruction: "mov", operands: ["ebp", "esp"] },
        { instruction: "and", operands: ["esp", "0xfffffff0"] },
        { instruction: "sub", operands: ["esp", "0x60"] },
        { instruction: "mov", operands: ["DWORD PTR [esp+0x5c]", "0x0"] },
        { instruction: "lea", operands: ["eax", "[esp+0x1c]"] },
        { instruction: "mov", operands: ["DWORD PTR [esp]", "eax"] },
        { instruction: "call", operands: ["0x804830c <gets@plt>"] },
        { instruction: "mov", operands: ["eax", "DWORD PTR [esp+0x5c]"] },
        { instruction: "test", operands: ["eax", "eax"] },
        { instruction: "je", operands: ["0x8048427 <main+51>"] },
        { instruction: "mov", operands: ["DWORD PTR [esp]", "0x8048500"] },
        { instruction: "call", operands: ["0x804832c <puts@plt>"] },
        { instruction: "jmp", operands: ["0x8048433 <main+63>"] },
        { instruction: "mov", operands: ["DWORD PTR [esp]", "0x8048529"] },
        { instruction: "call", operands: ["0x804832c <puts@plt>"] },
        { instruction: "leave", operands: [] },
        { instruction: "ret", operands: [] },
    ];

    const execute = () => {
        parseAssembly();
    };

    return (
        <div className="w-full h-screen bg-[#2d3436] px-4">
            <ToastContainer />
            <div className="grid grid-cols-12 gap-2">
                <div
                    className="h-screen  overflow-y-auto w-full col-span-2 "
                    id="style-1"
                >
                    {memory.map((cell) => {
                        return (
                            <MemoryCell
                                cell={cell}
                                key={Math.random()}
                                handleExamineMemory={setExamineMemory}
                                value={memoryValues[cell.address]}
                            />
                        );
                    })}
                </div>
                <div className="w-full col-span-5 mt-5">
                    <h1 className="bg-primary text-secondary w-full py-2 text-center uppercase">
                        ASSEMBLY INSTRUCTIONS
                    </h1>
                    <div className="bg-[#555] bg-opacity-50 backdrop-blur-lg px-6 py-4">
                        {cpuInstructions.map((line) => {
                            return (
                                <div className="flex py-1 px-2 border-b border-secondary hover:bg-primary text-slate-400 hover:text-secondary  cursor-pointer">
                                    <div className="w-32">
                                        {line.instruction}
                                    </div>
                                    <div className="w-[300px]">
                                        {line.operands[0]}
                                    </div>
                                    <div className="">{line.operands[1]}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="w-full col-span-2 mt-5">
                    <div className="bg-[#555] bg-opacity-50 backdrop-blur-lg">
                        <h1 className="bg-primary text-secondary w-full py-2 text-center uppercase mb-3">
                            CONTROL EXECUTION
                        </h1>
                        <div className="px-2">
                            <Button text="LOAD PROGRAM" handleClick={execute} />
                            <Button
                                text="BREAKPOINTS"
                                handleClick={parseAssembly}
                            />
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    text="BACK"
                                    handleClick={parseAssembly}
                                />
                                <Button
                                    text="NEXT"
                                    handleClick={parseAssembly}
                                />
                            </div>
                            <Input
                                name="assemblyInput"
                                value={formData.assemblyInput}
                                handleChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="w-full col-span-3">
                    <div className="bg-[#555] bg-opacity-50 backdrop-blur-lg mb-5 mt-5">
                        <h1 className="bg-primary  text-secondary w-full py-2 text-center uppercase">
                            CPU REGISTERS
                        </h1>
                        <div className="grid grid-cols-3 gap-1 mt-3 px-2">
                            <div>
                                {gp_registers.map((register) => {
                                    return (
                                        <Button
                                            key={register}
                                            text={register}
                                            handleClick={handleClickRegister}
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
                                            handleClick={handleClickRegister}
                                        />
                                    );
                                })}
                            </div>
                            <div>
                                <Button
                                    text={"RIP"}
                                    handleClick={handleClickRegister}
                                />
                                <Button
                                    text={"RFLGAS"}
                                    handleClick={handleClickRegister}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="bg-[#555] bg-opacity-50 backdrop-blur-lg">
                        <h1 className="bg-primary text-secondary w-full py-2 text-center uppercase">
                            Examine Memory
                        </h1>
                        <div className="px-2 py2 mt-3">
                            <div className="grid grid-cols-3 gap-1">
                                <Button
                                    text={"Stack"}
                                    handleClick={() => {
                                        const rbp = registers.rbp.data;
                                        const rsp = registers.rsp.data;
                                        const stackLength = rsp - rbp;
                                        showMemory(rbp, stackLength);
                                    }}
                                />
                                <Button text={"Heap"} />
                                <Button text={".BSS"} />
                                <Button text={".TXT"} />
                                <Button text={".DATA"} />
                                <Button text={"Address"} />
                            </div>
                            <div className="  grid grid-cols-2 gap-2">
                                <Button
                                    text={"Examine"}
                                    handleClick={() => {
                                        const value = parseInt(
                                            inputs.addrInput.data
                                        );
                                        showMemory(value);
                                    }}
                                />
                                <Button
                                    text={"Clear"}
                                    handleClick={() => {
                                        const value = parseInt(
                                            inputs.addrInput.data
                                        );
                                        showMemory(value);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {examineMemory && (
                <MemoryView
                    startAddr={examineMemory.startAddr}
                    wordCount={examineMemory.wordCount}
                    handleClose={() => setExamineMemory(null)}
                    memoryValues={memoryValues}
                />
            )}
            {/* {loadingState && (
                <Loader handleClose={() => setLoadingState(false)} />
            )} */}
        </div>
    );
};

export default Canvas;
