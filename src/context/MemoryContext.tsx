import { createContext, useContext, useState, ReactNode } from "react";

interface CacheMemory {
  [key: string]: number;
}
interface Memory {
  [key: number]: number;
}

const initialRegisters: CacheMemory = {
  rax: 0, // Accumulator Register
  rbx: 0, // Base Register
  rcx: 0, // Counter Register
  rdx: 0, // Data Register

  rsi: 0, // Source Index Register
  rdi: 0, // Destination Index Register

  rbp: 10000, // Base Pointer Register
  rsp: 10100, // Stack Pointer Register

  r8: 0, // R8 Register
  r9: 0, // R9 Register
  r10: 0, // R10 Register
  r11: 0, // R11 Register
  r12: 0, // R12 Register
  r13: 0, // R13 Register
  r14: 0, // R14 Register
  r15: 0, // R15 Register

  rip: 0, //  Instruction Pointer Register

  rflags: 0, // R-Flags Register
};

const gpRegisters = ["rax", "rbx", "rcx", "rdx", "rsi", "rdi", "rbp", "rsp"];
const adgpRegisters = ["r8", "r9", "r10", "r11", "r12", "r13", "r14", "r15"];

interface MemoryContextType {
  registers: CacheMemory;
  regset: (key: string, value: number) => void;

  memory: Memory;
  memset: (key: number, value: number) => void;

  gpRegisters: string[];
  adgpRegisters: string[];
}

const MemoryContext = createContext<MemoryContextType | undefined>(undefined);

export const MemoryProvider = ({ children }: { children: ReactNode }) => {
  const [registers, setRegisters] = useState<CacheMemory>(initialRegisters);
  const [memory, setMemory] = useState<Memory>(initialRegisters);

  const regset = (key: string, value: number) => {
    setRegisters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const memset = (key: number, value: number) => {
    setMemory((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <MemoryContext.Provider
      value={{ registers, regset, memory, memset, gpRegisters, adgpRegisters }}
    >
      {children}
    </MemoryContext.Provider>
  );
};

export const useMemoryContext = () => {
  const context = useContext(MemoryContext);
  if (!context) {
    throw new Error("useMemoryContext must be used within a MemoryProvider");
  }
  return context;
};
