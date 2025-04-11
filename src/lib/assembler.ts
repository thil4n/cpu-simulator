import { isNumericValue, isRegister, parseImmediate } from "@utils";
import { operations } from "./operations";
import { registers } from "./registers";

export const assemble = (parts: string[]) => {
  const [mnemonic, op1, op2] = parts;

  if (!operations[mnemonic]) {
    throw new Error(`Unsupported instruction: ${mnemonic}`);
  }
  if (!op1) {
    throw new Error(`Missing operand for instruction: ${mnemonic}`);
  }

  // Single operand (e.g., push rax)
  if (!op2) {
    const regCode = registers[op2].code;

    if (regCode === undefined) {
      throw new Error(`Invalid register: ${op1}`);
    }
    const opcode = operations[mnemonic].code + regCode;
    return [opcode];
  }

  // If the second operand is a register
  if (isRegister(op2)) {
    const reg1 = registers[op1];
    const reg2 = registers[op2];

    const opcode = operations[mnemonic].code;
    const modRM = 0xc0 | (reg2.code << 3) | reg1.code;
    return [opcode, modRM];
  }

  // If the second operand is a number
  if (isNumericValue(op2)) {
    // Handle immediate operand (e.g., mov rax, 0x5)
    const reg = registers[op1];
    const immValue = parseImmediate(op2);
    let immBytes = [];

    for (let i = 0; i < 4; i++) {
      immBytes.push((immValue >> (i * 8)) & 0xff);
    }

    if (mnemonic === "mov") {
        const baseOpcode = operations.mov_imm.code + reg.code;
        return [baseOpcode, ...immBytes];
      }
    
      if (mnemonic === "add") {
        const opcode = operations.add_imm.code;
        const modRM = 0xc0 | (0x0 << 3) | reg.code; // /0 means ADD
        return [opcode, modRM, ...immBytes];
      }
  }



  throw new Error(`Immediate handling not implemented for ${mnemonic}`);
};
