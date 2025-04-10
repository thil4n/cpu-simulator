import { Button, TextArea } from "@components";
import { useForm } from "@hooks";
import { InstructionParserProps, Instruction } from "@interfaces";
import { parseSingleLine } from "@utils";

const InstructionParser: React.FC<InstructionParserProps> = ({
  setInstructions,
}) => {
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
    <div className="flex gap-4">
      <div>Sample programs</div>
      <div>
        {" "}
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
    </div>
  );
};

export default InstructionParser;
