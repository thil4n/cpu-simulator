const REG_LOOKUP = ["rax", "rcx", "rdx", "rbx", "rsp", "rbp", "rsi", "rdi"];

function readLE(bytes, offset, length) {
    let val = 0;
    for (let i = 0; i < length; i++) {
        val |= bytes[offset + i] << (i * 8);
    }
    return val;
}

function decodeModRM(byte) {
    const mod = (byte & 0b11000000) >> 6;
    const reg = (byte & 0b00111000) >> 3;
    const rm = byte & 0b00000111;
    return { mod, reg, rm };
}

const disassemble = (bytes) => {
    let i = 0;
    const rex = bytes[i++];
    if ((rex & 0xf0) !== 0x40) throw new Error("Missing REX prefix");

    const opcode = bytes[i++];

    if (opcode === 0x89) {
        const { reg, rm } = decodeModRM(bytes[i++]);
        return `mov ${REG_LOOKUP[rm]}, ${REG_LOOKUP[reg]}`;
    }

    if ((opcode & 0xf8) === 0xb8) {
        // mov reg, imm
        const reg = opcode & 0x07;
        const imm = readLE(bytes, i, 4);
        return `mov ${REG_LOOKUP[reg]}, ${imm}`;
    }

    if (opcode === 0x01) {
        const { reg, rm } = decodeModRM(bytes[i++]);
        return `add ${REG_LOOKUP[rm]}, ${REG_LOOKUP[reg]}`;
    }

    if (opcode === 0x81) {
        const { reg, rm } = decodeModRM(bytes[i++]);
        if (reg === 0b101) {
            const imm = readLE(bytes, i, 4);
            return `sub ${REG_LOOKUP[rm]}, ${imm}`;
        }
    }

    if (opcode === 0x31) {
        const { reg, rm } = decodeModRM(bytes[i++]);
        return `xor ${REG_LOOKUP[rm]}, ${REG_LOOKUP[reg]}`;
    }

    // PUSH
    if ((opcode & 0xf8) === 0x50) {
        const reg = opcode & 0x07;
        return `push ${REG_LOOKUP[reg]}`;
    }

    // POP
    if ((opcode & 0xf8) === 0x58) {
        const reg = opcode & 0x07;
        return `pop ${REG_LOOKUP[reg]}`;
    }

    return "unknown";
};
