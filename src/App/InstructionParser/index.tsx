import { useEffect } from "react";
import { Button, TextArea, Select } from "@components";
import { useForm } from "@hooks";
import { InstructionParserProps, Instruction } from "@interfaces";
import { bitArrayToNumber, parseHexOpCodes, parseSingleLine } from "@utils";
import { assemble, samplePrograms } from "@lib";
import {
    useRegisterContext,
    useMemoryContext,
    useLoggerContext,
} from "@context";

const optList = Object.keys(samplePrograms).map((key) => ({
    id: key,
    title: key,
}));

const InstructionParser: React.FC<InstructionParserProps> = ({
    handleClose,
}) => {
    const { formData, handleChange, setFormData } = useForm({
        instructions: "",
        sampleProgram: "",
    });

    const { setMemoryBytes } = useMemoryContext();
    const { registers } = useRegisterContext();
    const logger = useLoggerContext();

    const parseInstructions = () => {
        const lines = formData.instructions.trim().split("\n").filter(Boolean);

        let opcodes: number[] = [];

        logger.info(`Parsing and assembling instructions`);

        lines.forEach((line: string) => {
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

            opcodes.push(...opcode);
        });

        setMemoryBytes(bitArrayToNumber(registers.rip), opcodes);
        handleClose();
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
