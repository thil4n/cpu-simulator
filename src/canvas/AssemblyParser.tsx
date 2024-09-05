import { toast } from "react-toastify";

import { Button, TextArea } from "@components";
import { useForm } from "@hooks";

const AssemblyParser = ({ setInstructions }) => {
    const { formData, setFormData, errors, handleChange, setErrors } = useForm({
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
        let instructions = [];

        const lines = formData.instructions.trim().split("\n").filter(Boolean);

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line) {
                const instruction = parseSingleLine(line);
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
