const registers = {
    rax: { code: 0x0, size: 64, aliases: ["eax", "ax", "al", "ah"] },
    rcx: { code: 0x1, size: 64, aliases: ["ecx", "cx", "cl", "ch"] },
    // ...
  };
const operations = {
    // Arithmetic operations
    add: { code: 0x01, size: 1 },
    sub: { code: 0x29, size: 1 },
    mul: { code: 0x0F, size: 2 },
    div: { code: 0xF7, size: 2 },
    
    // Data operations
    mov: { code: 0x89, size: 2 },
    push: { code: 0x50, size: 1 },
    pop: { code: 0x58, size: 1 },

    // Logical operations
    xor: { code: 0x31, size: 1 },
    and: { code: 0x21, size: 1 },
    or: { code: 0x09, size: 1 },
    not: { code: 0xF7, size: 2 },

    // Control flow
    inc: { code: 0x40, size: 1 },
    dec: { code: 0x48, size: 1 },

}