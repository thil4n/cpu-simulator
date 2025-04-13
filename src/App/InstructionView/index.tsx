import { useMemoryContext, useRegisterContext } from "@context";
import { bitArrayToNumber, parseSingleLine } from "@utils";
import { disassemble } from "@lib";
import { Cpu } from "lucide-react";
import { TXT_START } from "@config";

interface instructionLine {
    instruction: string;
    isCurrent: boolean;
}

const InstructionView = () => {
    const { getMemoryBytes } = useMemoryContext();
    const { registers } = useRegisterContext();

    const rip = bitArrayToNumber(registers.rip);

    let tempPtr = TXT_START;

    const instructions: instructionLine[] = [];

    let fetch = true;
    while (fetch) {
        const opcodes = getMemoryBytes(rip, 10);
        console.log("opcodes : " + opcodes);

        try {
            const { instruction, length } = disassemble(opcodes);

            instructions.push({ instruction, isCurrent: tempPtr == rip });

            tempPtr += length;
        } catch (error) {
            fetch = false;
        }
    }

    return (
        <div>
            <h1 className="bg-primary text-secondary w-full py-1 text-sm text-center uppercase">
                ASSEMBLY INSTRUCTIONS
            </h1>
            <div className="bg-[#555] bg-opacity-50 backdrop-blur-lg px-6 py-4 min-h-[400px]">
                {instructions.map((line: instructionLine) => {
                    const { operation, operandOne, operandTwo } =
                        parseSingleLine(line.instruction);
                    return (
                        <div
                            className={`flex py-1 px-2 border-b border-secondary cursor-pointer
                ${
                    line.isCurrent
                        ? "bg-secondary text-white"
                        : "hover:bg-primary text-slate-400 hover:text-secondary"
                }
            `}
                        >
                            {" "}
                            <div className="w-32">{operation}</div>
                            <div className="w-[300px]">{operandOne}</div>
                            <div className="">{operandTwo}</div>
                        </div>
                    );
                })}
                {instructions.length == 0 && (
                    <div className="w-full flex flex-col justify-center items-center">
                        <Cpu
                            size={64}
                            className="text-7xl text-secondary mb-4"
                        />
                        <h1 className="text-secondary text-sm">
                            No instructions loaded. Click on Load Program to
                            load instructions.
                        </h1>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InstructionView;
