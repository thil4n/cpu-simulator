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
    handleClose: () => void;
}
export interface CustomInstructionProps {
    handleExecution: (instruction: string) => void;
}

export interface Memory {
    index: number;
}
