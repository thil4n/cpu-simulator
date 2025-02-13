export interface Register {
  key: string;
  data: number | null;
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

export interface AssemblyParserProps {
  setInstructions: React.Dispatch<React.SetStateAction<Instruction[]>>;
}
