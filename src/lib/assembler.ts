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

// --- MOV ---
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

// --- ADD ---
function encodeAddRegToReg(dst: string | number, src: string | number) {
    const rexPrefix = rex(1, 0, 0, 0);
    const opcode = 0x01;
    const modrm = encodeModRM(0b11, registers[src].code, registers[dst].code);
    return [rexPrefix, opcode, modrm];
}

function encodeAddRegImm(dst: string | number, imm: string) {
    const rexPrefix = rex(1, 0, 0, 0);
    const opcode = 0x81;
    const modrm = encodeModRM(0b11, 0b000, registers[dst].code); // /0 for add
    const immBytes = toBytesLE(parseInt(imm), 4);
    return [rexPrefix, opcode, modrm, ...immBytes];
}

// --- SUB ---
function encodeSubRegImm(dst: string | number, imm: string) {
    const rexPrefix = rex(1, 0, 0, 0);
    const opcode = 0x81;
    const modrm = encodeModRM(0b11, 0b101, registers[dst].code); // /5 for sub
    const immBytes = toBytesLE(parseInt(imm), 4);
    return [rexPrefix, opcode, modrm, ...immBytes];
}

function encodeSubRegToReg(dst: string | number, src: string | number) {
    const rexPrefix = rex(1, 0, 0, 0);
    const opcode = 0x29;
    const modrm = encodeModRM(0b11, registers[src].code, registers[dst].code);
    return [rexPrefix, opcode, modrm];
}

// --- XOR ---
function encodeXorRegToReg(dst: string | number, src: string | number) {
    const rexPrefix = rex(1, 0, 0, 0);
    const opcode = 0x31;
    const modrm = encodeModRM(0b11, registers[src].code, registers[dst].code);
    return [rexPrefix, opcode, modrm];
}

// --- AND ---
function encodeAndRegToReg(dst: string | number, src: string | number) {
    const rexPrefix = rex(1, 0, 0, 0);
    const opcode = 0x21;
    const modrm = encodeModRM(0b11, registers[src].code, registers[dst].code);
    return [rexPrefix, opcode, modrm];
}

function encodeAndRegImm(dst: string | number, imm: string) {
    const rexPrefix = rex(1, 0, 0, 0);
    const opcode = 0x81;
    const modrm = encodeModRM(0b11, 0b100, registers[dst].code); // /4 for and
    const immBytes = toBytesLE(parseInt(imm), 4);
    return [rexPrefix, opcode, modrm, ...immBytes];
}

// --- OR ---
function encodeOrRegToReg(dst: string | number, src: string | number) {
    const rexPrefix = rex(1, 0, 0, 0);
    const opcode = 0x09;
    const modrm = encodeModRM(0b11, registers[src].code, registers[dst].code);
    return [rexPrefix, opcode, modrm];
}

function encodeOrRegImm(dst: string | number, imm: string) {
    const rexPrefix = rex(1, 0, 0, 0);
    const opcode = 0x81;
    const modrm = encodeModRM(0b11, 0b001, registers[dst].code); // /1 for or
    const immBytes = toBytesLE(parseInt(imm), 4);
    return [rexPrefix, opcode, modrm, ...immBytes];
}

// --- NOT ---
function encodeNotReg(reg: string | number) {
    const rexPrefix = rex(1, 0, 0, 0);
    const opcode = 0xf7;
    const modrm = encodeModRM(0b11, 0b010, registers[reg].code); // /2 for not
    return [rexPrefix, opcode, modrm];
}

// --- NEG ---
function encodeNegReg(reg: string | number) {
    const rexPrefix = rex(1, 0, 0, 0);
    const opcode = 0xf7;
    const modrm = encodeModRM(0b11, 0b011, registers[reg].code); // /3 for neg
    return [rexPrefix, opcode, modrm];
}

// --- INC ---
function encodeIncReg(reg: string | number) {
    const rexPrefix = rex(1, 0, 0, 0);
    const opcode = 0xff;
    const modrm = encodeModRM(0b11, 0b000, registers[reg].code); // /0 for inc
    return [rexPrefix, opcode, modrm];
}

