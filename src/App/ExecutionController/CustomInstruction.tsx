import { Button, Input } from "@components";
import { useForm } from "@hooks";
import { CustomInstructionProps, Instruction } from "@interfaces";
import { parseHexOpCodes, parseSingleLine } from "@utils";
import { assemble } from "@lib";
import { useLoggerContext } from "@context";

const CustomInstruction: React.FC<CustomInstructionProps> = ({
    handleExecution,
}) => {
    const { formData, handleChange } = useForm({
        instruction: "",
    });

    const logger = useLoggerContext();

    const executeInstruction = () => {
        const line = formData.instruction.trim();
        const instruction: Instruction = parseSingleLine(line);

        const opcode = assemble(instruction);

        const instructionStr = `${instruction.operation} ${
            instruction.operandOne
        }, ${instruction.operandTwo || ""}`;

        logger.info(
            `Instruction : ${instructionStr} | Opcode : ${parseHexOpCodes(
                opcode
            )}`
        );

        handleExecution(line);
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            <Input
                name="instruction"
                handleChange={handleChange}
                value={formData.instruction}
                rows={10}
                inputClassName="p-4 text-secondary"
            />

            <Button
                text="Execute"
                handleClick={executeInstruction}
                className="w-full"
            />
        </div>
    );
};

export default CustomInstruction;
