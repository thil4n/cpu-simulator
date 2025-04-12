const REG_LOOKUP = ["rax", "rcx", "rdx", "rbx", "rsp", "rbp", "rsi", "rdi"];

function readLE(bytes: number[], offset: number, length: number) {
    let val = 0;
    for (let i = 0; i < length; i++) {
        val |= bytes[offset + i] << (i * 8);
    }
    return val;
}

function decodeModRM(byte: number) {
    const mod = (byte & 0b11000000) >> 6;
    const reg = (byte & 0b00111000) >> 3;
    const rm = byte & 0b00000111;
    return { mod, reg, rm };
}

export const disassemble = (bytes: number[]) => {
    let i = 0;
    const rex = bytes[i++];
    if ((rex & 0xf0) !== 0x40) throw new Error("Missing REX prefix");

    const opcode = bytes[i++];

    // mov reg, reg (0x89)
    if (opcode === 0x89) {
        const { reg, rm } = decodeModRM(bytes[i++]);
        return {
            instruction: `mov ${REG_LOOKUP[rm]}, ${REG_LOOKUP[reg]}`,
            length: 3,
        };
    }

    // mov reg, imm (0xb8 - 0xbf)
    if ((opcode & 0xf8) === 0xb8) {
        const reg = opcode & 0x07;
        const imm = readLE(bytes, i, 4);
        return {
            instruction: `mov ${REG_LOOKUP[reg]}, ${imm}`,
            length: 6,
        };
    }

    // add reg, reg (0x01)
    if (opcode === 0x01) {
        const { reg, rm } = decodeModRM(bytes[i++]);
        return {
            instruction: `add ${REG_LOOKUP[rm]}, ${REG_LOOKUP[reg]}`,
            length: 3,
        };
    }

    // sub reg, imm (0x81 /5)
    if (opcode === 0x81) {
        const { reg, rm } = decodeModRM(bytes[i++]);
        if (reg === 0b101) {
            const imm = readLE(bytes, i, 4);
            return {
                instruction: `sub ${REG_LOOKUP[rm]}, ${imm}`,
                length: 6,
            };
        }
    }

    // xor reg, reg (0x31)
    if (opcode === 0x31) {
        const { reg, rm } = decodeModRM(bytes[i++]);
        return {
            instruction: `xor ${REG_LOOKUP[rm]}, ${REG_LOOKUP[reg]}`,
            length: 3,
        };
    }

    // push reg (0x50 - 0x57)
    if ((opcode & 0xf8) === 0x50) {
        const reg = opcode & 0x07;
        return {
            instruction: `push ${REG_LOOKUP[reg]}`,
            length: 2,
        };
    }

    // pop reg (0x58 - 0x5f)
    if ((opcode & 0xf8) === 0x58) {
        const reg = opcode & 0x07;
        return {
            instruction: `pop ${REG_LOOKUP[reg]}`,
            length: 2,
        };
    }

    return {
        instruction: "unknown",
        length: 1,
    };
};
