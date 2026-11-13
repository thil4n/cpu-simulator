const REG_LOOKUP = ["rax", "rcx", "rdx", "rbx", "rsp", "rbp", "rsi", "rdi"];

function readLE(bytes: number[], offset: number, length: number) {
    let val = 0;
    for (let i = 0; i < length; i++) {
        val |= bytes[offset + i] << (i * 8);
    }
    return val;
}

function readSignedLE(bytes: number[], offset: number, length: number) {
    const unsigned = readLE(bytes, offset, length);
    const signBit = 1 << (length * 8 - 1);
    if (unsigned & signBit) {
        return unsigned - (signBit << 1);
    }
    return unsigned;
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

    // --- Two-byte opcode prefix 0x0F ---
    if (opcode === 0x0f) {
        const opcode2 = bytes[i++];

        // imul reg, reg (0x0F 0xAF)
        if (opcode2 === 0xaf) {
            const { reg, rm } = decodeModRM(bytes[i++]);
            return {
                instruction: `imul ${REG_LOOKUP[reg]}, ${REG_LOOKUP[rm]}`,
                length: 4,
            };
        }

        // je rel32 (0x0F 0x84)
        if (opcode2 === 0x84) {
            const offset = readSignedLE(bytes, i, 4);
            return {
                instruction: `je ${offset}`,
                length: 7,
            };
        }

        // jne rel32 (0x0F 0x85)
        if (opcode2 === 0x85) {
            const offset = readSignedLE(bytes, i, 4);
            return {
                instruction: `jne ${offset}`,
                length: 7,
            };
        }

        // jg rel32 (0x0F 0x8F)
        if (opcode2 === 0x8f) {
            const offset = readSignedLE(bytes, i, 4);
            return {
                instruction: `jg ${offset}`,
                length: 7,
            };
        }

        // jl rel32 (0x0F 0x8C)
        if (opcode2 === 0x8c) {
            const offset = readSignedLE(bytes, i, 4);
            return {
                instruction: `jl ${offset}`,
                length: 7,
            };
        }

        return { instruction: "unknown", length: 3 };
    }

    // --- add reg, reg (0x01) ---
    if (opcode === 0x01) {
        const { reg, rm } = decodeModRM(bytes[i++]);
        return {
            instruction: `add ${REG_LOOKUP[rm]}, ${REG_LOOKUP[reg]}`,
            length: 3,
        };
    }

    // --- or reg, reg (0x09) ---
    if (opcode === 0x09) {
        const { reg, rm } = decodeModRM(bytes[i++]);
        return {
            instruction: `or ${REG_LOOKUP[rm]}, ${REG_LOOKUP[reg]}`,
            length: 3,
        };
    }

    // --- and reg, reg (0x21) ---
    if (opcode === 0x21) {
        const { reg, rm } = decodeModRM(bytes[i++]);
        return {
            instruction: `and ${REG_LOOKUP[rm]}, ${REG_LOOKUP[reg]}`,
            length: 3,
        };
    }

    // --- sub reg, reg (0x29) ---
    if (opcode === 0x29) {
        const { reg, rm } = decodeModRM(bytes[i++]);
        return {
            instruction: `sub ${REG_LOOKUP[rm]}, ${REG_LOOKUP[reg]}`,
            length: 3,
        };
    }

    // --- xor reg, reg (0x31) ---
    if (opcode === 0x31) {
        const { reg, rm } = decodeModRM(bytes[i++]);
        return {
            instruction: `xor ${REG_LOOKUP[rm]}, ${REG_LOOKUP[reg]}`,
            length: 3,
        };
    }

    // --- cmp reg, reg (0x39) ---
    if (opcode === 0x39) {
        const { reg, rm } = decodeModRM(bytes[i++]);
        return {
            instruction: `cmp ${REG_LOOKUP[rm]}, ${REG_LOOKUP[reg]}`,
            length: 3,
        };
    }

    // --- push reg (0x50 - 0x57) ---
    if ((opcode & 0xf8) === 0x50) {
        const reg = opcode & 0x07;
        return {
            instruction: `push ${REG_LOOKUP[reg]}`,
            length: 2,
        };
    }

    // --- pop reg (0x58 - 0x5f) ---
    if ((opcode & 0xf8) === 0x58) {
        const reg = opcode & 0x07;
        return {
            instruction: `pop ${REG_LOOKUP[reg]}`,
            length: 2,
        };
    }

    // --- 0x81: immediate group (add/or/and/sub/cmp with reg, imm32) ---
    if (opcode === 0x81) {
        const { reg, rm } = decodeModRM(bytes[i++]);
        const imm = readLE(bytes, i, 4);
        const regName = REG_LOOKUP[rm];
        switch (reg) {
            case 0b000:
                return { instruction: `add ${regName}, ${imm}`, length: 7 };
            case 0b001:
                return { instruction: `or ${regName}, ${imm}`, length: 7 };
            case 0b100:
                return { instruction: `and ${regName}, ${imm}`, length: 7 };
            case 0b101:
                return { instruction: `sub ${regName}, ${imm}`, length: 7 };
            case 0b111:
                return { instruction: `cmp ${regName}, ${imm}`, length: 7 };
            default:
                return { instruction: "unknown", length: 7 };
        }
    }

    // --- test reg, reg (0x85) ---
    if (opcode === 0x85) {
        const { reg, rm } = decodeModRM(bytes[i++]);
        return {
            instruction: `test ${REG_LOOKUP[rm]}, ${REG_LOOKUP[reg]}`,
            length: 3,
        };
    }

    // --- xchg reg, reg (0x87) ---
    if (opcode === 0x87) {
        const { reg, rm } = decodeModRM(bytes[i++]);
        return {
            instruction: `xchg ${REG_LOOKUP[rm]}, ${REG_LOOKUP[reg]}`,
            length: 3,
        };
    }

    // --- mov reg, reg (0x89) ---
    if (opcode === 0x89) {
        const { reg, rm } = decodeModRM(bytes[i++]);
        return {
            instruction: `mov ${REG_LOOKUP[rm]}, ${REG_LOOKUP[reg]}`,
            length: 3,
        };
    }

    // --- lea reg, [disp32] (0x8D) ---
    if (opcode === 0x8d) {
        const { reg } = decodeModRM(bytes[i++]);
        const imm = readLE(bytes, i, 4);
        return {
            instruction: `lea ${REG_LOOKUP[reg]}, ${imm}`,
            length: 7,
        };
    }

    // --- nop (0x90) ---
    if (opcode === 0x90) {
        return {
            instruction: "nop",
            length: 2,
        };
    }

    // --- mov reg, imm (0xB8 - 0xBF) ---
    if ((opcode & 0xf8) === 0xb8) {
        const reg = opcode & 0x07;
        const imm = readLE(bytes, i, 4);
        return {
            instruction: `mov ${REG_LOOKUP[reg]}, ${imm}`,
            length: 6,
        };
    }

    // --- shl/shr reg, imm8 (0xC1) ---
    if (opcode === 0xc1) {
        const { reg, rm } = decodeModRM(bytes[i++]);
        const imm = bytes[i] & 0xff;
        const op = reg === 0b100 ? "shl" : reg === 0b101 ? "shr" : "unknown_shift";
        return {
            instruction: `${op} ${REG_LOOKUP[rm]}, ${imm}`,
            length: 4,
        };
    }

    // --- jmp rel32 (0xE9) ---
    if (opcode === 0xe9) {
        const offset = readSignedLE(bytes, i, 4);
        return {
            instruction: `jmp ${offset}`,
            length: 6,
        };
    }

    // --- 0xF7: unary group (not/neg/mul/div) ---
    if (opcode === 0xf7) {
        const { reg, rm } = decodeModRM(bytes[i++]);
        const regName = REG_LOOKUP[rm];
        switch (reg) {
            case 0b010:
                return { instruction: `not ${regName}`, length: 3 };
            case 0b011:
                return { instruction: `neg ${regName}`, length: 3 };
            case 0b100:
                return { instruction: `mul ${regName}`, length: 3 };
            case 0b110:
                return { instruction: `div ${regName}`, length: 3 };
            default:
                return { instruction: "unknown", length: 3 };
        }
    }

    // --- 0xFF: inc/dec ---
    if (opcode === 0xff) {
        const { reg, rm } = decodeModRM(bytes[i++]);
        const regName = REG_LOOKUP[rm];
        switch (reg) {
            case 0b000:
                return { instruction: `inc ${regName}`, length: 3 };
            case 0b001:
                return { instruction: `dec ${regName}`, length: 3 };
            default:
                return { instruction: "unknown", length: 3 };
        }
    }

    return {
        instruction: "unknown",
        length: 1,
    };
};
