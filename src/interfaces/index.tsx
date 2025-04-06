export interface Register {
    key: string;
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

export interface Memory {
    index: number;
    value;
}
