import { Button, TextArea } from "@components";
import { useForm } from "@hooks";

interface Instruction {
    operation: string;
    operandOne: string | null;
    operandTwo: string | null;
}

interface AssemblyParserProps {
    setInstructions: React.Dispatch<React.SetStateAction<Instruction[]>>;
}

const AssemblyParser: React.FC<AssemblyParserProps> = ({ setInstructions }) => {
    const { formData, handleChange } = useForm({
        instructions: "",
    });

    const parseSingleLine = (line: string) => {
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

    const praseInstructions = async () => {
        let instructions: Instruction[] = [];

        const lines = formData.instructions.trim().split("\n").filter(Boolean);

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line) {
                const instruction: Instruction = parseSingleLine(line);
                instructions.push(instruction);
            }
        }

        setInstructions(instructions);
    };

    return (
        <div>
            <TextArea
                name="instructions"
                handleChange={handleChange}
                value={formData.instructions}
                rows={10}
            />
            <Button
                text={`Prase Instructions`}
                handleClick={praseInstructions}
                className="w-full"
            />
        </div>
    );
};

export default AssemblyParser;
