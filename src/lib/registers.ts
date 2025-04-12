import { CacheMem } from "@interfaces";

const registers: CacheMem = {
    rax: { key: "rax", code: 0b000, desc: "Accumulator Register" },
    rbx: { key: "rbx", code: 0b011, desc: "Base Register" },
    rcx: { key: "rcx", code: 0b001, desc: "Counter Register" },
    rdx: { key: "rdx", code: 0b010, desc: "Data Register" },

    rsi: { key: "rsi", code: 0b110, desc: "Source Index Register" },
    rdi: { key: "rdi", code: 0b111, desc: "Destination Index Register" },

    rbp: { key: "rbp", code: 0b101, desc: "Base Pointer Register" },
    rsp: { key: "rsp", code: 0b100, desc: "Stack Pointer Register" },

    r8: { key: "r8", code: 0x8, desc: "R8 Register" },
    r9: { key: "r9", code: 0x9, desc: "R9 Register" },
    r10: { key: "r10", code: 0xa, desc: "R10 Register" },
    r11: { key: "r11", code: 0xb, desc: "R11 Register" },
    r12: { key: "r12", code: 0xc, desc: "R12 Register" },
    r13: { key: "r13", code: 0xd, desc: "R13 Register" },
    r14: { key: "r14", code: 0xe, desc: "R14 Register" },
    r15: { key: "r15", code: 0xf, desc: "R15 Register" },

    rip: { key: "rip", code: 0x16, desc: "Instruction Pointer Register" },

    rflags: { key: "rflags", code: 0x17, desc: "R Flags Register" },
};

const gp_registers = ["rax", "rbx", "rcx", "rdx", "rsi", "rdi", "rbp", "rsp"];
const adgp_registers = ["r8", "r9", "r10", "r11", "r12", "r13", "r14", "r15"];

export { registers, gp_registers, adgp_registers };