// --- DEC ---
function encodeDecReg(reg: string | number) {
    const rexPrefix = rex(1, 0, 0, 0);
    const opcode = 0xff;
    const modrm = encodeModRM(0b11, 0b001, registers[reg].code); // /1 for dec
    return [rexPrefix, opcode, modrm];
}

// --- MUL (unsigned, result in rdx:rax) ---
function encodeMulReg(reg: string | number) {
    const rexPrefix = rex(1, 0, 0, 0);
    const opcode = 0xf7;
    const modrm = encodeModRM(0b11, 0b100, registers[reg].code); // /4 for mul
    return [rexPrefix, opcode, modrm];
}

// --- IMUL reg, reg ---
function encodeImulRegToReg(dst: string | number, src: string | number) {
    const rexPrefix = rex(1, 0, 0, 0);
    const opcode1 = 0x0f;
    const opcode2 = 0xaf;
    const modrm = encodeModRM(0b11, registers[dst].code, registers[src].code);
    return [rexPrefix, opcode1, opcode2, modrm];
}

// --- DIV (unsigned, rax / reg) ---
function encodeDivReg(reg: string | number) {
    const rexPrefix = rex(1, 0, 0, 0);
    const opcode = 0xf7;
    const modrm = encodeModRM(0b11, 0b110, registers[reg].code); // /6 for div
    return [rexPrefix, opcode, modrm];
}

// --- SHL reg, imm8 ---
function encodeShlRegImm(reg: string | number, imm: string) {
    const rexPrefix = rex(1, 0, 0, 0);
    const opcode = 0xc1;
    const modrm = encodeModRM(0b11, 0b100, registers[reg].code); // /4 for shl
    return [rexPrefix, opcode, modrm, parseInt(imm) & 0xff];
}

// --- SHR reg, imm8 ---
function encodeShrRegImm(reg: string | number, imm: string) {
    const rexPrefix = rex(1, 0, 0, 0);
    const opcode = 0xc1;
    const modrm = encodeModRM(0b11, 0b101, registers[reg].code); // /5 for shr
    return [rexPrefix, opcode, modrm, parseInt(imm) & 0xff];
}

// --- CMP ---
function encodeCmpRegToReg(dst: string | number, src: string | number) {
    const rexPrefix = rex(1, 0, 0, 0);
    const opcode = 0x39;
    const modrm = encodeModRM(0b11, registers[src].code, registers[dst].code);
    return [rexPrefix, opcode, modrm];
}

function encodeCmpRegImm(dst: string | number, imm: string) {
    const rexPrefix = rex(1, 0, 0, 0);
    const opcode = 0x81;
    const modrm = encodeModRM(0b11, 0b111, registers[dst].code); // /7 for cmp
    const immBytes = toBytesLE(parseInt(imm), 4);
    return [rexPrefix, opcode, modrm, ...immBytes];
}

// --- TEST reg, reg ---
function encodeTestRegToReg(dst: string | number, src: string | number) {
    const rexPrefix = rex(1, 0, 0, 0);
    const opcode = 0x85;
    const modrm = encodeModRM(0b11, registers[src].code, registers[dst].code);
    return [rexPrefix, opcode, modrm];
}

// --- XCHG reg, reg ---
function encodeXchgRegToReg(dst: string | number, src: string | number) {
    const rexPrefix = rex(1, 0, 0, 0);
    const opcode = 0x87;
    const modrm = encodeModRM(0b11, registers[src].code, registers[dst].code);
    return [rexPrefix, opcode, modrm];
}

// --- LEA reg, [reg+imm] (simplified: lea reg, [imm]) ---
function encodeLeaRegImm(dst: string | number, imm: string) {
    const rexPrefix = rex(1, 0, 0, 0);
    const opcode = 0x8d;
    // Use disp32 addressing with RBP base (mod=00, rm=101 → disp32 only)
    const modrm = encodeModRM(0b00, registers[dst].code, 0b101);
    const immBytes = toBytesLE(parseInt(imm), 4);
    return [rexPrefix, opcode, modrm, ...immBytes];
}

// --- PUSH/POP ---
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

// --- NOP ---
function encodeNop() {
    const rexPrefix = rex(1, 0, 0, 0);
    return [rexPrefix, 0x90];
}

