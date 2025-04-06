import { STACK_END, STACK_START } from "@config";
import { numberToBitArray } from "@utils";
import { createContext, useContext, useState, ReactNode } from "react";

interface CacheMemory {
    [key: string]: number[]; // 64-bit array
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

interface RegisterContextType {
    registers: CacheMemory;
    regset: (key: Register, bitArray: number[]) => void;
}

const RegisterContext = createContext<RegisterContextType | undefined>(
    undefined
);

const initialRegisters: CacheMemory = {
    rbp: numberToBitArray(STACK_START),
    rsp: numberToBitArray(STACK_END),
};

export const RegisterProvider = ({ children }: { children: ReactNode }) => {
    const [registers, setRegisters] = useState<CacheMemory>(initialRegisters);

    const regset = (key: Register, bitArray: number[]) => {
        setRegisters((prev) => ({
            ...prev,
            [key]: bitArray,
        }));
    };

    return (
        <RegisterContext.Provider
            value={{
                registers,
                regset,
            }}
        >
            {children}
        </RegisterContext.Provider>
    );
};

export const useRegisterContext = () => {
    const context = useContext(RegisterContext);
    if (!context) {
        throw new Error(
            "useRegisterContext must be used within a RegisterProvider"
        );
    }
    return context;
};
