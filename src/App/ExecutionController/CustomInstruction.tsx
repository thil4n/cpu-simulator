import { Button, Input } from "@components";
import { useForm } from "@hooks";
import { CustomInstructionProps, Instruction } from "@interfaces";
import { parseHexOpCodes, parseSingleLine } from "@utils";
import { assemble } from "@lib";
import { useLoggerContext } from "@context";

const CustomInstruction: React.FC<CustomInstructionProps> = ({
    handleClose,
}) => {
    const { formData, handleChange } = useForm({
        instruction: "",
    });

    const logger = useLoggerContext();

    const parseInstructions = (line: string) => {
        const instruction: Instruction = parseSingleLine(line.trim());

        const opcode = assemble(instruction);

        const instructionStr = `${instruction.operation} ${
            instruction.operandOne
        } ${instruction.operandTwo || ""}`;

        logger.info(
            `Instruction : ${instructionStr} | Opcode : ${parseHexOpCodes(
                opcode
            )}`
        );

        handleClose();
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            <Input
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

export default CustomInstruction;
