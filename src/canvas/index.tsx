import { useState, useEffect, SetStateAction } from "react";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";

import { Button, Input, Modal } from "@components";

import MemoryCell from "./MemoryCell";
import MemoryView from "./MemoryView";
import { useForm, useModal } from "@hooks";
import AssemblyParser from "./AssemblyParser";

interface ExamineMemory {
  startAddress: null;
  wordCount: null;
}

const Canvas = () => {
  const [selectedRegister, setSelectedRegister] = useState(null);
  const [examineMemory, setExamineMemory] = useState<ExamineMemory>();
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

  const [memory, memset] = useState({});
  const [memoryRange, setMemRange] = useState([]);

  interface Register {
    key: string;
    data: number | null;
    desc: string;
  }

  interface CacheMem {
    [key: string]: Register;
  }

  const registers: CacheMem = {
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

  const gp_registers = ["rax", "rbx", "rcx", "rdx", "rsi", "rdi", "rbp", "rsp"];
  const adgp_registers = ["r8", "r9", "r10", "r11", "r12", "r13", "r14", "r15"];

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

  const push = (operand: any) => {
    if (isRegister(operand)) {
      intcpy(registers.rsp.data, registers[operand].data);
      toast.info("operand  is a register");
    } else if (isMemoryAddress(operand)) {
      toast.info("operand  is a memory address");
    } else if (isNumericValue(operand)) {
      toast.info("operand  is a value");
      intcpy(registers.rsp.data, parseInt(operand));
    } else {
      toast.info("Invalid operand");
    }
  };

  const mov = (src: any, dest: any) => {
    // src | dest : reg
    if (isRegister(src) && isRegister(dest)) {
      registers[dest].data = registers[src].data;
    }

    // src : reg | dest : mem addr
    else if (isRegister(src) && isMemoryAddress(dest)) {
      intcpy(dest, registers[src].data);
    }

    // src : mem |  dest : reg
    else if (isMemoryAddress(src) && isRegister(dest)) {
      intcpy(registers[dest].data, src);
    }

    // src | dest : mem addr
    else if (isMemoryAddress(src) && isMemoryAddress(dest)) {
      intcpy(dest, src);
    }

    // src : num value | dest : reg
    else if (isNumericValue(src) && isRegister(dest)) {
      intcpy(registers[src].data, parseInt(src));
    }

    // src : num value | dest : mem addr
    else if (isNumericValue(src) && isMemoryAddress(dest)) {
      intcpy(dest, parseInt(src));
    }

    // Invalid operation
    else {
      toast.info(" Invalid operands");
    }
  };

  const pop = (dest: any) => {};
  const add = (src: any, dest: any) => {};
  const sub = (src: any, dest: any) => {};
  const cmp = (src: any, dest: any) => {};

  const parseAssembly = () => {
    const instruction = formData.assemblyInput;

    const [operation, operandOne, operandTwo] = parseSingleLine(instruction);

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
        break;
    }
  };

  useEffect(() => {
    showMemory(20000);
  }, []);

  const execute = () => {
    parseAssembly();
  };

  return (
    <div className="w-full h-screen bg-[#2d3436] px-4">
      <ToastContainer />
      {modalStatus.instructionModal && (
        <Modal
          title="Instructions"
          handleClose={() => {
            closeModal("instructionModal");
          }}
        >
          <AssemblyParser
            selectedDataItem={undefined}
            setInstructions={(cpuInstructions) => {
              setInstructions(cpuInstructions);
              closeModal("instructionModal");
            }}
          />
        </Modal>
      )}

      {modalStatus.memoryModal && (
        <Modal
          handleClose={() => {
            closeModal("memoryModal");
          }}
          title={"Examine Memory"}
          className="w-[90%] text-secondary"
        >
          <MemoryView
            startAddr={examineMemory?.startAddress}
            wordCount={examineMemory?.wordCount}
            handleClose={() => setExamineMemory(null)}
            memoryValues={memory}
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
                  openModal("memoryModal");
                }}
                value={memory[cell.address]}
              />
            );
          })}
        </div>
        <div className="w-full col-span-5 mt-5">
          <h1 className="bg-primary text-secondary w-full py-2 text-center uppercase">
            ASSEMBLY INSTRUCTIONS
          </h1>
          <div className="bg-[#555] bg-opacity-50 backdrop-blur-lg px-6 py-4">
            {instructions.map((line: any) => {
              return (
                <div className="flex py-1 px-2 border-b border-secondary hover:bg-primary text-slate-400 hover:text-secondary  cursor-pointer">
                  <div className="w-32">{line.operation}</div>
                  <div className="w-[300px]">{line.operandOne}</div>
                  <div className="">{line.operandTwo}</div>
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
              <Button
                text="LOAD PROGRAM"
                handleClick={() => {
                  openModal("instructionModal");
                }}
              />
              <Button text="BREAKPOINTS" handleClick={() => {}} />
              <div className="grid grid-cols-2 gap-2">
                <Button text="BACK" handleClick={parseAssembly} />
                <Button text="NEXT" handleClick={parseAssembly} />
              </div>
              <Input
                name="assemblyInput"
                inputClassName="placeholder-gray-500"
                placeholder="Assembly instruction"
                value={formData.assemblyInput}
                handleChange={handleChange}
              />
              <Button
                className="-mt-1"
                text="EXECUTE"
                handleClick={parseAssembly}
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
                <Button text={"RIP"} handleClick={handleClickRegister} />
                <Button text={"RFLGAS"} handleClick={handleClickRegister} />
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
                    const value = parseInt(inputs.addrInput.data);
                    showMemory(value);
                  }}
                />
                <Button
                  text={"Clear"}
                  handleClick={() => {
                    const value = parseInt(inputs.addrInput.data);
                    showMemory(value);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* {loadingState && (
                <Loader handleClose={() => setLoadingState(false)} />
            )} */}
    </div>
  );
};

export default Canvas;
