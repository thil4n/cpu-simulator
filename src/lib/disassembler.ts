import { isNumericValue } from "@utils";
import { operations } from "./operations";

function findRegisterCode(regName) {
    regName = regName.toLowerCase();
    for (const [name, data] of Object.entries(registers)) {
      if (name === regName || data.aliases.includes(regName)) {
        return { reg: name, code: data.code };
      }
    }
    throw new Error(`Unknown register: ${regName}`);
  }
  

  
  function getOpcode(instruction) {
    const parts = instruction.replace(",", "").trim().split(/\s+/);
    const [mnemonic, op1, op2] = parts;
  
    if (!operations[mnemonic]) {
      throw new Error(`Unsupported instruction: ${mnemonic}`);
    }
  
    // Single operand (e.g., push rax)
    if (!op2) {
      const { code: regCode } = findRegisterCode(op1);
      const opcode = operations[mnemonic].code + regCode;
      return [opcode];
    }
  
    // If the second operand is a register
    if (!isNumericValue(op2)) {
      const reg1 = findRegisterCode(op1);
      const reg2 = findRegisterCode(op2);
  
      const opcode = operations[mnemonic].code;
      const modRM = 0xC0 | (reg2.code << 3) | reg1.code;
      return [opcode, modRM];
    }
  
    // Handle immediate operand (e.g., mov rax, 0x5)
    const reg = findRegisterCode(op1);
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
      const modRM = 0xC0 | (0x0 << 3) | reg.code; // /0 means ADD
      return [opcode, modRM, ...immBytes];
    }
  
    throw new Error(`Immediate handling not implemented for ${mnemonic}`);
  }
  