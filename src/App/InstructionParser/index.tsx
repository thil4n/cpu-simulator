import { useEffect } from "react";
import { Button, TextArea, Select } from "@components";
import { useForm } from "@hooks";
import { InstructionParserProps, Instruction } from "@interfaces";
import { parseSingleLine } from "@utils";
import { samplePrograms } from "@lib";

const optList = Object.keys(samplePrograms).map((key) => ({
  id: key,
  title: key,
}));

const InstructionParser: React.FC<InstructionParserProps> = ({
  setInstructions,
}) => {
  const { formData, handleChange, setFormData } = useForm({
    instructions: "",
    sampleProgram: "",
  });

  const parseInstructions = () => {
    const lines = formData.instructions.trim().split("\n").filter(Boolean);
    const instructions: Instruction[] = lines.map((line) =>
      parseSingleLine(line.trim())
    );
    setInstructions(instructions);
  };

  useEffect(() => {
    const selectedProgram = samplePrograms[formData.sampleProgram];

    if (selectedProgram) {
      setFormData({ instructions: selectedProgram });
    }
  }, [formData.sampleProgram]);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center gap-2">
        <Select
          name="sampleProgram"
          optList={optList}
          handleChange={handleChange}
          value={formData.sampleProgram}
          label="Sample Programs"
          placeholder="Choose a sample"
          labelClassName="text-secondary"
        />
      </div>

      <TextArea
        name="instructions"
        handleChange={handleChange}
        value={formData.instructions}
        rows={10}
        inputClassName="p-4 text-secondary"
      />

      <Button
        text="Parse Instructions"
        handleClick={parseInstructions}
        className="w-full"
      />
    </div>
  );
};

export default InstructionParser;
