import { createContext, useContext, useState, ReactNode } from "react";

interface CacheMemory {
  [key: string]: number | null;
}

const initialRegisters: CacheMemory = {
  rax: null, // Accumulator Register
  rbx: null, // Base Register
  rcx: null, // Counter Register
  rdx: null, // Data Register

  rsi: null, // Source Index Register
  rdi: null, // Destination Index Register

  rbp: 10000, // Base Pointer Register
  rsp: 10100, // Stack Pointer Register

  r8: null, // R8 Register
  r9: null, // R9 Register
  r10: null, // R10 Register
  r11: null, // R11 Register
  r12: null, // R12 Register
  r13: null, // R13 Register
  r14: null, // R14 Register
  r15: null, // R15 Register

  rip: null, //  Instruction Pointer Register

  rflags: null, // R-Flags Register
};

const gpRegisters = ["rax", "rbx", "rcx", "rdx", "rsi", "rdi", "rbp", "rsp"];
const adgpRegisters = ["r8", "r9", "r10", "r11", "r12", "r13", "r14", "r15"];

interface MemoryContextType {
  registers: CacheMemory;
  setRegister: (key: string, value: number | null) => void;
  gpRegisters: string[];
  adgpRegisters: string[];
}

const MemoryContext = createContext<MemoryContextType | undefined>(undefined);

export const MemoryProvider = ({ children }: { children: ReactNode }) => {
  const [registers, setRegisters] = useState<CacheMemory>(initialRegisters);

  const setRegister = (key: string, value: number | null) => {
    // setRegisters((prev) => ({
    //   ...prev,
    //   [key]: { ...prev[key], data: value },
    // }));
  };
  return (
    <MemoryContext.Provider
      value={{ registers, setRegister, gpRegisters, adgpRegisters }}
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
