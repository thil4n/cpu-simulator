import { CacheMem } from "@interfaces";

const registers: CacheMem = {
    rax: { key: "rax", code: 0x0 , desc: "Accumulator Register" },
    rbx: { key: "rbx", code: 0x1 , desc: "Base Register" },
    rcx: { key: "rcx", code: 0x2 , desc: "Counter Register" },
    rdx: { key: "rdx", code: 0x3 , desc: "Data Register" },

    rsi: { key: "rsi", code: 0x4 , desc: "Source Index Register" },
    rdi: { key: "rdi", code: 0x5 , desc: "Destination Index Register" },

    rbp: { key: "rbp", code: 0x6 , desc: "Base Pointer Register" },
    rsp: { key: "rsp", code: 0x7 , desc: "Stack Pointer Register" },

    r8: { key: "r8",  code: 0x8 ,desc: "R8 Register" },
    r9: { key: "r9",  code: 0x9 ,desc: "R9 Register" },
    r10: { key: "r10", code: 0x10 , desc: "R10 Register" },
    r11: { key: "r11", code: 0x11 , desc: "R11 Register" },
    r12: { key: "r12", code: 0x12 , desc: "R12 Register" },
    r13: { key: "r13", code: 0x13 , desc: "R13 Register" },
    r14: { key: "r14", code: 0x14 , desc: "R14 Register" },
    r15: { key: "r15", code: 0x15 , desc: "R15 Register" },

    rip: { key: "rip", code: 0x16 , desc: "Instruction Pointer Register" },

    rflags: { key: "rflags",code: 0x17, desc: "R Flags Register" },
};

const gp_registers = ["rax", "rbx", "rcx", "rdx", "rsi", "rdi", "rbp", "rsp"];
const adgp_registers = ["r8", "r9", "r10", "r11", "r12", "r13", "r14", "r15"];

export { registers, gp_registers, adgp_registers };
