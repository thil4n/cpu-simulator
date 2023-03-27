import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Button, TextArea, Input } from "../../components/ui";
import RegisterModal from "./Register";

const Canvas = () => {
    const [selectedRegister, setselectedRegister] = useState(null);
    const [memory, setMemory] = useState([]);

    const inputDataStructure = {
        assemblyInput: {
            key: "assemblyInput",
            label: "Assembly code",
            data: "",
            type: "text",
            rows: 10,
            isValid: true,
            error: "",
        },
        addrInput: {
            key: "addrInput",
            label: "",
            data: "",
            type: "text",
            placeHolder: "0X000186F0",
            isValid: true,
            error: "",
        },
    };

    const [inputs, setInputs] = useState(inputDataStructure);

    const handleChange = (data, input) => {
        input.data = data;

        let input_list = { ...inputs };
        input_list[input.key] = input;
        setInputs(input_list);
    };

    let gpRegisters = {
        rax: { key: "rax", data: null, desc: "Acumilator Register" },
        rbx: { key: "rbx", data: null, desc: "Base Register" },
        rcx: { key: "rcx", data: null, desc: "Counter Register" },
        rdx: { key: "rdx", data: null, desc: "Data Register" },

        rsi: { key: "rsi", data: null, desc: "Source Index Register" },
        rdi: { key: "rdi", data: null, desc: "Destination Index Register" },

        rbp: { key: "rbp", data: 10000, desc: "Base Pointer Register" },
        rsp: { key: "rsp", data: 10100, desc: "Stack Pointer Register" },
    };

    let adgpRegisters = {
        r8: { key: "r8", data: null, desc: "R8 Register" },
        r9: { key: "r9", data: null, desc: "R9 Register" },
        r10: { key: "r10", data: null, desc: "R10 Register" },
        r11: { key: "r11", data: null, desc: "R11 Register" },
        r12: { key: "r12", data: null, desc: "R12 Register" },
        r13: { key: "r13", data: null, desc: "R13 Register" },
        r14: { key: "r14", data: null, desc: "R14 Register" },
        r15: { key: "r15", data: null, desc: "R15 Register" },
    };

    let rip = { key: "rip", data: null, desc: "Instruction Pointer Register" };
    let rflags = { key: "rflags", data: null, desc: "R Flags Register" };

    const gpRegisterArray = Object.values(gpRegisters);
    const adgpRegisterArray = Object.values(adgpRegisters);

    const showMemory = (startAddr, highlightLength = 8) => {
        const endAddr = startAddr + 400;
        let memory = [];

        for (let index = startAddr; index < endAddr; index += 8) {
            memory.push({
                address: index,
                highlight: index - startAddr < highlightLength,
            });
        }

        setMemory(memory);
    };

    const Register = ({ register, handleClick }) => {
        return (
            <div
                onClick={() => handleClick(register)}
                className="w-full border-2 border-primary px-12 py-2 font-semibold bg-white text-primary hover:text-white hover:bg-primary hover:border-white cursor-pointer rounded-md mb-4 text-center uppercase"
            >
                {register.key}
            </div>
        );
    };

    const MemoryCell = ({ cell, handleClick }) => {
        let hex = "0x" + cell.address.toString(16).padStart(8, "0");

        let classList =
            "w-full border-2 border-primary px-12 py-2 font-semibold  text-primary hover:text-white hover:bg-primary hover:border-white cursor-pointer rounded-md mb-1 text-center uppercase ";
        classList += cell.highlight ? "bg-[#ccc]" : "bg-white";

        return (
            <div
                // onClick={() => handleClick(register)}
                className={classList}
            >
                {hex}
            </div>
        );
    };

    const is64BitRegister = (str) => {
        const gpRegisters = gpRegisterArray.map((register) => {
            return register.key;
        });

        console.log(gpRegisters);
        const adgpRegisters = adgpRegisterArray.map((register) => {
            return register.key;
        });
        return (
            gpRegisters.includes(str) ||
            adgpRegisters.includes(str) ||
            ["rflags", "rip"].includes(str)
        );
    };

    const is32BitRegister = (str) => {
        const gpRegisters = gpRegisterArray.map((register) => {
            return "e" + register.key.substring(1);
        });
        const adgpRegisters = adgpRegisterArray.map((register) => {
            return register.key + "d";
        });

        return gpRegisters.includes(str) || adgpRegisters.includes(str);
    };

    const is16BitRegister = (str) => {
        const gpRegisters = gpRegisterArray.map((register) => {
            return register.key.substring(1);
        });

        const adgpRegisters = adgpRegisterArray.map((register) => {
            return register.key + "w";
        });

        return gpRegisters.includes(str) || adgpRegisters.includes(str);
    };

    const is8BitRegister = (str) => {
        const gpRegisters = gpRegisterArray.filter((register) => {
            return !["rsi", "rdi", "rbp", "rsp"].includes(register.key);
        });

        const gpRegistersLower = gpRegisters.map((register) => {
            return register.key[1] + "l";
        });
        const gpRegistersHigher = gpRegisters.map((register) => {
            return register.key[1] + "h";
        });

        const adgpRegisters = adgpRegisterArray.map((register) => {
            return register.key + "b";
        });

        return (
            gpRegistersLower.includes(str) ||
            gpRegistersHigher.includes(str) ||
            adgpRegisters.includes(str)
        );
    };

    const handleClickRegister = (register) => {
        setselectedRegister(register);
    };

    const handleMove = (src, dest) => {};
    const handlePush = (oparand) => {
        toast.info(
            " oparand  is a 64 bi register ? " + is8BitRegister(oparand)
        );
    };
    const handlePop = (dest) => {};
    const handleAdd = (src, dest) => {};
    const handleSub = (src, dest) => {};
    const handleCmp = (src, dest) => {};

    const parseSingleLine = (instruction) => {
        const [operation, operands] = instruction
            .match(/(\S+)\s+(.*)/)
            .slice(1);
        const [oparandOne, oparandTwo] = operands.split(/[,\s]+/);

        console.log("operation: " + operation);
        console.log("oparandOne: " + oparandOne);
        console.log("oparandTwo: " + oparandTwo);

        return [operation, oparandOne, oparandTwo];
    };
    const parseAssembly = () => {
        const instructions = inputs.assemblyInput.data;
        const lines = instructions.split("\n");

        const [operation, oparandOne, oparandTwo] = parseSingleLine(lines[0]);

        switch (operation) {
            case "mov":
                const src = oparandTwo;
                const dest = oparandOne;

                break;

            case "push":
                handlePush(oparandOne);

                break;

            default:
                break;
        }
    };

    useEffect(() => {
        showMemory(20000);
    }, []);

    return (
        <div className="w-full h-screen bg-secondery px-4">
            <ToastContainer />
            <div className="grid grid-cols-12 gap-2">
                <div className="h-screen  overflow-y-auto w-full col-span-2">
                    {memory.map((cell) => {
                        return (
                            <MemoryCell
                                cell={cell}
                                handleClick={handleClickRegister}
                            />
                        );
                    })}
                </div>
                <div className="h-screen  overflow-y-auto w-full col-span-7">
                    <TextArea
                        input={inputs.assemblyInput}
                        handleChange={handleChange}
                    />
                    <Button text="Parse" handleClick={parseAssembly} />
                </div>
                <div className="w-full col-span-3">
                    <div className="grid grid-cols-3 gap-2">
                        <div>
                            {gpRegisterArray.map((register) => {
                                return (
                                    <Register
                                        register={register}
                                        handleClick={handleClickRegister}
                                    />
                                );
                            })}
                        </div>
                        <div>
                            {adgpRegisterArray.map((register) => {
                                return (
                                    <Register
                                        register={register}
                                        handleClick={handleClickRegister}
                                    />
                                );
                            })}
                        </div>
                        <div>
                            <Register
                                register={rip}
                                handleClick={handleClickRegister}
                            />
                            <Register register={rflags} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            text={"Stack"}
                            handleClick={() => {
                                const rbp = gpRegisters.rbp.data;
                                const rsp = gpRegisters.rsp.data;
                                const stackLength = rsp - rbp;
                                showMemory(rbp, stackLength);
                            }}
                        />
                        <Button text={"Heap"} />
                        <Button text={".BSS"} />
                        <Button text={".TXT"} />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <Input
                            input={inputs.addrInput}
                            handleChange={handleChange}
                        />
                        <Button
                            text={"Examine"}
                            handleClick={() => {
                                const value = parseInt(inputs.addrInput.data);
                                showMemory(value);
                            }}
                        />
                    </div>
                </div>
            </div>

            {selectedRegister && (
                <RegisterModal
                    handleClose={() => setselectedRegister(null)}
                    register={selectedRegister}
                />
            )}
        </div>
    );
};

export default Canvas;
