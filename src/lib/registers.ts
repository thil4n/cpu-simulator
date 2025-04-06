import { CacheMem } from "@interfaces";

const registers: CacheMem = {
    rax: { key: "rax", desc: "Accumulator Register" },
    rbx: { key: "rbx", desc: "Base Register" },
    rcx: { key: "rcx", desc: "Counter Register" },
    rdx: { key: "rdx", desc: "Data Register" },

    rsi: { key: "rsi", desc: "Source Index Register" },
    rdi: { key: "rdi", desc: "Destination Index Register" },

    rbp: { key: "rbp", desc: "Base Pointer Register" },
    rsp: { key: "rsp", desc: "Stack Pointer Register" },

    r8: { key: "r8", desc: "R8 Register" },
    r9: { key: "r9", desc: "R9 Register" },
    r10: { key: "r10", desc: "R10 Register" },
    r11: { key: "r11", desc: "R11 Register" },
    r12: { key: "r12", desc: "R12 Register" },
    r13: { key: "r13", desc: "R13 Register" },
    r14: { key: "r14", desc: "R14 Register" },
    r15: { key: "r15", desc: "R15 Register" },

    rip: { key: "rip", desc: "Instruction Pointer Register" },

    rflags: { key: "rflags", desc: "R Flags Register" },
};

const gp_registers = ["rax", "rbx", "rcx", "rdx", "rsi", "rdi", "rbp", "rsp"];
const adgp_registers = ["r8", "r9", "r10", "r11", "r12", "r13", "r14", "r15"];

export { registers, gp_registers, adgp_registers };
