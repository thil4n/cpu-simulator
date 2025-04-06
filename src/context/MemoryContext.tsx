import { createContext, useContext, useState, ReactNode } from "react";

interface CacheMemory {
    [key: string]: number[]; // 64-bit array
}

interface Memory {
    [key: number]: number;
}

type Register =
    | "rax" // Accumulator Register
    | "rbx" // Base Register
    | "rcx" // Counter Register
    | "rdx" // Data Register
    | "rsi" // Source Index Register
    | "rdi" // Destination Index Register
    | "rbp" // Base Pointer Register
    | "rsp" // Stack Pointer Register
    | "r8" // R8 Register
    | "r9" // R9 Register
    | "r10" // R10 Register
    | "r11" // R11 Register
    | "r12" // R12 Register
    | "r13" // R13 Register
    | "r14" // R14 Register
    | "r15" // R15 Register
    | "rip" //  Instruction Pointer Register
    | "rflags"; // R-Flags Register

const gpRegisters: Register[] = [
    "rax",
    "rbx",
    "rcx",
    "rdx",
    "rsi",
    "rdi",
    "rbp",
    "rsp",
];
const adgpRegisters: Register[] = [
    "r8",
    "r9",
    "r10",
    "r11",
    "r12",
    "r13",
    "r14",
    "r15",
];

interface MemoryContextType {
    registers: CacheMemory;
    regset: (key: Register, index: number, bit: number) => void;
    regget: (key: Register) => number;

    memory: Memory;
    memset: (key: number, value: number) => void;

    gpRegisters: Register[];
    adgpRegisters: Register[];
}

const MemoryContext = createContext<MemoryContextType | undefined>(undefined);

export const MemoryProvider = ({ children }: { children: ReactNode }) => {
    const [registers, setRegisters] = useState<CacheMemory>({});
    const [memory, setMemory] = useState<Memory>({});

    const regset = (key: Register, value: number) => {
        const binary = value.toString(2).padStart(64, "0");
        const bitArray = Array.from(binary).map((bit) => parseInt(bit));

        setRegisters((prev) => ({
            ...prev,
            [key]: bitArray,
        }));
    };

    const regget = (key: Register): number => {
        const bits = registers[key] ?? Array(64).fill(0);
        return parseInt(bits.join(""), 2);
    };

    const memset = (key: number, value: number) => {
        setMemory((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    return (
        <MemoryContext.Provider
            value={{
                registers,
                regset,
                regget,
                memory,
                memset,
                gpRegisters,
                adgpRegisters,
            }}
        >
            {children}
        </MemoryContext.Provider>
    );
};

export const useMemoryContext = () => {
    const context = useContext(MemoryContext);
    if (!context) {
        throw new Error(
            "useMemoryContext must be used within a MemoryProvider"
        );
    }
    return context;
};
