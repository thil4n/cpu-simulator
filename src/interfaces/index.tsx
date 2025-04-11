export interface Register {
  key: string;
  code: number;
  desc: string;
}

export interface CacheMem {
  [key: string]: Register;
}

export interface Instruction {
  operation: string;
  operandOne: string | null;
  operandTwo: string | null;
}

export interface InstructionParserProps {
  setInstructions: React.Dispatch<React.SetStateAction<Instruction[]>>;
}

export interface Memory {
  index: number;
  value;
}