// --- JMP rel32 ---
function encodeJmpRel(offset: string) {
    const rexPrefix = rex(1, 0, 0, 0);
    const opcode = 0xe9;
    const immBytes = toBytesLE(parseInt(offset), 4);
    return [rexPrefix, opcode, ...immBytes];
}

// --- JE/JZ rel32 (0x0F 0x84) ---
function encodeJeRel(offset: string) {
    const rexPrefix = rex(1, 0, 0, 0);
    const immBytes = toBytesLE(parseInt(offset), 4);
    return [rexPrefix, 0x0f, 0x84, ...immBytes];
}

// --- JNE/JNZ rel32 (0x0F 0x85) ---
function encodeJneRel(offset: string) {
    const rexPrefix = rex(1, 0, 0, 0);
    const immBytes = toBytesLE(parseInt(offset), 4);
    return [rexPrefix, 0x0f, 0x85, ...immBytes];
}

// --- JG rel32 (0x0F 0x8F) ---
function encodeJgRel(offset: string) {
    const rexPrefix = rex(1, 0, 0, 0);
    const immBytes = toBytesLE(parseInt(offset), 4);
    return [rexPrefix, 0x0f, 0x8f, ...immBytes];
}

// --- JL rel32 (0x0F 0x8C) ---
function encodeJlRel(offset: string) {
    const rexPrefix = rex(1, 0, 0, 0);
    const immBytes = toBytesLE(parseInt(offset), 4);
    return [rexPrefix, 0x0f, 0x8c, ...immBytes];
}

function isImmediate(value: string): boolean {
    return value.startsWith("0x") || /^-?\d+$/.test(value);
}

export const assemble = ({ operation, operandOne, operandTwo }: { operation: string; operandOne: string | null; operandTwo: string | null }) => {
    const op1 = operandOne?.trim() ?? "";
    const op2 = operandTwo?.trim() ?? "";
    switch (operation) {
        // --- Data movement ---
        case "mov":
            return isImmediate(op2)
                ? encodeMovImmToReg(op1, op2)
                : encodeMovRegToReg(op1, op2);
        case "lea":
            return encodeLeaRegImm(op1, op2);
        case "xchg":
            return encodeXchgRegToReg(op1, op2);

        // --- Arithmetic ---
        case "add":
            return isImmediate(op2)
                ? encodeAddRegImm(op1, op2)
                : encodeAddRegToReg(op1, op2);
        case "sub":
            return isImmediate(op2)
                ? encodeSubRegImm(op1, op2)
                : encodeSubRegToReg(op1, op2);
        case "inc":
            return encodeIncReg(op1);
        case "dec":
            return encodeDecReg(op1);
        case "neg":
            return encodeNegReg(op1);
        case "mul":
            return encodeMulReg(op1);
        case "imul":
            return encodeImulRegToReg(op1, op2);
        case "div":
            return encodeDivReg(op1);

        // --- Logical ---
        case "and":
            return isImmediate(op2)
                ? encodeAndRegImm(op1, op2)
                : encodeAndRegToReg(op1, op2);
        case "or":
            return isImmediate(op2)
                ? encodeOrRegImm(op1, op2)
                : encodeOrRegToReg(op1, op2);
        case "xor":
            return encodeXorRegToReg(op1, op2);
        case "not":
            return encodeNotReg(op1);
        case "shl":
            return encodeShlRegImm(op1, op2);
        case "shr":
            return encodeShrRegImm(op1, op2);

        // --- Compare / Test ---
        case "cmp":
            return isImmediate(op2)
                ? encodeCmpRegImm(op1, op2)
                : encodeCmpRegToReg(op1, op2);
        case "test":
            return encodeTestRegToReg(op1, op2);

        // --- Stack ---
        case "push":
            return encodePushReg(op1);
        case "pop":
            return encodePopReg(op1);

        // --- Control flow ---
        case "nop":
            return encodeNop();
        case "jmp":
            return encodeJmpRel(op1);
        case "je":
        case "jz":
            return encodeJeRel(op1);
        case "jne":
        case "jnz":
            return encodeJneRel(op1);
        case "jg":
            return encodeJgRel(op1);
        case "jl":
            return encodeJlRel(op1);

        default:
            throw new Error("Unknown instruction: " + operation);
    }
};
