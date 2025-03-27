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

interface RegisterContextType {
  registers: CacheMemory;
  setRegister: (key: string, value: number | null) => void;
  gpRegisters: string[];
  adgpRegisters: string[];
}

const RegisterContext = createContext<RegisterContextType | undefined>(
  undefined
);

export const RegisterProvider = ({ children }: { children: ReactNode }) => {
  const [registers, setRegisters] = useState<CacheMemory>(initialRegisters);

  const setRegister = (key: string, value: number | null) => {
    setRegisters((prev) => ({
      ...prev,
      [key]: { ...prev[key], data: value },
    }));
  };
  return (
    <RegisterContext.Provider
      value={{ registers, setRegister, gpRegisters, adgpRegisters }}
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
