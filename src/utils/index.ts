export const is64BitRegister = (str: string) => {
  const gpRegisters = ["rax", "rbx", "rcx", "rdx", "rsi", "rdi", "rbp", "rsp"];

  const adgpRegisters = ["r8", "r9", "r10", "r11", "r12", "r13", "r14", "r15"];

  const sppRegisters = ["rip", "rflags"];

  return (
    gpRegisters.includes(str) ||
    adgpRegisters.includes(str) ||
    sppRegisters.includes(str)
  );
};

export const is32BitRegister = (str: string) => {
  const gpRegisters = ["eax", "ebx", "ecx", "edx", "esi", "edi", "ebp", "esp"];

  const adgpRegisters = [
    "r8d",
    "r9d",
    "r10d",
    "r11d",
    "r12d",
    "r13d",
    "r14d",
    "r15d",
  ];

  return gpRegisters.includes(str) || adgpRegisters.includes(str);
};

export const is16BitRegister = (str: string) => {
  const gpRegisters = ["ax", "bx", "cx", "dx", "si", "di", "bp", "sp"];

  const adgpRegisters = [
    "r8w",
    "r9w",
    "r10w",
    "r11w",
    "r12w",
    "r13w",
    "r14w",
    "r15w",
  ];

  return gpRegisters.includes(str) || adgpRegisters.includes(str);
};

export const is8BitRegister = (str: string) => {
  const gpRegistersLower = ["al", "bl", "cl", "dl"];
  const gpRegistersHigher = ["ah", "bh", "ch", "dh"];

  const idgpRegisters = ["sil", "dil"];

  const adgpRegisters = [
    "r8b",
    "r9b",
    "r10b",
    "r11b",
    "r12b",
    "r13b",
    "r14b",
    "r15b",
  ];

  return (
    gpRegistersLower.includes(str) ||
    gpRegistersHigher.includes(str) ||
    idgpRegisters.includes(str) ||
    adgpRegisters.includes(str)
  );
};

export const isRegister = (str: string): boolean => {
  const registers = [
    "rax",
    "rbx",
    "rcx",
    "rdx",
    "rsi",
    "rdi",
    "rbp",
    "rsp",
    "r8",
    "r9",
    "r10",
    "r11",
    "r12",
    "r13",
    "r14",
    "r15",
    "eax",
    "ebx",
    "ecx",
    "edx",
    "esi",
    "edi",
    "ebp",
    "esp",
    "ax",
    "bx",
    "cx",
    "dx",
    "si",
    "di",
    "bp",
    "sp",
    "al",
    "bl",
    "cl",
    "dl",
    "ah",
    "bh",
    "ch",
    "dh",
    "sil",
    "dil",
    "r8b",
    "r9b",
    "r10b",
    "r11b",
    "r12b",
    "r13b",
    "r14b",
    "r15b",
  ];
  return registers.includes(str.toLowerCase());
};

export const isNumericValue = (str: string): boolean => {
  return /^[0-9]+$/.test(str);
};

export const isMemoryAddress = (str: string): boolean => {
  return /^0x[0-9a-fA-F]+$/.test(str);
};

export const accessMemory = (src: any, dest: any) => {};

export const parseSingleLine = (line: string) => {
  const match = line.trim().match(/(\S+)(?:\s+(.*))?/);

  if (!match) {
    throw new Error("Invalid instruction format");
  }

  const [operation, operands = ""] = match.slice(1);
  const [operandOne = null, operandTwo = null] = operands
    .split(/[,\s]+/)
    .filter(Boolean);

  return { operation, operandOne, operandTwo };
};


export const parseAddr = ( address:String) => {
    return parseInt(address.substring(2));
}