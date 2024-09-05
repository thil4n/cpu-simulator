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

export { registers, gp_registers, adgp_registers };
