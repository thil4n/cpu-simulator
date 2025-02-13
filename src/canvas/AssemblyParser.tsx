import { Button, TextArea } from "@components";
import { useForm } from "@hooks";
import { AssemblyParserProps, Instruction } from "@interfaces";
import { parseSingleLine } from "@utils";

const AssemblyParser: React.FC<AssemblyParserProps> = ({ setInstructions }) => {
  const { formData, handleChange } = useForm({
    instructions: "",
  });

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
