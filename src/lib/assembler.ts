import { registers } from "./registers";

function rex(w = 1, r = 0, x = 0, b = 0) {
    return 0x40 | (w << 3) | (r << 2) | (x << 1) | b;
}

function encodeModRM(mod: number, reg: number, rm: number) {
    return (mod << 6) | (reg << 3) | rm;
}

function toBytesLE(value: number, byteCount: number) {
    return Array.from(
        { length: byteCount },
        (_, i) => (value >> (8 * i)) & 0xff
    );
}

function encodeMovRegToReg(dst: string | number, src: string | number) {
    const rexPrefix = rex(1, 0, 0, 0);
    const opcode = 0x89;
    const modrm = encodeModRM(0b11, registers[src].code, registers[dst].code);
    return [rexPrefix, opcode, modrm];
}

function encodeMovImmToReg(dst: string | number, imm: string) {
    const rexPrefix = rex(1, 0, 0, 0);
    const opcode = 0xb8 + registers[dst].code; // B8 + reg
    const immBytes = toBytesLE(parseInt(imm), 4);
    return [rexPrefix, opcode, ...immBytes];
}

function encodeAddRegToReg(dst: string | number, src: string | number) {
    const rexPrefix = rex(1, 0, 0, 0);
    const opcode = 0x01;
    const modrm = encodeModRM(0b11, registers[src].code, registers[dst].code);
    return [rexPrefix, opcode, modrm];
}

function encodeSubRegImm(dst: string | number, imm: string) {
    const rexPrefix = rex(1, 0, 0, 0);
    const opcode = 0x81;
    const modrm = encodeModRM(0b11, 0b101, registers[dst].code); // /5 for sub
    const immBytes = toBytesLE(parseInt(imm), 4);
    return [rexPrefix, opcode, modrm, ...immBytes];
}

function encodeXorRegToReg(dst: string | number, src: string | number) {
    const rexPrefix = rex(1, 0, 0, 0);
    const opcode = 0x31;
    const modrm = encodeModRM(0b11, registers[src].code, registers[dst].code);
    return [rexPrefix, opcode, modrm];
}

function encodePushReg(reg: string | number) {
    const rexPrefix = rex(1, 0, 0, 0);
    const opcode = 0x50 + registers[reg].code;
    return [rexPrefix, opcode];
}

function encodePopReg(reg: string | number) {
    const rexPrefix = rex(1, 0, 0, 0);
    const opcode = 0x58 + registers[reg].code;
    return [rexPrefix, opcode];
}

export const assemble = ({ operation, operandOne, operandTwo }: { operation: string; operandOne: string | null; operandTwo: string | null }) => {
    const op1 = operandOne?.trim() ?? "";
    const op2 = operandTwo?.trim() ?? "";
    switch (operation) {
        case "mov":
            return op2.startsWith("0x") || /^\d+$/.test(op2)
                ? encodeMovImmToReg(op1, op2)
                : encodeMovRegToReg(op1, op2);
        case "add":
            return encodeAddRegToReg(op1, op2);
        case "sub":
            return encodeSubRegImm(op1, op2);
        case "xor":
            return encodeXorRegToReg(op1, op2);

        case "push":
            return encodePushReg(op1);
        case "pop":
            return encodePopReg(op1);
        default:
            throw new Error("Unknown instruction: " + operation);
    }
};
